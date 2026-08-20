// ============================================
// TOXICOLOGIST — SABOTEUR (v2: talents are spells)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50.
// The chaos tree: disruption, debuffs, reality glitches. Wyrd damage.
// ============================================

export const TOXICOLOGIST_SABOTEUR = [
  {
    id: "sb2_t1_disruption_core",
    name: "Disruption Core",
    icon: "ability_rogue_wrongfullyaccused",
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    spell: {
      name: "Disruption Core",
      description: "Your presence sows chaos and disorder. Enemies within 30 feet have disadvantage on concentration checks.",
      flavorText: "You do not interrupt. You are the interruption.",
      source: "talent", class: "Toxicologist", treeId: "saboteur",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "aura", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Your presence sows chaos and disorder. Enemies within 30 feet have disadvantage on concentration checks and suffer -1 to attack rolls." },
      { description: "Your presence sows chaos and disorder. Enemies within 45 feet have disadvantage on concentration checks and suffer -2 to attack rolls." }
    ]
  },
  {
    id: "sb2_t1_flash_powder",
    name: "Flash Powder",
    icon: "inv_misc_dust_02",
    maxRanks: 3,
    position: { x: 2.5, y: 0 },
    requires: null,
    spell: {
      name: "Flash Powder",
      description: "A pouch of alchemically volatile dust. Throw it at a point within 30 feet: enemies within 10 feet must save or be blinded for 1 round and take 1d8 wyrd damage.",
      flavorText: "Chemistry's rudest sentence.",
      source: "talent", class: "Toxicologist", treeId: "saboteur",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "aoe", rangeType: "ranged", range: 30, aoeShape: "circle", aoeSize: 10,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 10, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 8 } },
      damageTypes: ["wyrd"],
      primaryDamage: { dice: "1d8", flat: 0, procChance: 100 },
      debuffs: ["blinded"], visualTheme: "arcane", tags: ["blind", "control", "toxicologist"]
    },
    rankUpgrades: [
      { description: "A pouch of alchemically volatile dust. Throw it at a point within 40 feet: enemies within 15 feet must save or be blinded for 2 rounds and take 2d8 wyrd damage.", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 } },
      { description: "A pouch of alchemically volatile dust. Throw it at a point within 40 feet: enemies within 15 feet must save or be blinded for 2 rounds, deafened for 1 minute, and take 3d8 wyrd damage.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "sb2_t1_psych_warfare",
    name: "Psychological Warfare",
    icon: "spell_shadow_mindtwisting",
    maxRanks: 2,
    position: { x: 3, y: 0 },
    requires: null,
    spell: {
      name: "Psychological Warfare",
      description: "Your sabotage breaks minds before bodies. Enemies affected by your abilities have disadvantage on Spirit saves, and your fear effects last 1 additional round.",
      flavorText: "The battle is won in the enemy's head. You brought siege equipment.",
      source: "talent", class: "Toxicologist", treeId: "saboteur",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "fear", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Your sabotage breaks minds before bodies. Enemies affected by your abilities have disadvantage on Spirit saves, your fear effects last 2 additional rounds, and they cannot benefit from morale bonuses." }
    ]
  },

  {
    id: "sb2_t2_system_failure",
    name: "System Failure",
    icon: "inv_misc_wrench_01",
    maxRanks: 3,
    position: { x: 1.5, y: 1.5 },
    requires: "sb2_t1_disruption_core",
    spell: {
      name: "System Failure",
      description: "Your sabotage causes cascading failures. When you disable an enemy ability, all similar abilities on that enemy are also disabled for 1 round.",
      flavorText: "One wire pinched. The whole board panics.",
      source: "talent", class: "Toxicologist", treeId: "saboteur",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "cascade", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Your sabotage causes cascading failures. When you disable an enemy ability, all similar abilities on that enemy are disabled for 2 rounds." },
      { description: "Your sabotage causes cascading failures. When you disable an enemy ability, all similar abilities on that enemy AND its allies within 15 feet are disabled for 2 rounds." }
    ]
  },
  {
    id: "sb2_t2_debuff_mastery",
    name: "Debuff Mastery",
    icon: "spell_shadow_curseofsargeras",
    maxRanks: 3,
    position: { x: 2.5, y: 1.5 },
    requires: "sb2_t1_flash_powder",
    spell: {
      name: "Debuff Mastery",
      description: "You become a master of weakening enemies. Enemies affected by 2 or more of your debuffs take 1d6 wyrd damage at the start of their turns.",
      flavorText: "Redundancy is a virtue in sabotage.",
      source: "talent", class: "Toxicologist", treeId: "saboteur",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["wyrd"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "wyrd", tags: ["passive", "stacking", "toxicologist"]
    },
    rankUpgrades: [
      { description: "You become a master of weakening enemies. Enemies affected by 2 or more of your debuffs take 2d6 wyrd damage at the start of their turns.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } },
      { description: "You become a master of weakening enemies. Enemies affected by 2 or more of your debuffs take 3d6 wyrd damage at the start of their turns, and your debuffs cannot be dispelled below 5th level.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "sb2_t3_total_shutdown",
    name: "Total Shutdown",
    icon: "spell_shadow_antishadow",
    maxRanks: 3,
    position: { x: 2, y: 3 },
    requires: "sb2_t2_system_failure",
    spell: {
      name: "Total Shutdown",
      description: "Completely disable an enemy. A target within 60 feet cannot take actions or reactions for 2 rounds and is vulnerable to all damage. Bosses save to halve duration.",
      flavorText: "Off. Not sleep — off.",
      source: "talent", class: "Toxicologist", treeId: "saboteur",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "single", rangeType: "ranged", range: 60,
      castTimeType: "short", castTimeValue: 1,
      cooldownCategory: "long", cooldownValue: 45, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: true,
      resourceCosts: { mana: { baseAmount: 20 } },
      durationRounds: 2, durationRealTime: 12, durationUnit: "seconds",
      debuffs: ["shutdown"], visualTheme: "wyrd", tags: ["stun", "disable", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Completely disable an enemy. A target within 60 feet cannot take actions or reactions for 3 rounds and is vulnerable to all damage. Bosses save to halve duration." },
      { description: "Completely disable an enemy. A target within 60 feet cannot take actions or reactions for 3 rounds, is vulnerable to all damage, and cannot be healed. Bosses save to halve duration." }
    ]
  },
  {
    id: "sb2_t3_morale_breaker",
    name: "Morale Breaker",
    icon: "ability_warrior_warcry",
    maxRanks: 3,
    position: { x: 3.5, y: 3 },
    requires: "sb2_t2_debuff_mastery",
    spell: {
      name: "Morale Breaker",
      description: "Your sabotage destroys enemy resolve. Enemies you debuff cannot benefit from morale effects and have disadvantage on death saves.",
      flavorText: "Hope is a supply line. You cut it.",
      source: "talent", class: "Toxicologist", treeId: "saboteur",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "morale", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Your sabotage destroys enemy resolve. Enemies you debuff cannot benefit from morale effects, have disadvantage on death saves, and deal 10% less damage." },
      { description: "Your sabotage destroys enemy resolve. Enemies you debuff cannot benefit from morale effects, have disadvantage on death saves, deal 20% less damage, and may not benefit from flanking or pack tactics." }
    ]
  },

  {
    id: "sb2_t4_chaos_engine",
    name: "Chaos Engine",
    icon: "spell_misc_drink",
    maxRanks: 3,
    position: { x: 1.5, y: 4.5 },
    requires: "sb2_t3_total_shutdown",
    spell: {
      name: "Chaos Engine",
      description: "Your sabotage creates unpredictable chaos. When you apply a debuff, roll 1d6: on 5-6, the debuff also affects all enemies within 20 feet.",
      flavorText: "Quality control is for factories.",
      source: "talent", class: "Toxicologist", treeId: "saboteur",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "chaos", "spread", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Your sabotage creates unpredictable chaos. When you apply a debuff, roll 1d6: on 4-6, the debuff also affects all enemies within 20 feet." },
      { description: "Your sabotage creates unpredictable chaos. When you apply a debuff, roll 1d6: on 4-6, the debuff affects all enemies within 20 feet at double strength." }
    ]
  },
  {
    id: "sb2_t4_pandemonium",
    name: "Pandemonium",
    icon: "spell_shadow_mindsteal",
    maxRanks: 2,
    position: { x: 3, y: 4.5 },
    requires: "sb2_t3_morale_breaker",
    spell: {
      name: "Pandemonium",
      description: "Your presence creates total disorder. Enemies within 30 feet cannot benefit from flanking, pack tactics, or coordinated attacks.",
      flavorText: "Teamwork requires trust. You evicted it.",
      source: "talent", class: "Toxicologist", treeId: "saboteur",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "aura", "coordination", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Your presence creates total disorder. Enemies within 30 feet cannot benefit from flanking, pack tactics, or coordinated attacks, and their allies have disadvantage on attacks against you." }
    ]
  },

  {
    id: "sb2_t5_reality_glitch",
    name: "Reality Glitch",
    icon: "spell_arcane_portaldalaran",
    maxRanks: 3,
    position: { x: 1, y: 6 },
    requires: "sb2_t4_chaos_engine",
    spell: {
      name: "Reality Glitch",
      description: "Your sabotage warps causality itself. Attacks made by enemies you have debuffed miss 25% of the time regardless of modifiers, and they cannot critically hit while affected.",
      flavorText: "The dice agreed to an arrangement.",
      source: "talent", class: "Toxicologist", treeId: "saboteur",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "miss-chance", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Your sabotage warps causality itself. Attacks made by enemies you have debuffed miss 30% of the time regardless of modifiers, and they cannot critically hit while affected." },
      { description: "Your sabotage warps causality itself. Attacks made by enemies you have debuffed miss 30% of the time regardless of modifiers, they cannot critically hit, and their missed attacks deal 1d6 wyrd backlash to themselves.", damageTypes: ["wyrd"], primaryDamage: { dice: "1d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "sb2_t5_chaos_lord",
    name: "Chaos Lord",
    icon: "ability_rogue_wrongfullyaccused",
    maxRanks: 2,
    position: { x: 2.5, y: 6 },
    requires: "sb2_t4_pandemonium",
    spell: {
      name: "Chaos Lord",
      description: "You become the embodiment of disorder. Once per round, you may apply one of your known debuffs to an enemy within 60 feet without cost.",
      flavorText: "Disorder, professional grade.",
      source: "talent", class: "Toxicologist", treeId: "saboteur",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "at-will", "toxicologist"]
    },
    rankUpgrades: [
      { description: "You become the embodiment of disorder. Once per round, you may apply one of your known debuffs to an enemy within 60 feet without cost, and debuffs applied this way last 1 additional round." }
    ]
  },

  {
    id: "sb2_t6_system_crash",
    name: "System Crash",
    icon: "spell_shadow_antishadow",
    maxRanks: 1,
    position: { x: 0.5, y: 7 },
    requires: "sb2_t5_reality_glitch",
    spell: {
      name: "System Crash",
      description: "Trigger a total system failure in reality. All enemies within 50 feet are stunned for 1 round and cannot take actions, reactions, or use Action Points. Bosses save to shake it off.",
      flavorText: "Have you tried turning the battlefield off and on again?",
      source: "talent", class: "Toxicologist", treeId: "saboteur",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 50,
      castTimeType: "short", castTimeValue: 2,
      cooldownCategory: "long", cooldownValue: 150, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: false, interruptible: true,
      resourceCosts: { mana: { baseAmount: 35 } },
      debuffs: ["stun"], visualTheme: "arcane", tags: ["stun", "aoe", "crash", "toxicologist"]
    }
  },
  {
    id: "sb2_t6_smoke_and_mirrors",
    name: "Smoke and Mirrors",
    icon: "spell_magic_lesserinvisibilty",
    maxRanks: 2,
    position: { x: 1.5, y: 7 },
    requires: "sb2_t5_reality_glitch",
    spell: {
      name: "Smoke and Mirrors",
      description: "Drop a smoke bomb: become heavily obscured within a 20-foot cloud for 2 rounds. You may immediately make a Stealth check to hide, even in combat.",
      flavorText: "The classic. It works.",
      source: "talent", class: "Toxicologist", treeId: "saboteur",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 20,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 25, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { mana: { baseAmount: 10 } },
      durationRounds: 2, durationRealTime: 12, durationUnit: "seconds",
      buffs: ["smoke"], visualTheme: "arcane", tags: ["smoke", "stealth", "escape", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Drop a smoke bomb: become heavily obscured within a 30-foot cloud for 3 rounds. You may immediately make a Stealth check to hide, and the smoke also deafens enemies inside." }
    ]
  },
  {
    id: "sb2_t6_saboteurs_instinct",
    name: "Saboteur's Instinct",
    icon: "ability_rogue_sprint",
    maxRanks: 2,
    position: { x: 2.5, y: 7 },
    requires: "sb2_t5_chaos_lord",
    spell: {
      name: "Saboteur's Instinct",
      description: "You always know the load-bearing weakness. Your attacks deal 20% more damage to objects, structures, and constructs, and you always find the hidden mechanism.",
      flavorText: "Every dungeon is a machine with a complaint department.",
      source: "talent", class: "Toxicologist", treeId: "saboteur",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "utility", "toxicologist"]
    },
    rankUpgrades: [
      { description: "You always know the load-bearing weakness. Your attacks deal 40% more damage to objects, structures, and constructs, you always find hidden mechanisms, and your debuffs affect constructs and machines at full strength." }
    ]
  },

  {
    id: "sb2_t7_chaos_ascension",
    name: "Chaos Ascension",
    icon: "ability_rogue_wrongfullyaccused",
    maxRanks: 1,
    position: { x: 0, y: 8 },
    requires: "sb2_t6_system_crash",
    spell: {
      name: "Chaos Ascension",
      description: "ULTIMATE: You become living chaos incarnate for 1 minute: beneficial magic targeting enemies within 60 feet fails automatically, enemies cannot coordinate actions, all your debuffs apply instantly without saves, and once during the ascension you may unravel any single enemy effect with a thought.",
      flavorText: "Order was a good run. It had a good reign.",
      source: "talent", class: "Toxicologist", treeId: "saboteur",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 240, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { mana: { baseAmount: 40 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      buffs: ["chaos-ascension"], visualTheme: "arcane", tags: ["ultimate", "capstone", "transform", "toxicologist"]
    }
  },
  {
    id: "sb2_t7_entropy_accrual",
    name: "Entropy Accrual",
    icon: "spell_shadow_curseofsargeras",
    maxRanks: 5,
    position: { x: 1, y: 8 },
    requires: "sb2_t6_smoke_and_mirrors",
    spell: {
      name: "Entropy Accrual",
      description: "Everything you touch decays a little faster. All debuff damage you deal (wyrd ticks, stacking penalties) is increased by 10%.",
      flavorText: "Compound interest, negative yield.",
      source: "talent", class: "Toxicologist", treeId: "saboteur",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["wyrd"],
      visualTheme: "wyrd", tags: ["passive", "capstone", "damage", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Everything you touch decays a little faster. All debuff damage you deal is increased by 20%." },
      { description: "Everything you touch decays a little faster. All debuff damage you deal is increased by 30%." },
      { description: "Everything you touch decays a little faster. All debuff damage you deal is increased by 45%." },
      { description: "Everything you touch decays a little faster. All debuff damage you deal is increased by 60%, and each active debuff on an enemy also reduces its speed by 5 feet." }
    ]
  },
  {
    id: "sb2_t7_perpetual_sabotage",
    name: "Perpetual Sabotage",
    icon: "inv_misc_wrench_01",
    maxRanks: 3,
    position: { x: 2, y: 8 },
    requires: "sb2_t6_smoke_and_mirrors",
    spell: {
      name: "Perpetual Sabotage",
      description: "Your work refuses to be undone. Your debuffs last 1 additional round.",
      flavorText: "The repair crew arrives to find the manual missing.",
      source: "talent", class: "Toxicologist", treeId: "saboteur",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "capstone", "duration", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Your work refuses to be undone. Your debuffs last 2 additional rounds." },
      { description: "Your work refuses to be undone. Your debuffs last 3 additional rounds, and the first dispel attempt against each of your debuffs automatically fails." }
    ]
  },
  {
    id: "sb2_t7_diversion_tactics",
    name: "Diversion Tactics",
    icon: "ability_rogue_feint",
    maxRanks: 3,
    position: { x: 3, y: 8 },
    requires: "sb2_t6_saboteurs_instinct",
    spell: {
      name: "Diversion Tactics",
      description: "Attention is a resource you spend on others. While an enemy is affected by 2 or more of your debuffs, your allies' attacks against it deal an additional 1d4 damage.",
      flavorText: "Watch the left hand. The right one is also doing something.",
      source: "talent", class: "Toxicologist", treeId: "saboteur",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["wyrd"],
      primaryDamage: { dice: "1d4", flat: 0, procChance: 100 },
      visualTheme: "wyrd", tags: ["passive", "capstone", "support", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Attention is a resource you spend on others. While an enemy is affected by 2 or more of your debuffs, your allies' attacks against it deal an additional 1d8 damage.", primaryDamage: { dice: "1d8", flat: 0, procChance: 100 } },
      { description: "Attention is a resource you spend on others. While an enemy is affected by 2 or more of your debuffs, allies attacking it deal +1d8 damage and have advantage on the first attack each round.", primaryDamage: { dice: "1d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "sb2_t7_escape_artist",
    name: "Escape Artist",
    icon: "ability_rogue_escapeartist",
    maxRanks: 3,
    position: { x: 4, y: 8 },
    requires: "sb2_t6_saboteurs_instinct",
    spell: {
      name: "Escape Artist",
      description: "You always left a way out. Smoke and Mirrors' cooldown is reduced by 5 seconds, and it may be cast while grappled or restrained.",
      flavorText: "The trap had a trapdoor. You installed it last week.",
      source: "talent", class: "Toxicologist", treeId: "saboteur",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "capstone", "mobility", "toxicologist"]
    },
    rankUpgrades: [
      { description: "You always left a way out. Smoke and Mirrors' cooldown is reduced by 10 seconds, it may be cast while grappled, and using it frees you from all restraints." },
      { description: "You always left a way out. Smoke and Mirrors' cooldown is reduced by 10 seconds, it frees you from all restraints, and after using it your next attack from hiding deals an additional 3d6 damage of its own type." }
    ]
  }
];
