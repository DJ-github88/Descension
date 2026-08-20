// ============================================
// INQUISITOR — WITCH HAMMER (v2: talents are spells)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50.
// Resources: Righteous Authority + Dominance Dice (DD) for bound Wyrd-hounds.
// The pack tree: bind a Wyrd pack, strike from stealth with cold iron.
// ============================================

export const INQUISITOR_WITCH_HAMMER = [
  {
    id: "wh_t1_wyrd_pack",
    name: "Wyrd Pack",
    icon: "spell_shadow_summonfelguard",
    maxRanks: 3,
    position: { x: 0.5, y: 0 },
    requires: null,
    spell: {
      name: "Wyrd Pack",
      description: "The Inquisitor purges with cold iron that remembers the Wyrd's first name. Bind up to 2 Wyrd-hounds simultaneously. While at 3 or more Authority and in stealth, your stealth attacks deal +1d6 additional damage.",
      flavorText: "The iron remembers. The hounds obey. Mostly both at once.",
      source: "talent", class: "Inquisitor", treeId: "witch_hammer",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", damageTypes: ["slicing"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["passive", "bind", "pack", "inquisitor"]
    },
    rankUpgrades: [
      { description: "Bind up to 3 Wyrd-hounds; at 3+ Authority in stealth, your stealth attacks deal +2d6 additional damage and Authority decays 50% slower while hounds are bound.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } },
      { description: "Bind up to 4 Wyrd-hounds; at 3+ Authority in stealth, attacks deal +3d6 additional damage, Authority decays 50% slower, and each bound hound grants you +5 feet movement.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "wh_t1_bind_hound",
    name: "Bind Wyrd-hound",
    icon: "spell_shadow_enslavedemon",
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    spell: {
      name: "Bind Wyrd-hound",
      description: "Bind a Wyrd-spawn to your service: it fights at your side with a Dominance Die (d10) that degrades one step per action. The hound deals 1d8 wyrd damage per attack. Costs 2 Authority.",
      flavorText: "The leash is doctrine. The teeth are incidental.",
      source: "talent", class: "Inquisitor", treeId: "witch_hammer",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "single", rangeType: "ranged", range: 60,
      castTimeType: "short", castTimeValue: 1,
      cooldownCategory: "medium", cooldownValue: 15, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: true,
      resourceCosts: { authority: { baseAmount: 2 }, mana: { baseAmount: 6 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      damageTypes: ["wyrd"],
      primaryDamage: { dice: "1d8", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["bind", "summon", "inquisitor"]
    },
    rankUpgrades: [
      { description: "Bind a Wyrd-hound (DD d10, degrades per action): it deals 2d6 wyrd damage per attack and gains +2 Durability Steps to equipped durability. Costs 2 Authority.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } },
      { description: "Bind a Wyrd-hound (DD d10): 3d6 wyrd damage per attack, +2 Durability Steps to equipped durability, and its critical hits restore 1 Authority to you. Costs 2 Authority.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "wh_t1_shadow_mastery",
    name: "Shadow Mastery",
    icon: "spell_shadow_shadowform",
    maxRanks: 2,
    position: { x: 3.5, y: 0 },
    requires: null,
    spell: {
      name: "Shadow Mastery",
      description: "You have advantage on attacks made from stealth, and at 3 or more Authority your stealth attacks also slow the target by 10 feet for 1 round.",
      flavorText: "The purge begins in the dark. It usually ends there too.",
      source: "talent", class: "Inquisitor", treeId: "witch_hammer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["slicing"],
      visualTheme: "shadow", tags: ["passive", "stealth", "slow", "inquisitor"]
    },
    rankUpgrades: [
      { description: "Advantage on stealth attacks; at 3+ Authority they deal +2d6 blight damage and slow the target 10 feet for 1 round.", damageTypes: ["slicing", "blight"], primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "wh_t2_pack_mind",
    name: "Pack Mind",
    icon: "spell_shadow_enslavedemon",
    maxRanks: 3,
    position: { x: 0.5, y: 1.5 },
    requires: "wh_t1_wyrd_pack",
    spell: {
      name: "Pack Mind",
      description: "Your mind splits to track the whole pack: your Wyrd-hounds' DD degrades every 2 actions instead of every action.",
      flavorText: "One will. Several jaws.",
      source: "talent", class: "Inquisitor", treeId: "witch_hammer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["wyrd"],
      visualTheme: "shadow", tags: ["passive", "dd", "pack", "inquisitor"]
    },
    rankUpgrades: [
      { description: "Pack DD degrades every 2 actions, and hounds attacking the same target each gain +1d6 wyrd damage.", primaryDamage: { dice: "1d6", flat: 0, procChance: 100 } },
      { description: "Pack DD degrades every 3 actions; focused pack attacks gain +2d6 wyrd damage each, and a hound at d4 DD can sacrifice itself to restore another's DD by one step." }
    ]
  },
  {
    id: "wh_t2_swarm_tactics",
    name: "Swarm Tactics",
    icon: "spell_shadow_curseofsargeras",
    maxRanks: 3,
    position: { x: 3.5, y: 1.5 },
    requires: "wh_t1_bind_hound",
    spell: {
      name: "Swarm Tactics",
      description: "When 3 or more of your Wyrd-hounds attack the same target in a round, each of those attacks deals 1d6 additional sacred damage.",
      flavorText: "Coordinated violence is still doctrine. Especially then.",
      source: "talent", class: "Inquisitor", treeId: "witch_hammer",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["sacred"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["passive", "pack", "focus", "inquisitor"]
    },
    rankUpgrades: [
      { description: "3+ hounds on one target: each attack deals 2d6 additional sacred damage.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } },
      { description: "3+ hounds on one target: each attack deals 3d6 additional sacred damage, and the target cannot disengage from the pack.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "wh_t3_steady_rein",
    name: "Steady Rein",
    icon: "spell_holy_exorcism",
    maxRanks: 3,
    position: { x: 2, y: 3 },
    requires: "wh_t2_pack_mind",
    spell: {
      name: "Steady Rein",
      description: "Your grip holds under pressure: spend 1 Authority to restore one DD step on a bound hound.",
      flavorText: "The rein tightens. The hound remembers the contract.",
      source: "talent", class: "Inquisitor", treeId: "witch_hammer",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "single", rangeType: "ranged", range: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 8, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { authority: { baseAmount: 1 } },
      damageTypes: ["wyrd"],
      visualTheme: "shadow", tags: ["dd", "restore", "pack", "inquisitor"]
    },
    rankUpgrades: [
      { description: "Spend 1 Authority to restore one DD step on a hound; if used on a d10 hound, it instead gains +1d6 damage this turn.", primaryDamage: { dice: "1d6", flat: 0, procChance: 100 } },
      { description: "Spend 1 Authority: restore one DD step on ALL bound hounds. Twice per round." }
    ]
  },
  {
    id: "wh_t3_silent_execution",
    name: "Silent Execution",
    icon: "ability_rogue_ambush",
    maxRanks: 3,
    position: { x: 2.5, y: 3 },
    requires: "wh_t2_swarm_tactics",
    spell: {
      name: "Silent Execution",
      description: "Stealth attacks against supernatural targets cannot be reduced; if the target is below half health, deal 2d6 additional blight damage.",
      flavorText: "The Wyrd have first names. Your blade learned them all.",
      source: "talent", class: "Inquisitor", treeId: "witch_hammer",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["blight"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["passive", "execute", "stealth", "inquisitor"]
    },
    rankUpgrades: [
      { description: "Stealth attacks on supernatural targets: unreducible damage, +3d6 blight below half health.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } },
      { description: "Stealth attacks on supernatural targets: unreducible damage, +4d6 blight below half health, and such kills restore 2 Authority.", primaryDamage: { dice: "4d6", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "wh_t4_mass_restoration",
    name: "Mass Restoration",
    icon: "spell_holy_circleofrenewal",
    maxRanks: 3,
    position: { x: 2, y: 4.5 },
    requires: "wh_t3_steady_rein",
    spell: {
      name: "Mass Restoration",
      description: "One lash fortifies the whole pack: when you restore a hound's DD, all other bound hounds gain half the restoration.",
      flavorText: "Discipline is distributable.",
      source: "talent", class: "Inquisitor", treeId: "witch_hammer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["sacred"],      visualTheme: "shadow", tags: ["passive", "dd", "pack", "inquisitor"]
    },
    rankUpgrades: [
      { description: "One lash fortifies all: DD restoration applies at FULL effect to every bound hound, and each restoration grants 1 Authority." },
      { description: "Full-effect pack restoration, 1 Authority per use, and hounds at maximum DD convert the restoration into 1d6 sacred bonus damage instead.", primaryDamage: { dice: "1d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "wh_t4_wyrd_cyclone",
    name: "Wyrd Cyclone",
    icon: "spell_shadow_lifedrain",
    maxRanks: 2,
    position: { x: 2.5, y: 4.5 },
    requires: "wh_t3_silent_execution",
    spell: {
      name: "Wyrd Cyclone",
      description: "Once per combat: command all bound Wyrd-hounds to strike simultaneously. Each hound degrades its DD by 1 step but deals 2d6 additional sacred damage on the attack. Costs 2 Authority.",
      flavorText: "Release the pack. Briefly. Loudly.",
      source: "talent", class: "Inquisitor", treeId: "witch_hammer",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 90, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { authority: { baseAmount: 2 } },
      damageTypes: ["sacred"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["pack", "burst", "command", "inquisitor"]
    },
    rankUpgrades: [
      { description: "Once per combat: all hounds strike simultaneously for +3d6 sacred damage each, with NO DD degradation. Costs 2 Authority.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "wh_t5_pack_alpha",
    name: "Pack Alpha",
    icon: "spell_shadow_demonicempathy",
    maxRanks: 3,
    position: { x: 2, y: 6 },
    requires: "wh_t4_mass_restoration",
    spell: {
      name: "Pack Alpha",
      description: "Your Wyrd-hounds no longer degrade DD on their first action each turn.",
      flavorText: "The pack has learned who feeds it.",
      source: "talent", class: "Inquisitor", treeId: "witch_hammer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["wyrd"],
      visualTheme: "shadow", tags: ["passive", "dd", "pack", "inquisitor"]
    },
    rankUpgrades: [
      { description: "Hounds skip DD degradation on their first action each turn, and while commanding 2+ hounds your stealth attacks gain +2d6 sacred damage.", damageTypes: ["sacred"], primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } },
      { description: "Hounds skip DD degradation on first actions; with 2+ hounds bound your stealth attacks gain +3d6 sacred damage and cannot be dodged.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "wh_t5_hunters_authority",
    name: "Hunter's Authority",
    icon: "ability_hunter_markedfordeath",
    maxRanks: 2,
    position: { x: 2.5, y: 6 },
    requires: "wh_t4_wyrd_cyclone",
    spell: {
      name: "Hunter's Authority",
      description: "The hunt legitimizes itself: each enemy damaged by a bound hound grants you 1 Authority (once per enemy per round).",
      flavorText: "Every wound the pack lands is a signature on your writ.",
      source: "talent", class: "Inquisitor", treeId: "witch_hammer",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "authority", "engine", "inquisitor"]
    },
    rankUpgrades: [
      { description: "Each enemy damaged by a hound grants 1 Authority (once per enemy per round), and kills by the pack grant 2 Authority." }
    ]
  },

  {
    id: "wh_t6_cold_iron_doctrine",
    name: "Cold Iron Doctrine",
    icon: "spell_holy_exorcism",
    maxRanks: 1,
    position: { x: 1.5, y: 7 },
    requires: "wh_t5_pack_alpha",
    spell: {
      name: "Cold Iron Doctrine",
      description: "Your weapons and your hounds' claws are anointed in remembering iron: all your and your pack's attacks ignore wyrd resistance, and supernatural enemies hit by them cannot heal for 1 round. Costs 3 Authority to anoint for 1 minute.",
      flavorText: "The iron that remembers the Wyrd's first name also remembers how to spell it. Backwards.",
      source: "talent", class: "Inquisitor", treeId: "witch_hammer",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 60, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { authority: { baseAmount: 3 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      buffs: ["cold-iron"], damageTypes: ["sacred"],
      visualTheme: "shadow", tags: ["anoint", "penetration", "pack", "inquisitor"]
    }
  },
  {
    id: "wh_t6_undisputed",
    name: "Undisputed",
    icon: "spell_shadow_demonicempathy",
    maxRanks: 2,
    position: { x: 2, y: 7 },
    requires: "wh_t5_hunters_authority",
    spell: {
      name: "Undisputed",
      description: "You are the sole commander of the Wyrd pack: your Authority maximum increases by 2, and hounds you command cannot be banished, dominated, or turned while you hold 3+ Authority.",
      flavorText: "Contested authority is a heresy. The hounds checked.",
      source: "talent", class: "Inquisitor", treeId: "witch_hammer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "authority", "pack", "inquisitor"]
    },
    rankUpgrades: [
      { description: "Authority maximum +4; at 3+ Authority your hounds are unbanishable, undominatable, and deal 25% more damage." }
    ]
  },
  {
    id: "wh_t6_shared_stealth",
    name: "Shared Stealth",
    icon: "spell_shadow_shadowmeld",
    maxRanks: 2,
    position: { x: 2.5, y: 7 },
    requires: "wh_t5_pack_alpha",
    spell: {
      name: "Shared Stealth",
      description: "When you enter stealth, your bound hounds vanish with you. The pack's stealth attacks from this shared stealth each gain +1d6 blight damage.",
      flavorText: "The whole purge goes quiet at once.",
      source: "talent", class: "Inquisitor", treeId: "witch_hammer",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["blight"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["passive", "stealth", "pack", "inquisitor"]
    },
    rankUpgrades: [
      { description: "You and the pack share stealth; shared-stealth attacks deal +2d6 blight damage each and the first pack attack from stealth is an automatic crit.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "wh_t7_the_purging",
    name: "The Purging",
    icon: "spell_shadow_summonfelguard",
    maxRanks: 1,
    position: { x: 0, y: 8 },
    requires: "wh_t6_cold_iron_doctrine",
    spell: {
      name: "The Purging",
      description: "ULTIMATE: For 1 minute, the full doctrine unrolls: bind up to 6 Wyrd-hounds regardless of slot limits, all DD degradation pauses, every attack — yours and the pack's — deals maximum damage to supernatural targets, and each enemy the pack kills restores 2 Authority and one DD step to every surviving hound. Costs all current Authority (minimum 4).",
      flavorText: "The writ is signed. The names are written. The pack is hungry.",
      source: "talent", class: "Inquisitor", treeId: "witch_hammer",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 300, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { authority: { baseAmount: 6 }, mana: { baseAmount: 15 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      buffs: ["the-purging"], damageTypes: ["sacred", "wyrd"],
      visualTheme: "shadow", tags: ["ultimate", "capstone", "pack", "inquisitor"]
    }
  },
  {
    id: "wh_t7_writ_of_binding",
    name: "Writ of Binding",
    icon: "inv_scroll_03",
    maxRanks: 5,
    position: { x: 1, y: 8 },
    requires: "wh_t6_shared_stealth",
    spell: {
      name: "Writ of Binding",
      description: "The writ grows longer: your Authority maximum increases by 1.",
      flavorText: "More signatures, more hounds.",
      source: "talent", class: "Inquisitor", treeId: "witch_hammer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "capstone", "authority", "inquisitor"]
    },
    rankUpgrades: [
      { description: "The writ grows longer: your Authority maximum increases by 2." },
      { description: "The writ grows longer: your Authority maximum increases by 3." },
      { description: "The writ grows longer: your Authority maximum increases by 4." },
      { description: "The writ grows longer: Authority maximum +5, and Bind Wyrd-hound costs 1 Authority." }
    ]
  },
  {
    id: "wh_t7_houndmaster_general",
    name: "Houndmaster General",
    icon: "spell_shadow_enslavedemon",
    maxRanks: 3,
    position: { x: 2, y: 8 },
    requires: "wh_t6_shared_stealth",
    spell: {
      name: "Houndmaster General",
      description: "Bound hounds inherit your doctrine: their attacks count as yours for Silent Execution and Cold Iron Doctrine effects.",
      flavorText: "The pack carries signed copies of the writ. In their teeth.",
      source: "talent", class: "Inquisitor", treeId: "witch_hammer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["sacred", "blight"],
      visualTheme: "shadow", tags: ["passive", "capstone", "synergy", "inquisitor"]
    },
    rankUpgrades: [
      { description: "Hounds inherit Silent Execution and Cold Iron Doctrine; their kills trigger your Authority gains." },
      { description: "Hounds inherit all doctrine effects, and when a hound lands the killing blow on a supernatural enemy it returns to full DD instead of degrading." }
    ]
  },
  {
    id: "wh_t7_first_name_iron",
    name: "First-Name Iron",
    icon: "ability_warrior_weaponmastery",
    maxRanks: 3,
    position: { x: 3, y: 8 },
    requires: "wh_t6_undisputed",
    spell: {
      name: "First-Name Iron",
      description: "Your cold iron has finished its recollection: all your damage against supernatural creatures is increased by 15%.",
      flavorText: "It knows their first names. It enunciates.",
      source: "talent", class: "Inquisitor", treeId: "witch_hammer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["sacred", "blight"],
      visualTheme: "shadow", tags: ["passive", "capstone", "damage", "inquisitor"]
    },
    rankUpgrades: [
      { description: "All your damage against supernatural creatures is increased by 25%." },
      { description: "All your damage against supernatural creatures is increased by 40%, and critical hits against them seal their magic for 1 round." }
    ]
  },
  {
    id: "wh_t7_quiet_writ",
    name: "Quiet Writ",
    icon: "ability_rogue_shadowstrike",
    maxRanks: 3,
    position: { x: 4, y: 8 },
    requires: "wh_t6_undisputed",
    spell: {
      name: "Quiet Writ",
      description: "The purge leaves no paperwork: enemies killed by you or your pack from stealth die silently, without alerts, and their deaths cannot be scried.",
      flavorText: "Officially, nothing happened. Unofficially, everything did.",
      source: "talent", class: "Inquisitor", treeId: "witch_hammer",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", damageTypes: ["blight"],
      visualTheme: "shadow", tags: ["passive", "capstone", "stealth", "inquisitor"]
    },
    rankUpgrades: [
      { description: "Stealth kills are silent and untraceable; witnesses must pass a Perception check at disadvantage, and divination about the death fails for 1 hour." },
      { description: "Stealth kills are silent, untraceable, and for 1 round afterwards nearby enemies do not perceive that their ally is gone." }
    ]
  }
];
