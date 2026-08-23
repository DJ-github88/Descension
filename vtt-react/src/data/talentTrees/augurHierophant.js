// ============================================
// AUGUR — HIEROPHANT (v2: talents are spells)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50.
// The light tree: Benediction, wards, blessed terrain.
// ============================================

export const AUGUR_HIEROPHANT = [
  {
    id: "hi_t1_cosmic_channel",
    name: "Cosmic Channel",
    icon: "spell_holy_farsight",
    maxRanks: 3,
    position: { x: 1.5, y: 0 },
    requires: null,
    spell: {
      name: "Cosmic Channel",
      description: "The brighter the omen, the stronger your blessings. Every even d20 roll you witness generates 1 additional Benediction for you.",
      flavorText: "Good news also arrives first, if you know where to stand.",
      source: "talent", class: "Augur", treeId: "hierophant",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "resource", "benediction", "augur"]
    },
    rankUpgrades: [
      { description: "The brighter the omen, the stronger your blessings. Every even d20 roll you witness generates 2 additional Benediction for you." },
      { description: "The brighter the omen, the stronger your blessings. Every even d20 roll within 30 feet generates 2 additional Benediction for you, even rolls that are not yours." }
    ]
  },
  {
    id: "hi_t1_sign_of_vigor",
    name: "Sign of Vigor",
    icon: "spell_holy_layonhands",
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    spell: {
      name: "Sign of Vigor",
      description: "Spend 1 Benediction: an ally within 30 feet is healed for 1d8 plus your Spirit modifier.",
      flavorText: "The omen says you will bleed. It does not say for how long.",
      source: "talent", class: "Augur", treeId: "hierophant",
      spellType: "ACTIVE", category: "healing",
      targetingMode: "single", rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 6, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { benediction: { baseAmount: 1 } },
      healing: { dice: "1d8", flat: 0 },
      visualTheme: "sacred", tags: ["healing", "ally", "augur"]
    },
    rankUpgrades: [
      { description: "Spend 1 Benediction: an ally within 30 feet is healed for 2d8 plus your Spirit modifier.", healing: { dice: "2d8", flat: 0 } },
      { description: "Spend 1 Benediction: an ally within 30 feet is healed for 3d8 plus your Spirit modifier.", healing: { dice: "3d8", flat: 0 } }
    ]
  },
  {
    id: "hi_t1_radiant_purpose",
    name: "Radiant Purpose",
    icon: "spell_holy_heroism",
    maxRanks: 2,
    position: { x: 2.5, y: 0 },
    requires: null,
    spell: {
      name: "Radiant Purpose",
      description: "Perfection is worth more. When you generate Benediction from a natural 20, you gain 3 Benediction instead of 2.",
      flavorText: "The stars keep their best light for readers who tip.",
      source: "talent", class: "Augur", treeId: "hierophant",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "resource", "augur"]
    },
    rankUpgrades: [
      { description: "Perfection is worth more. When you generate Benediction from a natural 20, you gain 4 Benediction instead of 2." }
    ]
  },

  {
    id: "hi_t2_ward_of_light",
    name: "Ward of Light",
    icon: "spell_holy_holyguidance",
    maxRanks: 3,
    position: { x: 0.5, y: 1 },
    requires: "hi_t1_cosmic_channel",
    spell: {
      name: "Ward of Light",
      description: "Spend 2 Benediction: an ally within 30 feet gains +2 Durability Steps to equipped durability for 3 rounds.",
      flavorText: "A good reading makes for good armor.",
      source: "talent", class: "Augur", treeId: "hierophant",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "single", rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 10, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { benediction: { baseAmount: 2 } },
      durationRounds: 3, durationRealTime: 18, durationUnit: "seconds",
      buffs: ["ward"], visualTheme: "sacred", tags: ["buff", "durability", "ally", "augur"]
    },
    rankUpgrades: [
      { description: "Spend 2 Benediction: an ally within 30 feet gains +3 Durability Steps to equipped durability for 3 rounds." },
      { description: "Spend 2 Benediction: an ally within 30 feet gains +4 Durability Steps to equipped durability for 4 rounds." }
    ]
  },
  {
    id: "hi_t2_blessed_terrain",
    name: "Blessed Terrain",
    icon: "spell_holy_divineprovidence",
    maxRanks: 3,
    position: { x: 3.5, y: 1 },
    requires: "hi_t1_sign_of_vigor",
    spell: {
      name: "Blessed Terrain",
      description: "Your blessings soak into the ground itself. Your Benediction-powered zones last 1 additional round and have their radius increased by 5 feet.",
      flavorText: "Sanctuary is mostly a zoning decision.",
      source: "talent", class: "Augur", treeId: "hierophant",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "terrain", "augur"]
    },
    rankUpgrades: [
      { description: "Your blessings soak into the ground itself. Your Benediction-powered zones last 2 additional rounds and have their radius increased by 5 feet." },
      { description: "Your blessings soak into the ground itself. Your Benediction-powered zones last 2 additional rounds and have their radius increased by 10 feet." }
    ]
  },

  {
    id: "hi_t3_sacred_ground",
    name: "Sacred Ground",
    icon: "spell_holy_prayerofmendingtga",
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: "hi_t2_ward_of_light",
    spell: {
      name: "Sacred Ground",
      description: "Spend 4 Benediction: sanctify a 15-foot zone within 60 feet for 4 rounds — allies inside gain +1 to saving throws and are healed for 1d4 at the start of their turn.",
      flavorText: "Consecrated and mortgaged in your name.",
      source: "talent", class: "Augur", treeId: "hierophant",
      spellType: "ACTIVE", category: "healing",
      targetingMode: "aoe", rangeType: "ranged", range: 60, aoeShape: "circle", aoeSize: 15,
      castTimeType: "short", castTimeValue: 1,
      cooldownCategory: "medium", cooldownValue: 20, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: true,
      resourceCosts: { benediction: { baseAmount: 4 } },
      durationRounds: 4, durationRealTime: 24, durationUnit: "seconds",
      healing: { dice: "1d4", flat: 0, isHoT: true, hotDuration: 4, hotTick: "1d4" },
      buffs: ["sacred-ground"], visualTheme: "sacred", tags: ["zone", "healing", "ally", "augur"]
    },
    rankUpgrades: [
      { description: "Spend 4 Benediction: sanctify a 20-foot zone within 60 feet for 4 rounds — allies inside gain +1 to saving throws and are healed for 2d4 at the start of their turn.", healing: { dice: "2d4", flat: 0, isHoT: true, hotDuration: 4, hotTick: "2d4" } },
      { description: "Spend 4 Benediction: sanctify a 20-foot zone within 60 feet for 5 rounds — allies inside gain +2 to saving throws and are healed for 3d4 at the start of their turn.", healing: { dice: "3d4", flat: 0, isHoT: true, hotDuration: 5, hotTick: "3d4" } }
    ]
  },
  {
    id: "hi_t3_radiant_resonance",
    name: "Radiant Resonance",
    icon: "spell_holy_mindsoothe",
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: "hi_t2_blessed_terrain",
    spell: {
      name: "Radiant Resonance",
      description: "Good fortune echoes in consecrated space. When an ally inside your blessed terrain rolls a natural 20, you gain 2 Benediction.",
      flavorText: "The ground approves. Loudly.",
      source: "talent", class: "Augur", treeId: "hierophant",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "resource", "terrain", "augur"]
    },
    rankUpgrades: [
      { description: "Good fortune echoes in consecrated space. When an ally inside your blessed terrain rolls a natural 20, you gain 3 Benediction." },
      { description: "Good fortune echoes in consecrated space. When an ally inside your blessed terrain rolls a natural 19 or 20, you gain 3 Benediction." }
    ]
  },

  {
    id: "hi_t4_sanctuary",
    name: "Sanctuary",
    icon: "spell_holy_exorcism",
    maxRanks: 3,
    position: { x: 0, y: 3 },
    requires: "hi_t3_sacred_ground",
    spell: {
      name: "Sanctuary",
      description: "Spend 3 Benediction: an ally within 30 feet becomes immune to the next attack that targets them. Lasts until triggered or 1 round.",
      flavorText: "The attack lands on the reading instead.",
      source: "talent", class: "Augur", treeId: "hierophant",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "single", rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 25, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { benediction: { baseAmount: 3 } },
      durationRounds: 1, durationRealTime: 6, durationUnit: "seconds",
      buffs: ["sanctuary"], visualTheme: "sacred", tags: ["immunity", "ally", "augur"]
    },
    rankUpgrades: [
      { description: "Spend 3 Benediction: an ally within 30 feet becomes immune to the next attack that targets them, and gains 10 temporary health when it triggers. Lasts until triggered or 2 rounds." },
      { description: "Spend 3 Benediction: TWO allies within 30 feet become immune to the next attack targeting each of them, gaining 10 temporary health when triggered. Lasts until triggered or 2 rounds." }
    ]
  },
  {
    id: "hi_t4_benediction_overflow",
    name: "Benediction Overflow",
    icon: "spell_holy_searinglightpriest",
    maxRanks: 2,
    position: { x: 4, y: 3 },
    requires: "hi_t3_radiant_resonance",
    spell: {
      name: "Benediction Overflow",
      description: "A full heart spills onto the wounded. While your Benediction is at its cap, every even d20 roll instead heals the nearest wounded ally for 1d4.",
      flavorText: "Kindness under pressure leaks productively.",
      source: "talent", class: "Augur", treeId: "hierophant",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "self",
      healing: { dice: "1d4", flat: 0 },
      visualTheme: "sacred", tags: ["passive", "overflow", "healing", "augur"]
    },
    rankUpgrades: [
      { description: "A full heart spills onto the wounded. While your Benediction is at its cap, every even d20 roll instead heals the nearest wounded ally for 1d8.", healing: { dice: "1d8", flat: 0 } }
    ]
  },

  {
    id: "hi_t5_omen_of_protection",
    name: "Omen of Protection",
    icon: "spell_holy_restoration",
    maxRanks: 3,
    position: { x: 0, y: 4 },
    requires: "hi_t4_sanctuary",
    spell: {
      name: "Omen of Protection",
      description: "Blessed allies see the blow coming. The first time an ally carrying your Benediction buff would take damage, they take half instead.",
      flavorText: "Forewarned is halved.",
      source: "talent", class: "Augur", treeId: "hierophant",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "defense", "ally", "augur"]
    },
    rankUpgrades: [
      { description: "Blessed allies see the blow coming. The first TWO times an ally carrying your Benediction buff would take damage, they take half instead." },
      { description: "Blessed allies see the blow coming. The first two times an ally carrying your Benediction buff would take damage, they take half instead, and the buff also grants +2 Durability Steps to equipped durability." }
    ]
  },
  {
    id: "hi_t5_radiant_conduit",
    name: "Radiant Conduit",
    icon: "spell_holy_righteousnessaura",
    maxRanks: 2,
    position: { x: 4, y: 4 },
    requires: "hi_t4_benediction_overflow",
    spell: {
      name: "Radiant Conduit",
      description: "Light flows through you without thinning. Your Benediction cap increases by 5, and all your Benediction healing is increased by your Spirit modifier.",
      flavorText: "The pipe does not apologize for the volume.",
      source: "talent", class: "Augur", treeId: "hierophant",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "cap", "healing", "augur"]
    },
    rankUpgrades: [
      { description: "Light flows through you without thinning. Your Benediction cap increases by 10, and all your Benediction healing is increased by your Spirit modifier." }
    ]
  },

  {
    id: "hi_t6_cosmic_ward",
    name: "Cosmic Ward",
    icon: "spell_holy_divineintervention",
    maxRanks: 1,
    position: { x: 1, y: 5 },
    requires: "hi_t5_omen_of_protection",
    spell: {
      name: "Cosmic Ward",
      description: "Spend 8 Benediction: all allies within 30 feet gain +4 Durability Steps to equipped durability and immunity to frightened for 5 rounds.",
      flavorText: "One reading, wide enough for everyone.",
      source: "talent", class: "Augur", treeId: "hierophant",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 30,
      castTimeType: "short", castTimeValue: 1.5,
      cooldownCategory: "long", cooldownValue: 60, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: false, interruptible: true,
      resourceCosts: { benediction: { baseAmount: 8 } },
      durationRounds: 5, durationRealTime: 30, durationUnit: "seconds",
      buffs: ["cosmic-ward"], visualTheme: "sacred", tags: ["defense", "aoe", "ally", "augur"]
    }
  },
  {
    id: "hi_t6_eternal_blessing",
    name: "Eternal Blessing",
    icon: "spell_holy_holyguidance",
    maxRanks: 2,
    position: { x: 2, y: 5 },
    requires: "hi_t5_radiant_conduit",
    spell: {
      name: "Eternal Blessing",
      description: "Perfection repeats itself. Your Benediction generation from natural 20s is increased by 1, and your blessed terrain healing increases by 1 point each turn.",
      flavorText: "Twenty. Again. The stars are showing off through you.",
      source: "talent", class: "Augur", treeId: "hierophant",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "resource", "terrain", "augur"]
    },
    rankUpgrades: [
      { description: "Perfection repeats itself. Your Benediction generation from natural 20s is increased by 2, and your blessed terrain healing increases by 1 point each turn." }
    ]
  },
  {
    id: "hi_t6_shared_radiance",
    name: "Shared Radiance",
    icon: "spell_holy_blessingofprotection",
    maxRanks: 2,
    position: { x: 3, y: 5 },
    requires: "hi_t5_omen_of_protection",
    spell: {
      name: "Shared Radiance",
      description: "Your blessings carry secondary instructions. Allies carrying your Benediction buffs also gain +1 to all rolls.",
      flavorText: "Read the footnote. It fights back.",
      source: "talent", class: "Augur", treeId: "hierophant",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "buff", "ally", "augur"]
    },
    rankUpgrades: [
      { description: "Your blessings carry secondary instructions. Allies carrying your Benediction buffs also gain +2 to all rolls." }
    ]
  },

  {
    id: "hi_t7_hierophant_supreme",
    name: "Hierophant Supreme",
    icon: "spell_holy_farsight",
    maxRanks: 1,
    position: { x: 0, y: 6 },
    requires: "hi_t6_cosmic_ward",
    spell: {
      name: "Hierophant Supreme",
      description: "ULTIMATE: Spend 15 Benediction to sanctify a 60-foot zone for 1 minute — allies inside gain +3 to all rolls, resistance to all damage, immunity to frightened and charmed, and are healed for 2d8 at the start of their turns.",
      flavorText: "For one minute, the outcome is not in question.",
      source: "talent", class: "Augur", treeId: "hierophant",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 60,
      castTimeType: "short", castTimeValue: 2,
      cooldownCategory: "long", cooldownValue: 180, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: false, interruptible: true,
      resourceCosts: { benediction: { baseAmount: 15 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      healing: { dice: "2d8", flat: 0, isHoT: true, hotDuration: 6, hotTick: "2d8" },
      buffs: ["supreme-sanctity"], visualTheme: "sacred", tags: ["ultimate", "capstone", "zone", "healing", "augur"]
    }
  },
  {
    id: "hi_t7_deep_well",
    name: "Deep Well",
    icon: "spell_holy_innerfire",
    maxRanks: 5,
    position: { x: 1, y: 6 },
    requires: "hi_t6_eternal_blessing",
    spell: {
      name: "Deep Well",
      description: "The reservoir of good omens has no bottom. Your Benediction cap increases by 1.",
      flavorText: "Deeper. It always goes deeper.",
      source: "talent", class: "Augur", treeId: "hierophant",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "capstone", "resource", "augur"]
    },
    rankUpgrades: [
      { description: "The reservoir of good omens has no bottom. Your Benediction cap increases by 2." },
      { description: "The reservoir of good omens has no bottom. Your Benediction cap increases by 3." },
      { description: "The reservoir of good omens has no bottom. Your Benediction cap increases by 4." },
      { description: "The reservoir of good omens has no bottom. Your Benediction cap increases by 6." }
    ]
  },
  {
    id: "hi_t7_vigorous_signs",
    name: "Vigorous Signs",
    icon: "spell_holy_renew",
    maxRanks: 3,
    position: { x: 2, y: 6 },
    requires: "hi_t6_eternal_blessing",
    spell: {
      name: "Vigorous Signs",
      description: "Healing leaves a residue of light. Sign of Vigor also grants its target 3 temporary health.",
      flavorText: "The healing ends. The warmth does not.",
      source: "talent", class: "Augur", treeId: "hierophant",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "capstone", "healing", "augur"]
    },
    rankUpgrades: [
      { description: "Healing leaves a residue of light. Sign of Vigor also grants its target 6 temporary health." },
      { description: "Healing leaves a residue of light. Sign of Vigor also grants its target 10 temporary health and +1 Durability Steps to equipped durability." }
    ]
  },
  {
    id: "hi_t7_conduit_of_aex",
    name: "Conduit of Aex",
    icon: "spell_holy_surgeoflight",
    maxRanks: 3,
    position: { x: 3, y: 6 },
    requires: "hi_t6_shared_radiance",
    spell: {
      name: "Conduit of Aex",
      description: "Light refuses to be wasted on you alone. When your single-target healing exceeds its target's missing health, 25% of the overflow heals the nearest other wounded ally.",
      flavorText: "Aex's original song was a duet.",
      source: "talent", class: "Augur", treeId: "hierophant",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "capstone", "healing", "overflow", "augur"]
    },
    rankUpgrades: [
      { description: "Light refuses to be wasted on you alone. When your single-target healing exceeds its target's missing health, 50% of the overflow heals the nearest other wounded ally." },
      { description: "Light refuses to be wasted on you alone. When your single-target healing exceeds its target's missing health, 75% of the overflow heals the nearest two other wounded allies." }
    ]
  },
  {
    id: "hi_t7_morning_light",
    name: "Morning Light",
    icon: "spell_holy_powerwordbarrier",
    maxRanks: 3,
    position: { x: 4, y: 6 },
    requires: "hi_t6_shared_radiance",
    spell: {
      name: "Morning Light",
      description: "Consecrated ground stands guard. Allies who start their turn inside your blessed terrain gain +2 Durability Steps to equipped durability until their next turn.",
      flavorText: "The dawn patrols the perimeter.",
      source: "talent", class: "Augur", treeId: "hierophant",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "capstone", "terrain", "defense", "augur"]
    },
    rankUpgrades: [
      { description: "Consecrated ground stands guard. Allies who start their turn inside your blessed terrain gain +3 Durability Steps to equipped durability until their next turn." },
      { description: "Consecrated ground stands guard. Allies who start their turn inside your blessed terrain gain +3 Durability Steps to equipped durability and +2 Damage Reduction to all damage until their next turn." }
    ]
  }
];
