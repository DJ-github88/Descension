// ============================================
// FALSE PROPHET — DECEIVER (v2: talents are spells)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50.
// The manipulation tree: charms, false prophecy, rewritten perception.
// ============================================

export const FALSE_PROPHET_DECEIVER = [
  {
    id: "dc_t1_seed_of_doubt",
    name: "Seed of Doubt",
    icon: "spell_shadow_unholyfrenzy",
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    spell: {
      name: "Seed of Doubt",
      description: "Plant doubt in the minds of the faithful. Enemies within 15 feet have disadvantage on the first save they make against your spells each combat. Generates 1d4 Madness when combat begins.",
      flavorText: "It starts with one reasonable question.",
      source: "talent", class: "False Prophet", treeId: "deceiver",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "opener", "saves", "falseprophet"]
    },
    rankUpgrades: [
      { description: "Plant doubt in the minds of the faithful. Enemies within 20 feet have disadvantage on their first TWO saves against your spells each combat. Generates 1d4 Madness at combat start." },
      { description: "Plant doubt in the minds of the faithful. Enemies within 30 feet have disadvantage on their first two saves against you each combat, and marked enemies take 1d6 wyrd damage when they save.", damageTypes: ["wyrd"], primaryDamage: { dice: "1d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "dc_t1_false_witness",
    name: "False Witness",
    icon: "spell_shadow_possession",
    maxRanks: 3,
    position: { x: 1, y: 0.5 },
    requires: null,
    spell: {
      name: "False Witness",
      description: "Conjure an apparition that testifies against your enemies. A target within 60 feet takes 2d6 wyrd damage and is Marked for 1 minute: marked targets have -2 to saves against your spells.",
      flavorText: "The witness is sworn in. The witness is also your invention.",
      source: "talent", class: "False Prophet", treeId: "deceiver",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "single", rangeType: "ranged", range: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 10, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 8 } },
      damageTypes: ["wyrd"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      debuffs: ["marked"], visualTheme: "shadow", tags: ["mark", "damage", "falseprophet"]
    },
    rankUpgrades: [
      { description: "Conjure an apparition that testifies against your enemies. A target within 60 feet takes 3d6 wyrd damage and is Marked (-3 to saves against your spells) for 1 minute.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } },
      { description: "Conjure an apparition that testifies against your enemies. TWO targets within 60 feet take 3d6 wyrd damage and are Marked (-3 saves vs your spells) for 1 minute.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "dc_t1_aura_of_false_faith",
    name: "Aura of False Faith",
    icon: "spell_shadow_charm",
    maxRanks: 2,
    position: { x: 3.5, y: 0.5 },
    requires: null,
    spell: {
      name: "Aura of False Faith",
      description: "Emit an aura of corrupted divinity. While you hold 6 or more Madness, enemies within 10 feet cannot distinguish friend from foe — they have disadvantage on attacks against your allies.",
      flavorText: "Everyone looks equally trustworthy. That is the miracle.",
      source: "talent", class: "False Prophet", treeId: "deceiver",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "aura", "confusion", "falseprophet"]
    },
    rankUpgrades: [
      { description: "Emit an aura of corrupted divinity. While you hold 6 or more Madness, enemies within 15 feet cannot distinguish friend from foe: disadvantage on attacks, and they must save to target anyone but the nearest creature." }
    ]
  },

  {
    id: "dc_t2_false_prophecy",
    name: "False Prophecy",
    icon: "spell_shadow_mindtwisting",
    maxRanks: 3,
    position: { x: 0, y: 3 },
    requires: "dc_t1_seed_of_doubt",
    spell: {
      name: "False Prophecy",
      description: "Deliver a prophecy of the silence spirit. Up to 2 creatures within 30 feet believe your lies for 3 rounds — they treat your words as absolute truth. Spend 2 Madness when cast: an affected creature also attacks its nearest ally once.",
      flavorText: "The prophecy is self-fulfilling. You filled it yourself.",
      source: "talent", class: "False Prophet", treeId: "deceiver",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "aoe", rangeType: "ranged", range: 30, aoeShape: "circle", aoeSize: 10,
      castTimeType: "short", castTimeValue: 1,
      cooldownCategory: "medium", cooldownValue: 20, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: true,
      resourceCosts: { mana: { baseAmount: 12 } },
      durationRounds: 3, durationRealTime: 18, durationUnit: "seconds",
      debuffs: ["charmed"], visualTheme: "shadow", tags: ["charm", "control", "falseprophet"]
    },
    rankUpgrades: [
      { description: "Deliver a prophecy of the silence spirit. Up to 3 creatures within 30 feet believe your lies for 3 rounds; spend 2 Madness: an affected creature attacks its nearest ally once." },
      { description: "Deliver a prophecy of the silence spirit. Up to 4 creatures within 40 feet believe your lies for 1 minute; spend 2 Madness: ALL affected creatures attack their nearest allies once.", durationRounds: 6, durationRealTime: 60 }
    ]
  },
  {
    id: "dc_t2_corrupting_whisper",
    name: "Corrupting Whisper",
    icon: "spell_shadow_siphonmana",
    maxRanks: 3,
    position: { x: 4, y: 3 },
    requires: "dc_t1_aura_of_false_faith",
    spell: {
      name: "Corrupting Whisper",
      description: "Whisper the silence spirit's truth into a mind. Charm or frighten one creature within 30 feet for 2 rounds; duration increases by 1 round per 3 Madness you hold.",
      flavorText: "Once heard, never unheard, never un-heard.",
      source: "talent", class: "False Prophet", treeId: "deceiver",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "single", rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 12, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 8 } },
      durationRounds: 2, durationRealTime: 12, durationUnit: "seconds",
      debuffs: ["charmed"], visualTheme: "shadow", tags: ["charm", "fear", "scaling", "falseprophet"]
    },
    rankUpgrades: [
      { description: "Whisper the silence spirit's truth into a mind. Charm or frighten one creature within 30 feet for 3 rounds; duration increases by 1 round per 3 Madness you hold." },
      { description: "Whisper the silence spirit's truth into a mind. Charm or frighten TWO creatures within 30 feet for 3 rounds; duration increases by 1 round per 2 Madness you hold." }
    ]
  },

  {
    id: "dc_t3_heresy",
    name: "Heresy",
    icon: "spell_shadow_unstableaffliction",
    maxRanks: 3,
    position: { x: 0, y: 4 },
    requires: "dc_t2_false_prophecy",
    spell: {
      name: "Heresy",
      description: "Declare an enemy a heretic in the silence spirit's name. For 3 rounds, the target takes wyrd damage equal to your current Madness whenever it attacks you. Generates 1d6 Madness when cast.",
      flavorText: "Blasphemy has a bounty. You set it.",
      source: "talent", class: "False Prophet", treeId: "deceiver",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "single", rangeType: "ranged", range: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 15, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 8 } },
      durationRounds: 3, durationRealTime: 18, durationUnit: "seconds",
      damageTypes: ["wyrd"],
      debuffs: ["heresy"], visualTheme: "shadow", tags: ["mark", "retaliation", "falseprophet"]
    },
    rankUpgrades: [
      { description: "Declare an enemy a heretic in the silence spirit's name. For 3 rounds, the target takes wyrd damage equal to TWICE your current Madness whenever it attacks anyone. Generates 1d6 Madness when cast." },
      { description: "Declare an enemy a heretic in the silence spirit's name. For 4 rounds, the target takes double your Madness in wyrd damage whenever it attacks, and the declaration spreads to one enemy per round.", durationRounds: 4, durationRealTime: 24 }
    ]
  },
  {
    id: "dc_t3_congregation_of_doubt",
    name: "Congregation of Doubt",
    icon: "spell_shadow_armorofthedark",
    maxRanks: 3,
    position: { x: 4, y: 4 },
    requires: "dc_t2_corrupting_whisper",
    spell: {
      name: "Congregation of Doubt",
      description: "Preach doubt to the masses. All enemies within 20 feet must save or become confused for 2 rounds; each failed save generates 1 Madness for you.",
      flavorText: "The sermon is short. The doubt is not.",
      source: "talent", class: "False Prophet", treeId: "deceiver",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 20,
      castTimeType: "short", castTimeValue: 1.5,
      cooldownCategory: "medium", cooldownValue: 25, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: false, interruptible: true,
      resourceCosts: { mana: { baseAmount: 15 } },
      debuffs: ["confused"], visualTheme: "shadow", tags: ["confusion", "aoe", "madness", "falseprophet"]
    },
    rankUpgrades: [
      { description: "Preach doubt to the masses. All enemies within 30 feet must save or become confused for 2 rounds; each failed save generates 1 Madness." },
      { description: "Preach doubt to the masses. All enemies within 30 feet save with disadvantage or are confused for 3 rounds; each failure generates 2 Madness." }
    ]
  },

  {
    id: "dc_t4_turn_the_faithful",
    name: "Turn the Faithful",
    icon: "spell_shadow_mindsteal",
    maxRanks: 3,
    position: { x: 0, y: 5 },
    requires: "dc_t3_heresy",
    spell: {
      name: "Turn the Faithful",
      description: "When you successfully charm or confuse an enemy, you may spend 1d6 Madness: that enemy attacks its strongest ally with advantage on its next turn.",
      flavorText: "Betrayal is a sacrament of the inverted church.",
      source: "talent", class: "False Prophet", treeId: "deceiver",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "synergy", "turn", "falseprophet"]
    },
    rankUpgrades: [
      { description: "When you successfully charm or confuse an enemy, you may spend 1d6 Madness: that enemy attacks its strongest ally with advantage and cannot be stopped by its allies." },
      { description: "When you charm or confuse an enemy, spend 1d6 Madness: it attacks its strongest ally with advantage, AND its ally must save or also be confused. This can chain once per round." }
    ]
  },
  {
    id: "dc_t4_storm_of_lies",
    name: "Storm of Lies",
    icon: "spell_shadow_rainoffire",
    maxRanks: 2,
    position: { x: 4, y: 5 },
    requires: "dc_t3_congregation_of_doubt",
    spell: {
      name: "Storm of Lies",
      description: "Unleash a torrent of silence scripture. A 30-foot radius within 60 feet fills with damaging whispers: enemies take 3d6 wyrd damage and have disadvantage on saves against your next control spell. Generates 1d8 Madness.",
      flavorText: "A hurricane of alternative facts.",
      source: "talent", class: "False Prophet", treeId: "deceiver",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "ranged", range: 60, aoeShape: "circle", aoeSize: 30,
      castTimeType: "short", castTimeValue: 2,
      cooldownCategory: "long", cooldownValue: 30, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: true,
      resourceCosts: { mana: { baseAmount: 18 } },
      damageTypes: ["wyrd"],
      primaryDamage: { dice: "3d6", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["aoe", "setup", "falseprophet"]
    },
    rankUpgrades: [
      { description: "Unleash a torrent of silence scripture. A 40-foot radius within 60 feet: enemies take 5d6 wyrd damage and have disadvantage on saves against your next TWO control spells. Generates 1d8 Madness.", primaryDamage: { dice: "5d6", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "dc_t5_rewrite_truth",
    name: "Rewrite Truth",
    icon: "spell_shadow_teleport",
    maxRanks: 3,
    position: { x: 0.5, y: 4 },
    requires: "dc_t4_turn_the_faithful",
    spell: {
      name: "Rewrite Truth",
      description: "Warp what your enemies perceive as reality. Teleport up to 2 creatures or objects within 60 feet to unoccupied spaces you can see. Spend 1d4 Madness per enemy moved: unwilling targets save with disadvantage. Enemies can be placed into hazardous terrain.",
      flavorText: "They were never standing there. You have witnesses.",
      source: "talent", class: "False Prophet", treeId: "deceiver",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "aoe", rangeType: "ranged", range: 60, aoeShape: "circle", aoeSize: 60,
      castTimeType: "short", castTimeValue: 1,
      cooldownCategory: "medium", cooldownValue: 20, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: true,
      resourceCosts: { mana: { baseAmount: 12 } },
      visualTheme: "shadow", tags: ["teleport", "reposition", "control", "falseprophet"]
    },
    rankUpgrades: [
      { description: "Warp what your enemies perceive as reality. Teleport up to 3 creatures or objects within 90 feet; spend 1d4 Madness per enemy (save with disadvantage). Hazardous terrain placement allowed." },
      { description: "Warp what your enemies perceive as reality. Teleport up to 4 creatures within 90 feet (disadvantage saves); enemies dropped into hazards take 2d6 blight damage immediately.", damageTypes: ["blight"], primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "dc_t5_the_grand_lie",
    name: "The Grand Lie",
    icon: "spell_shadow_charm",
    maxRanks: 2,
    position: { x: 3.5, y: 4 },
    requires: "dc_t4_storm_of_lies",
    spell: {
      name: "The Grand Lie",
      description: "Your deceptions become indistinguishable from truth. Enemies automatically fail their first save each combat against your control spells.",
      flavorText: "The lie is load-bearing now.",
      source: "talent", class: "False Prophet", treeId: "deceiver",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "penetration", "falseprophet"]
    },
    rankUpgrades: [
      { description: "Your deceptions become indistinguishable from truth. Enemies automatically fail their first save each combat against your control spells; at 12 or more Madness, their second save fails too." }
    ]
  },

  {
    id: "dc_t6_shatter_the_faith",
    name: "Shatter the Faith",
    icon: "spell_shadow_mindflay",
    maxRanks: 1,
    position: { x: 1, y: 4 },
    requires: "dc_t5_rewrite_truth",
    spell: {
      name: "Shatter the Faith",
      description: "Destroy everything your enemies believe. Create a 60-foot zone for 3 rounds where you control perception: enemies inside see allies as enemies. Each round, each enemy inside generates 1d4 Madness for you. Costs 2d6 Madness to cast.",
      flavorText: "The mirror was the sermon all along.",
      source: "talent", class: "False Prophet", treeId: "deceiver",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 60,
      castTimeType: "long", castTimeValue: 3,
      cooldownCategory: "long", cooldownValue: 150, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: false, interruptible: true,
      resourceCosts: { mana: { baseAmount: 25 }, madness: { baseAmount: 7 } },
      durationRounds: 3, durationRealTime: 18, durationUnit: "seconds",
      debuffs: ["inverted-perception"], visualTheme: "shadow", tags: ["perception", "zone", "madness", "falseprophet"]
    }
  },
  {
    id: "dc_t6_credible_lies",
    name: "Credible Lies",
    icon: "spell_shadow_mindtwisting",
    maxRanks: 2,
    position: { x: 2, y: 5 },
    requires: "dc_t5_rewrite_truth",
    spell: {
      name: "Credible Lies",
      description: "Consistency is the last refuge of belief. Your charm and confusion effects last 1 additional round.",
      flavorText: "Stick to the story. The story sticks to them.",
      source: "talent", class: "False Prophet", treeId: "deceiver",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "duration", "falseprophet"]
    },
    rankUpgrades: [
      { description: "Consistency is the last refuge of belief. Your charm and confusion effects last 2 additional rounds and cost 2 less mana." }
    ]
  },
  {
    id: "dc_t6_doubt_engine",
    name: "Doubt Engine",
    icon: "spell_shadow_burningspirit",
    maxRanks: 2,
    position: { x: 3, y: 4 },
    requires: "dc_t5_the_grand_lie",
    spell: {
      name: "Doubt Engine",
      description: "Failure feeds the falsehood. Each time an enemy fails a save against one of your control spells, gain 1 Madness.",
      flavorText: "Their doubt is a donation. Recurring.",
      source: "talent", class: "False Prophet", treeId: "deceiver",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "madness", "engine", "falseprophet"]
    },
    rankUpgrades: [
      { description: "Failure feeds the falsehood. Each time an enemy fails a save against your control spells, gain 2 Madness." }
    ]
  },

  {
    id: "dc_t7_the_great_deception",
    name: "The Great Deception",
    icon: "spell_shadow_mindsteal",
    maxRanks: 1,
    position: { x: 1, y: 4.5 },
    requires: "dc_t6_shatter_the_faith",
    spell: {
      name: "The Great Deception",
      description: "ULTIMATE: The ultimate deception is that the silence spirit does not exist — and it does not matter, for its lies have already won. For 1 minute, enemies within 60 feet roll all saves against your spells with disadvantage, your control spells hit 2 targets each, and each control that succeeds generates 2 Madness for you.",
      flavorText: "The altar is empty. The kneeling never stops.",
      source: "talent", class: "False Prophet", treeId: "deceiver",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 240, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { mana: { baseAmount: 30 }, madness: { baseAmount: 5 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      buffs: ["grand-deception"], visualTheme: "shadow", tags: ["ultimate", "capstone", "control", "falseprophet"]
    }
  },
  {
    id: "dc_t7_silver_tongue",
    name: "Silver Tongue",
    icon: "spell_shadow_subjugation",
    maxRanks: 5,
    position: { x: 1.5, y: 5 },
    requires: "dc_t6_credible_lies",
    spell: {
      name: "Silver Tongue",
      description: "Your lies appreciate in value. All wyrd damage you deal is increased by 10%.",
      flavorText: "Compound interest on a falsehood.",
      source: "talent", class: "False Prophet", treeId: "deceiver",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["wyrd"],
      visualTheme: "shadow", tags: ["passive", "capstone", "damage", "falseprophet"]
    },
    rankUpgrades: [
      { description: "Your lies appreciate in value. All wyrd damage you deal is increased by 20%." },
      { description: "Your lies appreciate in value. All wyrd damage you deal is increased by 30%." },
      { description: "Your lies appreciate in value. All wyrd damage you deal is increased by 45%." },
      { description: "Your lies appreciate in value. All wyrd damage you deal is increased by 60%, and False Witness costs no mana." }
    ]
  },
  {
    id: "dc_t7_web_of_lies",
    name: "Web of Lies",
    icon: "spell_shadow_unstableaffliction",
    maxRanks: 3,
    position: { x: 2, y: 5.5 },
    requires: "dc_t6_credible_lies",
    spell: {
      name: "Web of Lies",
      description: "One lie supports the next. Your Marks (False Witness, Heresy) may affect 1 additional target.",
      flavorText: "Structural dishonesty.",
      source: "talent", class: "False Prophet", treeId: "deceiver",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "capstone", "marks", "falseprophet"]
    },
    rankUpgrades: [
      { description: "One lie supports the next. Your Marks affect 2 additional targets." },
      { description: "One lie supports the next. Your Marks affect 3 additional targets, and marked enemies take 1d6 extra wyrd damage from your spells.", damageTypes: ["wyrd"], primaryDamage: { dice: "1d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "dc_t7_perfect_credibility",
    name: "Perfect Credibility",
    icon: "spell_shadow_charm",
    maxRanks: 3,
    position: { x: 2.5, y: 5 },
    requires: "dc_t6_doubt_engine",
    spell: {
      name: "Perfect Credibility",
      description: "No one doubts you twice. Enemies that succeed on a save against your control spell have disadvantage on their next save against you.",
      flavorText: "They should have believed you the first time.",
      source: "talent", class: "False Prophet", treeId: "deceiver",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "capstone", "saves", "falseprophet"]
    },
    rankUpgrades: [
      { description: "No one doubts you twice. Enemies that succeed against your control have disadvantage on their next save, and their success deals 2d6 wyrd backlash to them.", damageTypes: ["wyrd"], primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } },
      { description: "No one doubts you twice. Enemies that succeed against your control have disadvantage on their next save, take 2d6 wyrd backlash, and cannot benefit from allies' auras for 1 round.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "dc_t7_deep_reservoir",
    name: "Deep Reservoir",
    icon: "spell_shadow_madness",
    maxRanks: 3,
    position: { x: 3, y: 4.5 },
    requires: "dc_t6_doubt_engine",
    spell: {
      name: "Deep Reservoir",
      description: "The lies need room to breathe. Your maximum Madness increases by 1.",
      flavorText: "More space. Quieter tenant.",
      source: "talent", class: "False Prophet", treeId: "deceiver",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "capstone", "madness", "falseprophet"]
    },
    rankUpgrades: [
      { description: "The lies need room to breathe. Your maximum Madness increases by 2." },
      { description: "The lies need room to breathe. Your maximum Madness increases by 3, and once per short rest you may instantly generate 1d6 Madness for free." }
    ]
  }
];
