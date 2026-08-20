// ============================================
// AUGUR — HARBINGER (v2: talents are spells)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50.
// The dark tree: Malediction, curses, ill omens.
// ============================================

export const AUGUR_HARBINGER = [
  {
    id: "hb_t1_dark_portent",
    name: "Dark Portent",
    icon: "spell_shadow_curseofsargeras",
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    spell: {
      name: "Dark Portent",
      description: "The darker the omen, the stronger you become. Every odd d20 roll you witness generates 1 additional Malediction for you.",
      flavorText: "Bad news arrives first. It has always been good news for you.",
      source: "talent", class: "Augur", treeId: "harbinger",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "resource", "malediction", "augur"]
    },
    rankUpgrades: [
      { description: "The darker the omen, the stronger you become. Every odd d20 roll you witness generates 2 additional Malediction for you." },
      { description: "The darker the omen, the stronger you become. Every odd d20 roll within 30 feet generates 2 additional Malediction for you, even rolls that are not yours." }
    ]
  },
  {
    id: "hb_t1_ill_omen",
    name: "Ill Omen",
    icon: "spell_shadow_antishadow",
    maxRanks: 3,
    position: { x: 1.5, y: 1 },
    requires: null,
    spell: {
      name: "Ill Omen",
      description: "Spend 2 Malediction to curse a target within 60 feet with ill fortune: -1 to their next d20 roll. Stacks up to 2 times.",
      flavorText: "A small curse. They add up.",
      source: "talent", class: "Augur", treeId: "harbinger",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "single", rangeType: "ranged", range: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 6, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { malediction: { baseAmount: 2 } },
      debuffs: ["ill-omen"], visualTheme: "wyrd", tags: ["curse", "debuff", "augur"]
    },
    rankUpgrades: [
      { description: "Spend 2 Malediction to curse a target within 60 feet with ill fortune: -1 to their next d20 roll. Stacks up to 3 times." },
      { description: "Spend 2 Malediction to curse a target within 60 feet with ill fortune: -2 to their next d20 roll. Stacks up to 3 times." }
    ]
  },
  {
    id: "hb_t1_wasting_portent",
    name: "Wasting Portent",
    icon: "spell_shadow_shadowworddominate",
    maxRanks: 2,
    position: { x: 3, y: 1 },
    requires: null,
    spell: {
      name: "Wasting Portent",
      description: "Ill omens linger longer. Your Malediction-powered debuffs last 1 additional round.",
      flavorText: "A curse that overstays its welcome was well made.",
      source: "talent", class: "Augur", treeId: "harbinger",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "duration", "malediction", "augur"]
    },
    rankUpgrades: [
      { description: "Ill omens linger longer. Your Malediction-powered debuffs last 2 additional rounds." }
    ]
  },

  {
    id: "hb_t2_sign_of_decay",
    name: "Sign of Decay",
    icon: "spell_shadow_lifedrain",
    maxRanks: 3,
    position: { x: 0, y: 3 },
    requires: "hb_t1_dark_portent",
    spell: {
      name: "Sign of Decay",
      description: "Spend 1 Malediction: a target within 60 feet takes 1d8 wyrd damage. Costs no Action Points.",
      flavorText: "A flick of the wrist. A piece of the mind, missing.",
      source: "talent", class: "Augur", treeId: "harbinger",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "ranged", range: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 8, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { malediction: { baseAmount: 1 } },
      damageTypes: ["wyrd"],
      primaryDamage: { dice: "1d8", flat: 0, procChance: 100 },
      visualTheme: "wyrd", tags: ["damage", "cheap", "augur"]
    },
    rankUpgrades: [
      { description: "Spend 1 Malediction: a target within 60 feet takes 2d8 wyrd damage. Costs no Action Points.", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 } },
      { description: "Spend 1 Malediction: a target within 60 feet takes 3d8 wyrd damage. Costs no Action Points.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "hb_t2_misfortune_aura",
    name: "Misfortune Aura",
    icon: "spell_shadow_unstableaffliction",
    maxRanks: 3,
    position: { x: 4, y: 3 },
    requires: "hb_t1_ill_omen",
    spell: {
      name: "Misfortune Aura",
      description: "The air around you carries your ill opinion. Enemies within 15 feet have -1 to all d20 rolls.",
      flavorText: "Standing near you is statistically inadvisable.",
      source: "talent", class: "Augur", treeId: "harbinger",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "aura", "debuff", "augur"]
    },
    rankUpgrades: [
      { description: "The air around you carries your ill opinion. Enemies within 25 feet have -1 to all d20 rolls." },
      { description: "The air around you carries your ill opinion. Enemies within 25 feet have -2 to all d20 rolls." }
    ]
  },

  {
    id: "hb_t3_terrain_of_ill",
    name: "Terrain of Ill",
    icon: "spell_shadow_ward",
    maxRanks: 3,
    position: { x: 0, y: 4.5 },
    requires: "hb_t2_sign_of_decay",
    spell: {
      name: "Terrain of Decay",
      description: "Spend 4 Malediction: curse a 20-foot zone within 60 feet for 3 rounds — enemies inside take 1d6 wyrd damage at the start of their turn and have -10 feet movement speed.",
      flavorText: "The ground develops opinions about visitors.",
      source: "talent", class: "Augur", treeId: "harbinger",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "aoe", rangeType: "ranged", range: 60, aoeShape: "circle", aoeSize: 20,
      castTimeType: "short", castTimeValue: 1,
      cooldownCategory: "medium", cooldownValue: 20, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: true,
      resourceCosts: { malediction: { baseAmount: 4 } },
      durationRounds: 3, durationRealTime: 18, durationUnit: "seconds",
      damageTypes: ["wyrd"],
      isDot: true, dotDuration: 3, dotTick: "1d6",
      debuffs: ["cursed-terrain"], visualTheme: "wyrd", tags: ["zone", "dot", "control", "augur"]
    },
    rankUpgrades: [
      { description: "Spend 4 Malediction: curse a 20-foot zone within 60 feet for 3 rounds — enemies inside take 2d6 wyrd damage at the start of their turn and have -10 feet movement speed.", dotTick: "2d6" },
      { description: "Spend 4 Malediction: curse a 25-foot zone within 60 feet for 4 rounds — enemies inside take 2d6 wyrd damage at the start of their turn and have -15 feet movement speed.", dotTick: "2d6", dotDuration: 4 }
    ]
  },
  {
    id: "hb_t3_curse_stack",
    name: "Curse Stack",
    icon: "spell_shadow_fingerofdeath",
    maxRanks: 3,
    position: { x: 4, y: 4.5 },
    requires: "hb_t2_misfortune_aura",
    spell: {
      name: "Curse Stack",
      description: "Spend 3 Malediction: lay a heavy Ill Omen on a target within 60 feet — -1 to ALL their rolls per stack, up to 3 stacks, for 3 rounds.",
      flavorText: "Omens, plural. Delivered at once.",
      source: "talent", class: "Augur", treeId: "harbinger",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "single", rangeType: "ranged", range: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 15, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { malediction: { baseAmount: 3 } },
      durationRounds: 3, durationRealTime: 18, durationUnit: "seconds",
      debuffs: ["curse-stack"], visualTheme: "wyrd", tags: ["curse", "stacking", "augur"]
    },
    rankUpgrades: [
      { description: "Spend 3 Malediction: lay a heavy Ill Omen on a target within 60 feet — -1 to ALL their rolls per stack, up to 3 stacks, for 4 rounds." },
      { description: "Spend 3 Malediction: lay a heavy Ill Omen on a target within 60 feet — -2 to ALL their rolls per stack, up to 3 stacks, for 4 rounds." }
    ]
  },

  {
    id: "hb_t4_omen_of_frailty",
    name: "Omen of Frailty",
    icon: "spell_holy_searinglightpriest",
    maxRanks: 3,
    position: { x: 0, y: 5.5 },
    requires: "hb_t3_terrain_of_ill",
    spell: {
      name: "Omen of Frailty",
      description: "Layered curses strip the durability off fate itself. Targets carrying 2 or more of your Malediction debuffs become vulnerable to your wyrd damage.",
      flavorText: "Curse once, they resist. Curse twice, they remember why they shouldn't have.",
      source: "talent", class: "Augur", treeId: "harbinger",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", damageTypes: ["wyrd"],
      visualTheme: "wyrd", tags: ["passive", "vulnerability", "augur"]
    },
    rankUpgrades: [
      { description: "Layered curses strip the durability off fate itself. Targets carrying 2 or more of your Malediction debuffs become vulnerable to your wyrd damage and suffer -2 to saving throws." },
      { description: "Layered curses strip the durability off fate itself. Targets carrying 2 or more of your Malediction debuffs become vulnerable to ALL damage you deal and suffer -2 to saving throws." }
    ]
  },
  {
    id: "hb_t4_dark_conviction",
    name: "Dark Conviction",
    icon: "spell_shadow_mindtwisting",
    maxRanks: 2,
    position: { x: 4, y: 5.5 },
    requires: "hb_t3_curse_stack",
    spell: {
      name: "Dark Conviction",
      description: "Their worst moment is your windfall. When a target afflicted by your Malediction debuff rolls a natural 1, you gain 3 Malediction.",
      flavorText: "Disaster, itemized.",
      source: "talent", class: "Augur", treeId: "harbinger",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "resource", "augur"]
    },
    rankUpgrades: [
      { description: "Their worst moment is your windfall. When a target afflicted by your Malediction debuff rolls a natural 1, you gain 5 Malediction." }
    ]
  },

  {
    id: "hb_t5_malediction_overflow",
    name: "Malediction Overflow",
    icon: "spell_shadow_shadowbolt",
    maxRanks: 3,
    position: { x: 0.5, y: 5.5 },
    requires: "hb_t4_omen_of_frailty",
    spell: {
      name: "Malediction Overflow",
      description: "A full reservoir bleeds onto the field. While your Malediction is at its cap, every odd d20 roll instead lashes the nearest enemy for 1d4 wyrd damage.",
      flavorText: "Nowhere left to store it. Someone will have to hold it.",
      source: "talent", class: "Augur", treeId: "harbinger",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["wyrd"],
      primaryDamage: { dice: "1d4", flat: 0, procChance: 100 },
      visualTheme: "wyrd", tags: ["passive", "overflow", "damage", "augur"]
    },
    rankUpgrades: [
      { description: "A full reservoir bleeds onto the field. While your Malediction is at its cap, every odd d20 roll instead lashes the nearest enemy for 1d6 wyrd damage.", primaryDamage: { dice: "1d6", flat: 0, procChance: 100 } },
      { description: "A full reservoir bleeds onto the field. While your Malediction is at its cap, every odd d20 roll instead lashes the nearest enemy for 1d8 wyrd damage.", primaryDamage: { dice: "1d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "hb_t5_void_gaze",
    name: "Void Gaze",
    icon: "spell_shadow_telepathy",
    maxRanks: 2,
    position: { x: 3.5, y: 5.5 },
    requires: "hb_t4_dark_conviction",
    spell: {
      name: "Void Gaze",
      description: "You stare into the gap between outcomes. Your Malediction generation from natural 1s is increased by 1, and your aura radius increases by 10 feet.",
      flavorText: "The gap stared back. You took notes.",
      source: "talent", class: "Augur", treeId: "harbinger",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "resource", "aura", "augur"]
    },
    rankUpgrades: [
      { description: "You stare into the gap between outcomes. Your Malediction generation from natural 1s is increased by 2, and your aura radius increases by 20 feet." }
    ]
  },

  {
    id: "hb_t6_ultimate_portent",
    name: "Ultimate Portent",
    icon: "spell_holy_borrowedtime",
    maxRanks: 1,
    position: { x: 1, y: 4 },
    requires: "hb_t5_malediction_overflow",
    spell: {
      name: "Ultimate Portent",
      description: "Spend 8 Malediction: a target within 60 feet is condemned — all their d20 rolls are made with disadvantage for 3 rounds. No save.",
      flavorText: "The sentence is already written. This is just the reading of it.",
      source: "talent", class: "Augur", treeId: "harbinger",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "single", rangeType: "ranged", range: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 90, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { malediction: { baseAmount: 8 } },
      durationRounds: 3, durationRealTime: 18, durationUnit: "seconds",
      debuffs: ["condemned"], visualTheme: "wyrd", tags: ["curse", "disadvantage", "augur"]
    }
  },
  {
    id: "hb_t6_dark_revelation",
    name: "Dark Revelation",
    icon: "spell_holy_righteousnessaura",
    maxRanks: 2,
    position: { x: 2, y: 5 },
    requires: "hb_t5_malediction_overflow",
    spell: {
      name: "Dark Revelation",
      description: "Every ending is an opening. When you reduce a target to 0 health with a Malediction-powered spell, you regain 4 Malediction and 10 mana.",
      flavorText: "Closure, in the accounting sense.",
      source: "talent", class: "Augur", treeId: "harbinger",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "kill", "resource", "augur"]
    },
    rankUpgrades: [
      { description: "Every ending is an opening. When you reduce a target to 0 health with a Malediction-powered spell, you regain 6 Malediction and 20 mana." }
    ]
  },
  {
    id: "hb_t6_lingering_doom",
    name: "Lingering Doom",
    icon: "spell_shadow_curseofsargeras",
    maxRanks: 2,
    position: { x: 3, y: 4 },
    requires: "hb_t5_void_gaze",
    spell: {
      name: "Lingering Doom",
      description: "Curses outlive their hosts. When a target afflicted by your Malediction debuff dies, each curse jumps to the nearest enemy within 30 feet with its remaining duration.",
      flavorText: "The debt survives the debtor.",
      source: "talent", class: "Augur", treeId: "harbinger",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "spread", "curse", "augur"]
    },
    rankUpgrades: [
      { description: "Curses outlive their hosts. When a target afflicted by your Malediction debuff dies OR succeeds on a save against one, each curse jumps to the nearest enemy within 30 feet with its remaining duration." }
    ]
  },

  {
    id: "hb_t7_harbinger_supreme",
    name: "Harbinger Supreme",
    icon: "spell_shadow_curseofsargeras",
    maxRanks: 1,
    position: { x: 0.5, y: 4.5 },
    requires: "hb_t6_ultimate_portent",
    spell: {
      name: "Harbinger Supreme",
      description: "ULTIMATE: Spend 15 Malediction to read the room its ending: all enemies within 40 feet take 8d10 wyrd damage and are stunned for 2 rounds on a failed Spirit save. Passively, all enemies within 30 feet have -2 to all rolls simply by being near you.",
      flavorText: "You no longer predict the catastrophe. You introduce it.",
      source: "talent", class: "Augur", treeId: "harbinger",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 40,
      castTimeType: "short", castTimeValue: 2,
      cooldownCategory: "long", cooldownValue: 180, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: false, interruptible: true,
      resourceCosts: { malediction: { baseAmount: 15 } },
      damageTypes: ["wyrd"],
      primaryDamage: { dice: "8d10", flat: 0, procChance: 100 },
      debuffs: ["stun"], visualTheme: "wyrd", tags: ["ultimate", "capstone", "aoe", "stun", "augur"]
    }
  },
  {
    id: "hb_t7_portent_depth",
    name: "Portent Depth",
    icon: "spell_shadow_shadowward",
    maxRanks: 5,
    position: { x: 1, y: 5.5 },
    requires: "hb_t6_dark_revelation",
    spell: {
      name: "Portent Depth",
      description: "The well of ill fortune has no bottom. Your Malediction cap increases by 1.",
      flavorText: "Deeper. It always goes deeper.",
      source: "talent", class: "Augur", treeId: "harbinger",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "capstone", "resource", "augur"]
    },
    rankUpgrades: [
      { description: "The well of ill fortune has no bottom. Your Malediction cap increases by 2." },
      { description: "The well of ill fortune has no bottom. Your Malediction cap increases by 3." },
      { description: "The well of ill fortune has no bottom. Your Malediction cap increases by 4." },
      { description: "The well of ill fortune has no bottom. Your Malediction cap increases by 6." }
    ]
  },
  {
    id: "hb_t7_cursed_momentum",
    name: "Cursed Momentum",
    icon: "spell_shadow_manafeed",
    maxRanks: 3,
    position: { x: 2, y: 5.5 },
    requires: "hb_t6_dark_revelation",
    spell: {
      name: "Cursed Momentum",
      description: "Misfortune pays interest. Every odd d20 roll within 30 feet also restores 1 mana to you.",
      flavorText: "Skimming off the top of despair.",
      source: "talent", class: "Augur", treeId: "harbinger",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "capstone", "mana", "augur"]
    },
    rankUpgrades: [
      { description: "Misfortune pays interest. Every odd d20 roll within 60 feet also restores 2 mana to you." },
      { description: "Misfortune pays interest. Every odd d20 roll within 60 feet also restores 3 mana to you." }
    ]
  },
  {
    id: "hb_t7_fractured_fate",
    name: "Fractured Fate",
    icon: "spell_shadow_soulleech",
    maxRanks: 3,
    position: { x: 3, y: 5.5 },
    requires: "hb_t6_lingering_doom",
    spell: {
      name: "Fractured Fate",
      description: "Enemy triumphs crack in your presence. Natural 20s rolled by enemies within 30 feet are downgraded to natural 19s.",
      flavorText: "Perfection is a rumor. You debunk it locally.",
      source: "talent", class: "Augur", treeId: "harbinger",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "capstone", "fate", "augur"]
    },
    rankUpgrades: [
      { description: "Enemy triumphs crack in your presence. Natural 20s rolled by enemies within 60 feet are downgraded to natural 19s." },
      { description: "Enemy triumphs crack in your presence. Natural 20s rolled by enemies within 60 feet are downgraded to natural 19s, and each downgrade grants you 2 Malediction." }
    ]
  },
  {
    id: "hb_t7_doom_siphon",
    name: "Doom Siphon",
    icon: "spell_shadow_lifedrain02",
    maxRanks: 3,
    position: { x: 3.5, y: 4.5 },
    requires: "hb_t6_lingering_doom",
    spell: {
      name: "Doom Siphon",
      description: "You drink from the curse as it works. Whenever an enemy afflicted by your Malediction debuff takes damage, you heal 1 health.",
      flavorText: "Sip slowly. The curse is working.",
      source: "talent", class: "Augur", treeId: "harbinger",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "self",
      healing: { dice: null, flat: 1 },
      visualTheme: "wyrd", tags: ["passive", "capstone", "lifesteal", "augur"]
    },
    rankUpgrades: [
      { description: "You drink from the curse as it works. Whenever an enemy afflicted by your Malediction debuff takes damage, you heal 2 health.", healing: { dice: null, flat: 2 } },
      { description: "You drink from the curse as it works. Whenever an enemy afflicted by your Malediction debuff takes damage, you heal 3 health and gain 1 mana.", healing: { dice: null, flat: 3 } }
    ]
  }
];
