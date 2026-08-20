// ============================================
// FALSE PROPHET — CULTIST (v2: talents are spells)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50.
// The ritual tree: curses, sacrifices, summons. Madness as tithe and fuel.
// ============================================

export const FALSE_PROPHET_CULTIST = [
  {
    id: "cu_t1_profane_communion",
    name: "Profane Communion",
    icon: "spell_shadow_summonimp",
    maxRanks: 3,
    position: { x: 1.5, y: 3 },
    requires: null,
    spell: {
      name: "Profane Communion",
      description: "The first rite demands blood as proof of devotion. Sacrifice up to 5 of your own health to gain double that amount as temporary health; you generate 1d4 Madness per sacrifice.",
      flavorText: "The ledger opens early.",
      source: "talent", class: "False Prophet", treeId: "cultist",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 15, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { health: { baseAmount: 5, costType: "flat" } },
      visualTheme: "shadow", tags: ["sacrifice", "madness", "falseprophet"]
    },
    rankUpgrades: [
      { description: "The first rite demands blood as proof of devotion. Sacrifice up to 8 health for double as temporary health; generate 1d6 Madness per sacrifice." },
      { description: "The first rite demands blood as proof of devotion. Sacrifice up to 10 health for TRIPLE as temporary health; generate 1d6 Madness per sacrifice.", resourceCosts: { health: { baseAmount: 10, costType: "flat" } } }
    ]
  },
  {
    id: "cu_t1_curse_of_the_unbeliever",
    name: "Curse of the Unbeliever",
    icon: "spell_shadow_curseofsargeras",
    maxRanks: 3,
    position: { x: 2, y: 4 },
    requires: null,
    spell: {
      name: "Curse of the Unbeliever",
      description: "Curse enemies with the silence spirit's torment. A target within 60 feet takes 1d6 blight damage at the start of its turns for 1 minute. For every 3 Madness you hold, the curse also slows it by 5 feet.",
      flavorText: "The hymn plays on a loop. In the flesh.",
      source: "talent", class: "False Prophet", treeId: "cultist",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "single", rangeType: "ranged", range: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 8, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 6 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      damageTypes: ["blight"],
      isDot: true, dotDuration: 6, dotTick: "1d6",
      debuffs: ["cursed"], visualTheme: "shadow", tags: ["curse", "dot", "falseprophet"]
    },
    rankUpgrades: [
      { description: "Curse enemies with the silence spirit's torment. A target within 60 feet takes 2d6 blight damage per turn for 1 minute, slowed 5 feet per 3 Madness you hold.", dotTick: "2d6" },
      { description: "Curse enemies with the silence spirit's torment. A target within 60 feet takes 3d6 blight damage per turn for 1 minute, slowed 5 feet per 2 Madness you hold.", dotTick: "3d6" }
    ]
  },
  {
    id: "cu_t1_summon_acolyte",
    name: "Summon Silence Acolyte",
    icon: "spell_shadow_summonfelhunter",
    maxRanks: 2,
    position: { x: 2.5, y: 3 },
    requires: null,
    spell: {
      name: "Summon Silence Acolyte",
      description: "Summon an acolyte to perform your rites (durability 13, 1d6 blight damage). Each time the acolyte hits an enemy, you generate 1 Madness.",
      flavorText: "The help is devout and slightly translucent.",
      source: "talent", class: "False Prophet", treeId: "cultist",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "short", castTimeValue: 1,
      cooldownCategory: "medium", cooldownValue: 25, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: false, interruptible: true,
      resourceCosts: { mana: { baseAmount: 10 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      visualTheme: "shadow", tags: ["summon", "acolyte", "falseprophet"]
    },
    rankUpgrades: [
      { description: "Summon an acolyte to perform your rites (durability 14, 2d6 blight damage); each hit generates 1 Madness and heals you 2 health." }
    ]
  },

  {
    id: "cu_t2_blood_offering",
    name: "Blood Offering",
    icon: "spell_shadow_lifedrain",
    maxRanks: 3,
    position: { x: 0.5, y: 3 },
    requires: "cu_t1_profane_communion",
    spell: {
      name: "Blood Offering",
      description: "Offer blood to the silence spirit. Take 2d6 blight damage; all allies within 30 feet regain 3d6 health. You generate 1d6 Madness and your next curse costs no mana.",
      flavorText: "The congregation drinks. You bleed. Fair tithes.",
      source: "talent", class: "False Prophet", treeId: "cultist",
      spellType: "ACTIVE", category: "healing",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 30,
      castTimeType: "short", castTimeValue: 1,
      cooldownCategory: "medium", cooldownValue: 20, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: false, interruptible: true,
      resourceCosts: { health: { baseAmount: 7, costType: "dice" } },
      healing: { dice: "3d6", flat: 0 },
      visualTheme: "shadow", tags: ["sacrifice", "healing", "ally", "falseprophet"]
    },
    rankUpgrades: [
      { description: "Offer blood to the silence spirit. Take 2d6 blight damage; all allies within 30 feet regain 5d6 health. You generate 1d6 Madness and your next curse costs no mana.", healing: { dice: "5d6", flat: 0 } },
      { description: "Offer blood to the silence spirit. Take 2d6 blight; allies within 40 feet regain 6d6 health and gain 5 temporary health. You gain 1d6 Madness and free curses for 1 round.", healing: { dice: "6d6", flat: 0 } }
    ]
  },
  {
    id: "cu_t2_pact_of_the_silence",
    name: "Pact of the Silence",
    icon: "spell_shadow_demonicpact",
    maxRanks: 3,
    position: { x: 3.5, y: 3 },
    requires: "cu_t1_summon_acolyte",
    spell: {
      name: "Pact of the Silence",
      description: "Your servants grow stronger with every descent. Your summoned creatures gain +1 damage per 3 Madness you hold, and you may spend 1d4 Madness to refresh a summon's duration.",
      flavorText: "The fine print is in a language with no word for mercy.",
      source: "talent", class: "False Prophet", treeId: "cultist",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "summon", "madness", "falseprophet"]
    },
    rankUpgrades: [
      { description: "Your servants grow stronger with every descent. Summons gain +1 damage per 2 Madness and +1 Durability Steps to equipped durability; spend 1d4 Madness to refresh a summon's duration." },
      { description: "Your servants grow stronger with every descent. Summons gain +1 damage per 2 Madness, +1 Durability Steps to equipped durability, and their attacks cleave for half damage; spend 1d4 Madness to refresh a duration." }
    ]
  },

  {
    id: "cu_t3_ritual_empowerment",
    name: "Ritual Empowerment",
    icon: "spell_shadow_shadowembrace",
    maxRanks: 3,
    position: { x: 0.5, y: 5 },
    requires: "cu_t2_blood_offering",
    spell: {
      name: "Ritual Empowerment",
      description: "Your rituals draw power from your madness. While at 10 or more Madness, your spells deal 1d6 additional damage of their own type.",
      flavorText: "The music swells. So does everything else.",
      source: "talent", class: "False Prophet", treeId: "cultist",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["blight", "wyrd"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["passive", "threshold", "damage", "falseprophet"]
    },
    rankUpgrades: [
      { description: "Your rituals draw power from your madness. At 10+ Madness your spells deal 2d6 additional damage; each Madness you spend heals you 1 health.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } },
      { description: "Your rituals draw power from your madness. At 8+ Madness your spells deal 3d6 additional damage; each Madness spent heals you 2 health.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "cu_t3_congregation_of_the_silence",
    name: "Congregation of the Silence",
    icon: "spell_shadow_summonvoidwalkers",
    maxRanks: 3,
    position: { x: 3.5, y: 5 },
    requires: "cu_t2_pact_of_the_silence",
    spell: {
      name: "Congregation of the Silence",
      description: "The congregation swells with every broken soul. Summon 1d4 additional silence acolytes. Each acolyte that dies generates 1d4 Madness for you.",
      flavorText: "Pew space available. Soul optional.",
      source: "talent", class: "False Prophet", treeId: "cultist",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "long", castTimeValue: 3,
      cooldownCategory: "long", cooldownValue: 60, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: false, interruptible: true,
      resourceCosts: { mana: { baseAmount: 20 }, madness: { baseAmount: 3 } },
      visualTheme: "shadow", tags: ["summon", "mass", "madness", "falseprophet"]
    },
    rankUpgrades: [
      { description: "The congregation swells with every broken soul. Summon 2d4 additional acolytes; each death generates 1d4 Madness." },
      { description: "The congregation swells with every broken soul. Summon 3d4 acolytes; each death generates 1d6 Madness, and surviving acolytes merge into a Silence Priest if more than 3 remain after combat.", }
    ]
  },

  {
    id: "cu_t4_shepherd_of_the_silence",
    name: "Shepherd of the Silence",
    icon: "spell_shadow_antimagicshell",
    maxRanks: 3,
    position: { x: 0, y: 3 },
    requires: "cu_t3_ritual_empowerment",
    spell: {
      name: "Shepherd of the Silence",
      description: "To shepherd the flock is to watch them descend. Your summoned creatures have +2 Durability Steps to equipped durability and deal +2 damage. When a target of your Curse of the Unbeliever dies, the curse spreads to 1 additional enemy.",
      flavorText: "Losing sheep is fine. The flock finds replacements.",
      source: "talent", class: "False Prophet", treeId: "cultist",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "summon", "spread", "falseprophet"]
    },
    rankUpgrades: [
      { description: "To shepherd the flock is to watch them descend. Summons gain +4 Durability Steps to equipped durability and +4 damage; curses spread to 2 enemies when a cursed target dies." },
      { description: "To shepherd the flock is to watch them descend. Summons gain +6 Durability Steps to equipped durability and +6 damage; curses spread to ALL enemies within 15 feet of a dying cursed target." }
    ]
  },
  {
    id: "cu_t4_silence_priest",
    name: "Silence Priest",
    icon: "spell_shadow_summoninfernal",
    maxRanks: 2,
    position: { x: 4, y: 3 },
    requires: "cu_t3_congregation_of_the_silence",
    spell: {
      name: "Silence Priest",
      description: "Summon a powerful silence priest to preach alongside you. It casts curses autonomously and generates 1d6 Madness for you each round it survives.",
      flavorText: "The management layer of the apocalypse.",
      source: "talent", class: "False Prophet", treeId: "cultist",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "long", castTimeValue: 3,
      cooldownCategory: "long", cooldownValue: 90, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: false, interruptible: true,
      resourceCosts: { mana: { baseAmount: 25 }, madness: { baseAmount: 4 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      visualTheme: "shadow", tags: ["summon", "priest", "madness", "falseprophet"]
    },
    rankUpgrades: [
      { description: "Summon a powerful silence priest to preach alongside you. It casts curses autonomously, generates 1d6 Madness per round, and its curses count as yours for all synergies." }
    ]
  },

  {
    id: "cu_t5_channel_the_silence_god",
    name: "Channel the Silence God",
    icon: "spell_shadow_darkritual",
    maxRanks: 3,
    position: { x: 0, y: 5 },
    requires: "cu_t4_shepherd_of_the_silence",
    spell: {
      name: "Channel the Silence God",
      description: "Become a direct conduit for the silence spirit's power. Your spells ignore spell resistance, and when you trigger Insanity Convulsion, you choose the result instead of rolling.",
      flavorText: "The seizure has a stage direction now.",
      source: "talent", class: "False Prophet", treeId: "cultist",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "penetration", "convulsion", "falseprophet"]
    },
    rankUpgrades: [
      { description: "Become a direct conduit for the silence spirit's power. Spells ignore spell resistance; Convulsions are chosen, not rolled, and their cooldown drops by 1 round." },
      { description: "Become a direct conduit for the silence spirit's power. Spells ignore resistance and immunity; Convulsions are chosen AND deal no self-damage." }
    ]
  },
  {
    id: "cu_t5_forbidden_scripture",
    name: "Forbidden Scripture",
    icon: "spell_shadow_grimward",
    maxRanks: 2,
    position: { x: 4, y: 5 },
    requires: "cu_t4_silence_priest",
    spell: {
      name: "Forbidden Scripture",
      description: "Study the hidden texts. Your Madness-spending effects are 15% more efficient (round up), and you learn one additional curse of your choice.",
      flavorText: "Chapter one was fine. The appendix bites.",
      source: "talent", class: "False Prophet", treeId: "cultist",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "efficiency", "falseprophet"]
    },
    rankUpgrades: [
      { description: "Study the hidden texts. Your Madness-spending effects are 30% more efficient (round up), and you learn two additional curses of your choice." }
    ]
  },

  {
    id: "cu_t6_unholy_bloom",
    name: "Unholy Bloom",
    icon: "spell_shadow_corpseexplode",
    maxRanks: 1,
    position: { x: 1, y: 4 },
    requires: "cu_t5_channel_the_silence_god",
    spell: {
      name: "Unholy Bloom",
      description: "Cursed flesh flowers at the end. When an enemy dies while cursed by you, it erupts in a 10-foot bloom dealing 3d6 blight damage, and each enemy hit by the bloom becomes cursed.",
      flavorText: "The garden is self-planting.",
      source: "talent", class: "False Prophet", treeId: "cultist",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["blight"],
      primaryDamage: { dice: "3d6", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["passive", "execution", "spread", "falseprophet"]
    }
  },
  {
    id: "cu_t6_tithe_collector",
    name: "Tithe Collector",
    icon: "spell_shadow_soulleech",
    maxRanks: 2,
    position: { x: 2, y: 5 },
    requires: "cu_t5_channel_the_silence_god",
    spell: {
      name: "Tithe Collector",
      description: "The flock pays in life. Whenever one of your curses deals damage, you regain 2 health.",
      flavorText: "Ten percent, collected continuously.",
      source: "talent", class: "False Prophet", treeId: "cultist",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "self",
      healing: { dice: null, flat: 2 },
      visualTheme: "shadow", tags: ["passive", "lifesteal", "curse", "falseprophet"]
    },
    rankUpgrades: [
      { description: "The flock pays in life. Whenever one of your curses deals damage, you regain 4 health and 1 Madness every third tick.", healing: { dice: null, flat: 4 } }
    ]
  },
  {
    id: "cu_t6_dark_benediction",
    name: "Dark Benediction",
    icon: "spell_shadow_shadowembrace",
    maxRanks: 2,
    position: { x: 3, y: 4 },
    requires: "cu_t5_forbidden_scripture",
    spell: {
      name: "Dark Benediction",
      description: "Your acolytes are anointed in unmaking. Summoned creatures deal 25% more damage and their attacks apply your Curse of the Unbeliever at half potency (1d6 blight per turn, 1 minute).",
      flavorText: "Blessed are the weird, for they carry forms.",
      source: "talent", class: "False Prophet", treeId: "cultist",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["blight"],
      isDot: true, dotDuration: 6, dotTick: "1d6",
      visualTheme: "shadow", tags: ["passive", "summon", "synergy", "falseprophet"]
    },
    rankUpgrades: [
      { description: "Your acolytes are anointed in unmaking. Summons deal 40% more damage and apply your Curse at FULL potency (2d6 blight per turn, 1 minute).", dotTick: "2d6" }
    ]
  },

  {
    id: "cu_t7_invocation_of_the_silence_god",
    name: "Invocation of the Silence God",
    icon: "spell_shadow_summonfelguard",
    maxRanks: 1,
    position: { x: 0, y: 3.5 },
    requires: "cu_t6_unholy_bloom",
    spell: {
      name: "Invocation of the Silence God",
      description: "ULTIMATE: The ultimate rite pulls the Emberspire itself into momentary focus. Summon an avatar of the silence spirit for 3 rounds: it deals 4d6 blight damage per turn to all enemies within 30 feet. While it stands, your Convulsions do not reset your Madness — you retain half (rounded down) instead. Costs 1d8 Madness.",
      flavorText: "Reality screams. Politely. It has met the spirit before.",
      source: "talent", class: "False Prophet", treeId: "cultist",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "long", castTimeValue: 3,
      cooldownCategory: "long", cooldownValue: 240, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: false, interruptible: true,
      resourceCosts: { mana: { baseAmount: 35 }, madness: { baseAmount: 4 } },
      durationRounds: 3, durationRealTime: 18, durationUnit: "seconds",
      damageTypes: ["blight"],
      primaryDamage: { dice: "4d6", flat: 0, procChance: 100 },
      isDot: true, dotDuration: 3, dotTick: "4d6",
      visualTheme: "shadow", tags: ["ultimate", "capstone", "summon", "avatar", "falseprophet"]
    }
  },
  {
    id: "cu_t7_liturgy_of_depletion",
    name: "Liturgy of Depletion",
    icon: "spell_shadow_curseofsargeras",
    maxRanks: 5,
    position: { x: 0.5, y: 3.5 },
    requires: "cu_t6_tithe_collector",
    spell: {
      name: "Liturgy of Depletion",
      description: "The rite refines itself with repetition. All blight damage dealt by your curses is increased by 10%.",
      flavorText: "Practice makes purer torment.",
      source: "talent", class: "False Prophet", treeId: "cultist",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["blight"],
      visualTheme: "shadow", tags: ["passive", "capstone", "damage", "falseprophet"]
    },
    rankUpgrades: [
      { description: "The rite refines itself with repetition. All blight damage dealt by your curses is increased by 20%." },
      { description: "The rite refines itself with repetition. All blight damage dealt by your curses is increased by 35%." },
      { description: "The rite refines itself with repetition. All blight damage dealt by your curses is increased by 50%." },
      { description: "The rite refines itself with repetition. All curse blight damage is increased by 70%, and Curse of the Unbeliever costs no mana." }
    ]
  },
  {
    id: "cu_t7_eternal_torment",
    name: "Eternal Torment",
    icon: "spell_shadow_unstableaffliction",
    maxRanks: 3,
    position: { x: 0, y: 4 },
    requires: "cu_t6_tithe_collector",
    spell: {
      name: "Eternal Torment",
      description: "Curses cling past the grave and back. Your curses last 2 additional rounds.",
      flavorText: "Expiration dates are for the faithful.",
      source: "talent", class: "False Prophet", treeId: "cultist",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["blight"],
      visualTheme: "shadow", tags: ["passive", "capstone", "duration", "falseprophet"]
    },
    rankUpgrades: [
      { description: "Curses cling past the grave and back. Your curses last 4 additional rounds." },
      { description: "Curses cling past the grave and back. Your curses last 6 additional rounds and cannot be dispelled below 5th level." }
    ]
  },
  {
    id: "cu_t7_flock_eternal",
    name: "Flock Eternal",
    icon: "spell_shadow_summonvoidwalkers",
    maxRanks: 3,
    position: { x: 0, y: 4.5 },
    requires: "cu_t6_dark_benediction",
    spell: {
      name: "Flock Eternal",
      description: "The pews refill themselves. When an acolyte dies, it is resummoned at half health after 2 rounds if you still hold 8 or more Madness.",
      flavorText: "The congregation is eternal. Attendance is mandatory.",
      source: "talent", class: "False Prophet", treeId: "cultist",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "capstone", "summon", "falseprophet"]
    },
    rankUpgrades: [
      { description: "The pews refill themselves. Dead acolytes return at full health after 2 rounds while you hold 8+ Madness." },
      { description: "The pews refill themselves. Dead acolytes return instantly at full health while you hold 6+ Madness, and each return generates 1d4 Madness." }
    ]
  },
  {
    id: "cu_t7_mad_communion",
    name: "Mad Communion",
    icon: "spell_shadow_darkritual",
    maxRanks: 3,
    position: { x: 0.5, y: 4.5 },
    requires: "cu_t6_dark_benediction",
    spell: {
      name: "Mad Communion",
      description: "The vessel was always going to be too small. Your maximum Madness increases by 1.",
      flavorText: "The silence appreciates elbow room.",
      source: "talent", class: "False Prophet", treeId: "cultist",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "capstone", "madness", "falseprophet"]
    },
    rankUpgrades: [
      { description: "The vessel was always going to be too small. Your maximum Madness increases by 2." },
      { description: "The vessel was always going to be too small. Your maximum Madness increases by 3, and Profane Communion's temporary health lasts twice as long." }
    ]
  }
];
