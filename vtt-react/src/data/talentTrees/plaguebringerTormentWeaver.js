// ============================================
// PLAGUEBRINGER — TORMENT WEAVER (v3: spec identity redesign)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50.
//
// SPEC IDENTITY: The Psychic Agony Conductor / Voodoo Linker.
// You do not care about disease stacks or spores — you care about LINKING ENEMIES
// into a shared nervous system. Damage done to one linked enemy echoes to all others.
// Crowd control, debuffs, and death rattles reverberate through the entire web.
//
// SIGNATURE ACTIVES:
//   - Agony Tether (t1):         Bind two targets together to share 50% of all damage
//   - Synaptic Siphon (t2):      Drain life/mana through the link network
//   - Torment Web (t3):          Deploy an explicit 3-way agony mesh
//   - Psychic Storm (t4):        AoE nightmare zone that accelerates all link echo damage
//   - Mass Resonance (t5):       Detonate all active links in a synchronized psychic blast
//   - Sympathetic Collapse (t6): Force all linked targets to suffer maximum agony
//   - The Grand Puppet (t7):     ULTIMATE — Turn an enemy into a psychic conduit transferring 100% damage to all foes
// ============================================

export const PLAGUEBRINGER_TORMENT_WEAVER = [
  // ──────────────── TIER 1 (8 pts) ────────────────
  {
    id: "tw_t1_agony_tether",
    name: "Agony Tether",
    icon: "spell_shadow_mindtwisting",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Agony Tether",
      description: "Shoot a psychic tether binding an enemy within 45 feet to a secondary target within 30 feet of it for 1 minute: whenever the primary target takes damage, the secondary takes 25 points of that damage as wyrd damage.",
      flavorText: "Suffering loves company. You arranged the introduction.",
      source: "talent", class: "Plaguebringer", treeId: "torment_weaver",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "single", rangeType: "ranged", range: 45,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 8, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 4 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      debuffs: ["tethered"], damageTypes: ["wyrd"],
      visualTheme: "poison", tags: ["link", "damage-share", "wyrd", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "Tether shares 25 points of all damage and both targets take 1d6 wyrd damage each time the tether echoes.", primaryDamage: { dice: "1d6", flat: 0, procChance: 100 } },
      { description: "Tether shares 25 points of all damage, echoes deal 2d6 wyrd damage, and the tether can bind a 3rd target for 25 points shared damage.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "tw_t1_resonance_damage",
    name: "Resonant Agony",
    icon: "spell_shadow_shadowwordpain",
    maxRanks: 3,
    position: { x: 2.5, y: 0 },
    requires: null,
    spell: {
      name: "Resonant Agony",
      description: "Whenever a linked target takes damage from any source, all other linked targets take 1d4 additional wyrd damage.",
      flavorText: "One pulls the thread. Everyone remembers why.",
      source: "talent", class: "Plaguebringer", treeId: "torment_weaver",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["wyrd"],
      primaryDamage: { dice: "1d4", flat: 0, procChance: 100 },
      visualTheme: "poison", tags: ["passive", "link", "resonance", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "Linked targets take 1d6 additional wyrd damage on any resonance trigger.", primaryDamage: { dice: "1d6", flat: 0, procChance: 100 } },
      { description: "Linked targets take 2d6 additional wyrd damage, and each resonance trigger restores 1 Virulence.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "tw_t1_shared_torment",
    name: "Shared Torment",
    icon: "spell_nature_mirrorimage",
    maxRanks: 2,
    position: { x: 4, y: 0 },
    requires: null,
    spell: {
      name: "Shared Torment",
      description: "Whenever a debuff or crowd control effect (slow, stun, silence) is applied to one linked target, all other linked targets suffer 25 points of the duration.",
      flavorText: "The burden, redistributed.",
      source: "talent", class: "Plaguebringer", treeId: "torment_weaver",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", visualTheme: "poison", tags: ["passive", "link", "cc-share", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "Debuffs and CC mirror to all linked targets at 25 points of full duration." }
    ]
  },

  // ──────────────── TIER 2 (6 pts) ────────────────
  {
    id: "tw_t2_synaptic_siphon",
    name: "Synaptic Siphon",
    icon: "spell_shadow_mindsteal",
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: "tw_t1_agony_tether",
    spell: {
      name: "Synaptic Siphon",
      description: "Spend 2 Virulence: siphon through the psychic web. Deals 2d8 wyrd damage to ALL currently linked targets simultaneously and heals you for 50 points of the total damage dealt.",
      flavorText: "Bulk rate for bulk suffering.",
      source: "talent", class: "Plaguebringer", treeId: "torment_weaver",
      spellType: "ACTIVE", category: "healing",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 10, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { virulence: { baseAmount: 2 } },
      damageTypes: ["wyrd"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      visualTheme: "poison", tags: ["siphon", "lifesteal", "link", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "Deals 3d8 wyrd damage to all linked targets, heals for 50 points, and restores 5 mana per linked target hit.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } },
      { description: "Deals 3d8 wyrd damage to all linked targets, heals for 50 points, restores 10 mana per target, and silences linked targets for 1 round.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "tw_t2_nightmare_fuel",
    name: "Psychic Vulnerability",
    icon: "spell_shadow_curseofsargeras",
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: "tw_t1_resonance_damage",
    spell: {
      name: "Psychic Vulnerability",
      description: "Linked enemies have their saving throws reduced by -2 and suffer +1d6 bonus damage from all psychic and wyrd sources.",
      flavorText: "Their dreams are flammable. You brought a match.",
      source: "talent", class: "Plaguebringer", treeId: "torment_weaver",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", damageTypes: ["wyrd"],
      visualTheme: "poison", tags: ["passive", "debuff", "saves", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "Linked enemies take -3 on saving throws and take 25 points more wyrd damage." },
      { description: "Linked enemies take -4 on saves, 35 points more wyrd damage, and have their durability reduced by -3." }
    ]
  },

  // ──────────────── TIER 3 (6 pts) ────────────────
  {
    id: "tw_t3_torment_web",
    name: "Torment Web",
    icon: "spell_shadow_soulleech",
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: "tw_t2_synaptic_siphon",
    spell: {
      name: "Torment Web",
      description: "Spend 3 Virulence: trap up to 4 enemies in a 30-foot area inside an Agony Mesh for 1 minute. All trapped targets are permanently linked together: 25 points of damage taken by any one target is dealt to all others.",
      flavorText: "The web is not a metaphor. It is load-bearing.",
      source: "talent", class: "Plaguebringer", treeId: "torment_weaver",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "aoe", rangeType: "ranged", range: 60, aoeShape: "circle", aoeSize: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 18, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { virulence: { baseAmount: 3 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      debuffs: ["webbed"], damageTypes: ["wyrd"],
      visualTheme: "poison", tags: ["link", "aoe-mesh", "web", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "Traps up to 5 enemies: damage echoes at 25 points among all of them, and webbed targets are slowed by 15ft." },
      { description: "Traps up to 6 enemies: damage echoes at 25 points among all of them, webbed targets are slowed by 25ft, and the web cannot be dispelled." }
    ]
  },
  {
    id: "tw_t3_cascade_finale",
    name: "Sympathetic Cascade",
    icon: "spell_shadow_mindsteal",
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: "tw_t2_nightmare_fuel",
    spell: {
      name: "Sympathetic Cascade",
      description: "When any linked target is hit by a critical strike, ALL other linked targets take 2d8 wyrd damage.",
      flavorText: "The ending is syndicated.",
      source: "talent", class: "Plaguebringer", treeId: "torment_weaver",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["wyrd"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      visualTheme: "poison", tags: ["passive", "link", "crit-cascade", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "Critical strikes on any link deal 3d8 wyrd damage to all other linked targets.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } },
      { description: "Critical strikes on any link deal 4d8 wyrd damage to all other links, and your attacks against linked targets have critical hits on a d20 roll of 18-20.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 } }
    ]
  },

  // ──────────────── TIER 4 (5 pts) ────────────────
  {
    id: "tw_t4_psychic_storm",
    name: "Psychic Storm",
    icon: "spell_shadow_mindtwisting",
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: "tw_t3_torment_web",
    spell: {
      name: "Psychic Storm",
      description: "Spend 4 Virulence: summon a 30-foot vortex of shrieking psychic agony for 3 rounds. Deals 3d8 wyrd damage per round to all enemies inside, and doubles the damage transfer rate of all links passing through it.",
      flavorText: "Weather report: everyone, with a chance of screaming.",
      source: "talent", class: "Plaguebringer", treeId: "torment_weaver",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "ranged", range: 60, aoeShape: "circle", aoeSize: 30,
      castTimeType: "short", castTimeValue: 1,
      cooldownCategory: "medium", cooldownValue: 24, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: true,
      resourceCosts: { virulence: { baseAmount: 4 }, mana: { baseAmount: 8 } },
      durationRounds: 3, durationRealTime: 18, durationUnit: "seconds",
      damageTypes: ["wyrd"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      isDot: true, dotDuration: 3, dotTick: "3d8",
      visualTheme: "poison", tags: ["storm", "aoe", "link-amplifier", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "35-foot storm deals 4d8 wyrd per round, and non-linked enemies entering become automatically linked to the web.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 }, aoeSize: 35, dotTick: "4d8" },
      { description: "40-foot storm deals 5d8 wyrd per round, links all entrants, and enemies inside cannot take reactions.", primaryDamage: { dice: "5d8", flat: 0, procChance: 100 }, aoeSize: 40, dotTick: "5d8" }
    ]
  },
  {
    id: "tw_t4_sympathetic_pain",
    name: "Nerve Relay",
    icon: "spell_shadow_shadowwordpain",
    maxRanks: 2,
    position: { x: 3.5, y: 3 },
    requires: "tw_t3_cascade_finale",
    spell: {
      name: "Nerve Relay",
      description: "When an ally damages any linked enemy, that ally heals for for 2d6 Hit Points as the psychic feedback siphons vitality.",
      flavorText: "The blade was not invited. The web delivered anyway.",
      source: "talent", class: "Plaguebringer", treeId: "torment_weaver",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "self", visualTheme: "poison", tags: ["passive", "ally-heal", "link", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "Allies heals for for 2d6 Hit Points to linked targets, and ally critical strikes against links restore 2 Virulence to you." }
    ]
  },

  // ──────────────── TIER 5 (5 pts) ────────────────
  {
    id: "tw_t5_mass_resonance",
    name: "Mass Resonance",
    icon: "spell_arcane_arcanetorrent",
    maxRanks: 2,
    position: { x: 1, y: 4 },
    requires: "tw_t4_psychic_storm",
    spell: {
      name: "Mass Resonance",
      description: "Spend 4 Virulence: force a catastrophic feedback loop across the entire web. Every linked enemy takes 5d8 wyrd damage, is stunned for 1 round, and the links remain active.",
      flavorText: "The thread outlives the reason for it.",
      source: "talent", class: "Plaguebringer", treeId: "torment_weaver",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 30, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { virulence: { baseAmount: 4 } },
      damageTypes: ["wyrd"],
      primaryDamage: { dice: "5d8", flat: 0, procChance: 100 },
      debuffs: ["stun"], visualTheme: "poison", tags: ["nuke", "mass-stun", "link", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "Deals 7d8 wyrd damage to all linked enemies, stuns for 1 round, and reduces Mass Resonance cooldown to 24s.", primaryDamage: { dice: "7d8", flat: 0, procChance: 100 }, cooldownValue: 24 }
    ]
  },
  {
    id: "tw_t5_torment_economy",
    name: "Agony Harvest",
    icon: "spell_shadow_manafeed",
    maxRanks: 3,
    position: { x: 3, y: 4 },
    requires: "tw_t4_sympathetic_pain",
    spell: {
      name: "Agony Harvest",
      description: "Whenever a linked enemy dies, their death rattle deals 4d8 wyrd damage to all remaining linked targets and grants you 4 Virulence.",
      flavorText: "Economies of scale, applied to despair.",
      source: "talent", class: "Plaguebringer", treeId: "torment_weaver",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["wyrd"],
      primaryDamage: { dice: "4d8", flat: 0, procChance: 100 },
      visualTheme: "poison", tags: ["passive", "death-rattle", "virulence", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "Death rattle deals 6d8 wyrd damage to remaining links, grants 6 Virulence, and heals you 3d8.", primaryDamage: { dice: "6d8", flat: 0, procChance: 100 } },
      { description: "Death rattle deals 8d8 wyrd damage to remaining links, grants full Virulence, heals 5d8, and resets Synaptic Siphon cooldown.", primaryDamage: { dice: "8d8", flat: 0, procChance: 100 } }
    ]
  },

  // ──────────────── TIER 6 (5 pts) ────────────────
  {
    id: "tw_t6_sympathetic_collapse",
    name: "Sympathetic Collapse",
    icon: "spell_shadow_mindtwisting",
    maxRanks: 1,
    position: { x: 1, y: 5 },
    requires: "tw_t5_mass_resonance",
    spell: {
      name: "Sympathetic Collapse",
      description: "Spend 5 Virulence: target one linked enemy. For 2 rounds, 40 points of ALL damage taken by that target is duplicated to EVERY other linked target on the field.",
      flavorText: "One throat cut. All necks bleed.",
      source: "talent", class: "Plaguebringer", treeId: "torment_weaver",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "single", rangeType: "ranged", range: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 60, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { virulence: { baseAmount: 5 } },
      durationRounds: 2, durationRealTime: 12, durationUnit: "seconds",
      debuffs: ["total-conduit"], visualTheme: "poison", tags: ["link", "burst-amplifier", "plaguebringer"]
    },
    rankUpgrades: []
  },
  {
    id: "tw_t6_web_reinforcement",
    name: "Unbreakable Lattice",
    icon: "spell_shadow_nethercloak",
    maxRanks: 2,
    position: { x: 2.5, y: 5 },
    requires: "tw_t5_torment_economy",
    spell: {
      name: "Unbreakable Lattice",
      description: "While you maintain at least 2 linked targets, you gain +4 Durability Steps to equipped durability, 4 Damage Reduction against all-damage, and you transfer 25 points of all damage you suffer directly to the linked enemies.",
      flavorText: "The architect sits comfortably in the center of the web.",
      source: "talent", class: "Plaguebringer", treeId: "torment_weaver",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "poison", tags: ["passive", "defense", "damage-share", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "Gain +6 Durability Steps to equipped durability, 6 Damage Reduction, and transfer 40 points of damage taken directly into the linked enemies." }
    ]
  },
  {
    id: "tw_t6_synaptic_overload",
    name: "Synaptic Overload",
    icon: "spell_shadow_contagion",
    maxRanks: 2,
    position: { x: 4, y: 5 },
    requires: "tw_t5_torment_economy",
    spell: {
      name: "Synaptic Overload",
      description: "Whenever a linked target takes damage from an echo or resonance, it has a 30 points chance to be interrupted and lose its current concentration.",
      flavorText: "It is hard to chant when someone else's teeth are vibrating in your skull.",
      source: "talent", class: "Plaguebringer", treeId: "torment_weaver",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", visualTheme: "poison", tags: ["passive", "interrupt", "link", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "Echoes have a 60 points chance to interrupt concentration and reduce enemy spell damage by 20 points for 1 round." }
    ]
  },

  // ──────────────── TIER 7 / CAPSTONE (15 pts) ────────────────
  {
    id: "tw_t7_grand_puppet",
    name: "The Grand Puppet",
    icon: "spell_shadow_shadowwordpain",
    maxRanks: 1,
    position: { x: 0.5, y: 6 },
    requires: "tw_t6_sympathetic_collapse",
    spell: {
      name: "The Grand Puppet",
      description: "ULTIMATE: Take full control of one linked enemy for 1 minute: the target becomes your Grand Puppet, immediately taking a full turn under your control. While puppeted, 100 points of damage dealt to any enemy on the field is dealt to the Puppet, and 100 points of damage dealt to the Puppet is dealt to all other enemies.",
      flavorText: "Strings attached. All of them.",
      source: "talent", class: "Plaguebringer", treeId: "torment_weaver",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "single", rangeType: "ranged", range: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 180, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { virulence: { baseAmount: 6 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      debuffs: ["grand-puppet"], visualTheme: "poison", tags: ["ultimate", "capstone", "mind-control", "plaguebringer"]
    },
    rankUpgrades: []
  },
  {
    id: "tw_t7_agony_doctrine",
    name: "Agony Doctrine",
    icon: "spell_shadow_darkritual",
    maxRanks: 5,
    position: { x: 1.5, y: 6 },
    requires: "tw_t6_sympathetic_collapse",
    spell: {
      name: "Agony Doctrine",
      description: "Suffering is an exact science. All wyrd damage and resonance echo damage you deal is increased by +1d6 damage.",
      flavorText: "The master weaver leaves no slack in the line.",
      source: "talent", class: "Plaguebringer", treeId: "torment_weaver",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["wyrd"],
      visualTheme: "poison", tags: ["passive", "capstone", "damage", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "All wyrd and resonance damage increased by +1d8 damage." },
      { description: "All wyrd and resonance damage increased by +1d8 damage." },
      { description: "All wyrd and resonance damage increased by +2d8 damage." },
      { description: "All wyrd and resonance damage increased by +2d8 damage, and Agony Tether costs 0 mana." }
    ]
  },
  {
    id: "tw_t7_infinite_lattice",
    name: "Infinite Lattice",
    icon: "spell_shadow_mindtwisting",
    maxRanks: 3,
    position: { x: 2.5, y: 6 },
    requires: "tw_t6_web_reinforcement",
    spell: {
      name: "Infinite Lattice",
      description: "You may maintain up to 3 additional linked targets simultaneously, and links never break due to range or line of sight.",
      flavorText: "Once tied, distance is only an illusion.",
      source: "talent", class: "Plaguebringer", treeId: "torment_weaver",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "poison", tags: ["passive", "capstone", "link-cap", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "Maintain up to 5 additional linked targets. Link echo damage ignores 25 points of enemy damage resistances." },
      { description: "Maintain unlimited linked targets. Link echo damage ignores 10 Damage Reduction, and all allies gain +15 points damage against linked targets." }
    ]
  },
  {
    id: "tw_t7_psychic_scourge",
    name: "Psychic Scourge",
    icon: "spell_shadow_curseofsargeras",
    maxRanks: 3,
    position: { x: 3.5, y: 6 },
    requires: "tw_t6_web_reinforcement",
    spell: {
      name: "Psychic Scourge",
      description: "Whenever a linked enemy casts a spell or makes an attack, it takes 2d8 wyrd damage from the strain on the neural web.",
      flavorText: "Every motion plucks the strings.",
      source: "talent", class: "Plaguebringer", treeId: "torment_weaver",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["wyrd"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      visualTheme: "poison", tags: ["passive", "capstone", "punish", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "Actions by linked enemies deal 3d8 wyrd damage to the actor and 1d8 to all other links.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } },
      { description: "Actions by linked enemies deal 4d8 wyrd damage to the actor and 2d8 to all other links, and the actor must save or fail their action entirely.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "tw_t7_vampiric_mesh",
    name: "Vampiric Mesh",
    icon: "spell_shadow_lifedrain02",
    maxRanks: 3,
    position: { x: 4.5, y: 6 },
    requires: "tw_t6_synaptic_overload",
    spell: {
      name: "Vampiric Mesh",
      description: "You and all allies within 30 feet heal for 15 points of all resonance and echo damage dealt across the entire network.",
      flavorText: "A banquet extracted from the chorus.",
      source: "talent", class: "Plaguebringer", treeId: "torment_weaver",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "self", visualTheme: "poison", tags: ["passive", "capstone", "lifesteal", "party-heal", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "Party heals for 25 points of all echo damage, and overheal becomes temporary health up to 30." },
      { description: "Party heals for 40 points of all echo damage, overheal becomes temporary health up to 60, and allies gain +2 Durability Steps to equipped durability while at max temp HP." }
    ]
  }
];
