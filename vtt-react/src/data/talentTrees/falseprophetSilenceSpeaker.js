// ============================================
// FALSE PROPHET — SILENCE SPEAKER (v2: talents are spells)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50.
// Resource: Madness (0-20, Convulsion at threshold). Blight/wyrd damage.
// The fire-and-brimstone tree: rewarded for living at high Madness.
// ============================================

export const FALSE_PROPHET_SILENCE_SPEAKER = [
  {
    id: "ss_t1_opening_hymn",
    name: "Opening Hymn",
    icon: "spell_shadow_summonvoidwalker",
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    spell: {
      name: "Opening Hymn",
      description: "Your sermons begin with a taste of the silence. The first time each turn you deal spell damage, generate 1 additional Madness.",
      flavorText: "The hymn has no words. That is the point.",
      source: "talent", class: "False Prophet", treeId: "silence_speaker",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "madness", "falseprophet"]
    },
    rankUpgrades: [
      { description: "Your sermons begin with a taste of the silence. The first time each turn you deal spell damage, generate 2 additional Madness." },
      { description: "Your sermons begin with a taste of the silence. The first TWO times each turn you deal spell damage, generate 2 additional Madness each." }
    ]
  },
  {
    id: "ss_t1_heretics_whisper",
    name: "Heretic's Whisper",
    icon: "spell_shadow_mindshear",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Heretic's Whisper",
      description: "Whisper silence scripture that shatters sanity. One creature within 30 feet takes 1d6 wyrd damage; if this kills, gain 1 Madness.",
      flavorText: "The dying make excellent converts. Briefly.",
      source: "talent", class: "False Prophet", treeId: "silence_speaker",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 6, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 4 } },
      damageTypes: ["wyrd"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["damage", "cheap", "falseprophet"]
    },
    rankUpgrades: [
      { description: "Whisper silence scripture that shatters sanity. One creature within 30 feet takes 2d6 wyrd damage; if this kills, gain 1 Madness.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } },
      { description: "Whisper silence scripture that shatters sanity. One creature within 30 feet takes 3d6 wyrd damage; if this kills, gain 2 Madness.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "ss_t1_blinding_fervor",
    name: "Blinding Fervor",
    icon: "spell_shadow_nethercloak",
    maxRanks: 2,
    position: { x: 3, y: 0 },
    requires: null,
    spell: {
      name: "Blinding Fervor",
      description: "Your conviction blinds you to danger. You have resistance to wyrd damage.",
      flavorText: "Faith is armor. So is not looking.",
      source: "talent", class: "False Prophet", treeId: "silence_speaker",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["wyrd"],
      visualTheme: "shadow", tags: ["passive", "resistance", "falseprophet"]
    },
    rankUpgrades: [
      { description: "Your conviction blinds you to danger. You have resistance to wyrd and blight damage." , damageTypes: ["wyrd", "blight"] }
    ]
  },

  {
    id: "ss_t2_congregations_grasp",
    name: "Congregation's Grasp",
    icon: "spell_shadow_blackplague",
    maxRanks: 3,
    position: { x: 0.5, y: 1 },
    requires: "ss_t1_opening_hymn",
    spell: {
      name: "Congregation's Grasp",
      description: "Your preaching snares the unbelievers. Enemies within 10 feet have their speed reduced by 10 feet.",
      flavorText: "The pews are bolted down. So are you.",
      source: "talent", class: "False Prophet", treeId: "silence_speaker",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "aura", "slow", "falseprophet"]
    },
    rankUpgrades: [
      { description: "Your preaching snares the unbelievers. Enemies within 15 feet have their speed reduced by 10 feet, and when you generate Madness they take 1 wyrd damage per Madness gained.", damageTypes: ["wyrd"] },
      { description: "Your preaching snares the unbelievers. Enemies within 15 feet are slowed by 15 feet, and when you generate Madness they take 2 wyrd damage per Madness gained.", damageTypes: ["wyrd"] }
    ]
  },
  {
    id: "ss_t2_hellfire_passage",
    name: "Hellfire Passage",
    icon: "spell_shadow_shadowfury",
    maxRanks: 3,
    position: { x: 3.5, y: 1 },
    requires: "ss_t1_heretics_whisper",
    spell: {
      name: "Hellfire Passage",
      description: "Quote the silence spirit's wrath. A 15-foot radius within 60 feet takes 3d6 blight damage; you generate 1d4 Madness when cast.",
      flavorText: "The sermon reaches its climax. The room does not survive it.",
      source: "talent", class: "False Prophet", treeId: "silence_speaker",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "ranged", range: 60, aoeShape: "circle", aoeSize: 15,
      castTimeType: "short", castTimeValue: 1,
      cooldownCategory: "medium", cooldownValue: 12, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: true,
      resourceCosts: { mana: { baseAmount: 12 } },
      damageTypes: ["blight"],
      primaryDamage: { dice: "3d6", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["aoe", "madness", "falseprophet"]
    },
    rankUpgrades: [
      { description: "Quote the silence spirit's wrath. A 20-foot radius within 60 feet takes 4d6 blight damage; you generate 1d4 Madness when cast.", primaryDamage: { dice: "4d6", flat: 0, procChance: 100 } },
      { description: "Quote the silence spirit's wrath. A 20-foot radius within 90 feet takes 5d6 blight damage; you generate 1d6 Madness when cast.", primaryDamage: { dice: "5d6", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "ss_t3_anointed_strike",
    name: "Anointed Strike",
    icon: "spell_shadow_fingerofdeath",
    maxRanks: 3,
    position: { x: 0.5, y: 2 },
    requires: "ss_t2_congregations_grasp",
    spell: {
      name: "Anointed Strike",
      description: "Lay hands of the silence upon the unbeliever. Your next attack deals +2d6 blight damage; if it drops the target below half health, generate 1d6 Madness.",
      flavorText: "The laying on of hands, as written in the untranslated edition.",
      source: "talent", class: "False Prophet", treeId: "silence_speaker",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 10, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { mana: { baseAmount: 6 } },
      damageTypes: ["blight"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["smite", "madness", "falseprophet"]
    },
    rankUpgrades: [
      { description: "Lay hands of the silence upon the unbeliever. Your next attack deals +3d6 blight damage; if it drops the target below half health, generate 1d6 Madness.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } },
      { description: "Lay hands of the silence upon the unbeliever. Your next attack deals +4d6 blight damage and cannot be resisted; if it drops the target below half health, generate 2d6 Madness.", primaryDamage: { dice: "4d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "ss_t3_resonant_liturgy",
    name: "Resonant Liturgy",
    icon: "spell_shadow_darkritual",
    maxRanks: 3,
    position: { x: 3.5, y: 2 },
    requires: "ss_t2_hellfire_passage",
    spell: {
      name: "Resonant Liturgy",
      description: "Every syllable of the silence spirit's name amplifies the madness. Your sermon spells deal 1d6 additional damage of their own type.",
      flavorText: "Repetition is sacred. Repetition is sacred.",
      source: "talent", class: "False Prophet", treeId: "silence_speaker",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["blight", "wyrd"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["passive", "damage", "falseprophet"]
    },
    rankUpgrades: [
      { description: "Every syllable of the silence spirit's name amplifies the madness. Your sermon spells deal 2d6 additional damage and generate +1 Madness when cast.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } },
      { description: "Every syllable of the silence spirit's name amplifies the madness. Your sermon spells deal 3d6 additional damage and generate +2 Madness when cast.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "ss_t4_apocalyptic_sermon",
    name: "Apocalyptic Sermon",
    icon: "spell_shadow_shadesofdarkness",
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: "ss_t3_anointed_strike",
    spell: {
      name: "Apocalyptic Sermon",
      description: "Deliver the final sermon. All enemies in a 30-foot radius within 60 feet take 4d6 blight damage, plus 1d6 more for every 5 Madness you currently have.",
      flavorText: "The collection plate is passed. It is on fire.",
      source: "talent", class: "False Prophet", treeId: "silence_speaker",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "ranged", range: 60, aoeShape: "circle", aoeSize: 30,
      castTimeType: "short", castTimeValue: 2,
      cooldownCategory: "long", cooldownValue: 30, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: true,
      resourceCosts: { mana: { baseAmount: 20 }, madness: { baseAmount: -2 } },
      damageTypes: ["blight"],
      primaryDamage: { dice: "4d6", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["aoe", "scaling", "falseprophet"]
    },
    rankUpgrades: [
      { description: "Deliver the final sermon. All enemies in a 40-foot radius within 60 feet take 5d6 blight damage, plus 1d6 for every 5 Madness you have." },
      { description: "Deliver the final sermon. All enemies in a 40-foot radius within 90 feet take 6d6 blight damage, plus 1d6 for every 4 Madness you have; enemies reduced to 0 by it are destroyed.", primaryDamage: { dice: "6d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "ss_t4_embrace_the_silence",
    name: "Embrace the Silence",
    icon: "spell_shadow_twilight",
    maxRanks: 2,
    position: { x: 3, y: 3 },
    requires: "ss_t3_resonant_liturgy",
    spell: {
      name: "Embrace the Silence",
      description: "The silence spirit rewards the faithful. While at 10 or more Madness, you gain resistance to blight damage.",
      flavorText: "Sanity was the last worldly attachment.",
      source: "talent", class: "False Prophet", treeId: "silence_speaker",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["blight"],
      visualTheme: "shadow", tags: ["passive", "threshold", "resistance", "falseprophet"]
    },
    rankUpgrades: [
      { description: "The silence spirit rewards the faithful. While at 10 or more Madness, you gain resistance to blight damage and all your damage is increased by +1d6 damage." }
    ]
  },

  {
    id: "ss_t5_silence_beacon",
    name: "Beacon of the Silence",
    icon: "spell_shadow_summonvoidwalkers",
    maxRanks: 3,
    position: { x: 1.5, y: 4 },
    requires: "ss_t4_apocalyptic_sermon",
    spell: {
      name: "Beacon of the Silence",
      description: "Become a living altar to the silence spirit. Summon a silence acolyte (durability 13) that attacks enemies for 1d6 blight damage; while it lives, your Madness generation rolls gain +1.",
      flavorText: "The congregation of one. Very committed.",
      source: "talent", class: "False Prophet", treeId: "silence_speaker",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "short", castTimeValue: 1,
      cooldownCategory: "medium", cooldownValue: 30, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: false, interruptible: true,
      resourceCosts: { mana: { baseAmount: 15 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      visualTheme: "shadow", tags: ["summon", "acolyte", "falseprophet"]
    },
    rankUpgrades: [
      { description: "Become a living altar to the silence spirit. Summon a silence acolyte (durability 14, 2d6 blight damage); while it lives, your Madness generation gains +2." },
      { description: "Become a living altar to the silence spirit. Summon TWO acolytes (durability 14, 2d6 blight each); while either lives, your Madness generation gains +2 and your spells cost 10 points less mana." }
    ]
  },
  {
    id: "ss_t5_transcendent_conviction",
    name: "Transcendent Conviction",
    icon: "spell_shadow_demonicempathy",
    maxRanks: 2,
    position: { x: 2.5, y: 4 },
    requires: "ss_t4_embrace_the_silence",
    spell: {
      name: "Transcendent Conviction",
      description: "At the precipice of true madness, worldly weakness burns away. At 15 or more Madness, your spells ignore resistance to blight and wyrd damage.",
      flavorText: "Nothing left to doubt with.",
      source: "talent", class: "False Prophet", treeId: "silence_speaker",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["blight", "wyrd"],
      visualTheme: "shadow", tags: ["passive", "penetration", "threshold", "falseprophet"]
    },
    rankUpgrades: [
      { description: "At the precipice of true madness, worldly weakness burns away. At 15 or more Madness, your spells ignore resistance AND immunity to blight and wyrd damage, and your Convulsion self-damage is halved." }
    ]
  },

  {
    id: "ss_t6_convictions_edge",
    name: "Conviction's Edge",
    icon: "spell_shadow_shadowwordpain",
    maxRanks: 1,
    position: { x: 1, y: 5 },
    requires: "ss_t5_silence_beacon",
    spell: {
      name: "Conviction's Edge",
      description: "Madness rolls at their peak echo twice. Whenever you roll maximum on a Madness generation die, you generate 3 additional Madness.",
      flavorText: "The ceiling is a suggestion. The spirit does not observe it.",
      source: "talent", class: "False Prophet", treeId: "silence_speaker",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["madness", "engine", "falseprophet"]
    }
  },
  {
    id: "ss_t6_fanatical_fervor",
    name: "Fanatical Fervor",
    icon: "spell_shadow_unholyfrenzy",
    maxRanks: 2,
    position: { x: 2, y: 5 },
    requires: "ss_t5_silence_beacon",
    spell: {
      name: "Fanatical Fervor",
      description: "The spirit's heat speeds the sermon. Your Silence Speaker spell cooldowns are reduced by 15%.",
      flavorText: "The liturgy accelerates. Duck.",
      source: "talent", class: "False Prophet", treeId: "silence_speaker",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "cooldown", "falseprophet"]
    },
    rankUpgrades: [
      { description: "The spirit's heat speeds the sermon. Your Silence Speaker spell cooldowns are reduced by 30%." }
    ]
  },
  {
    id: "ss_t6_dark_choir",
    name: "Dark Choir",
    icon: "spell_shadow_curseofsargeras",
    maxRanks: 2,
    position: { x: 3, y: 5 },
    requires: "ss_t5_transcendent_conviction",
    spell: {
      name: "Dark Choir",
      description: "Your acolytes harmonize with your sermons. Enemies hit by your Apocalyptic Sermon also take 1d6 wyrd damage per acolyte you control.",
      flavorText: "The harmony section is technically alive. For now.",
      source: "talent", class: "False Prophet", treeId: "silence_speaker",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["wyrd"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["passive", "synergy", "summon", "falseprophet"]
    },
    rankUpgrades: [
      { description: "Your acolytes harmonize with your sermons. Enemies hit by your Apocalyptic Sermon take 2d6 wyrd damage per acolyte you control and are frightened for 1 round.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "ss_t7_final_revelation",
    name: "The Final Revelation",
    icon: "spell_shadow_demonicempathy",
    maxRanks: 1,
    position: { x: 0.5, y: 6 },
    requires: "ss_t6_convictions_edge",
    spell: {
      name: "The Final Revelation",
      description: "ULTIMATE: Preach the end of all things. A 60-foot radius becomes corrupted terrain for 1 minute: enemies inside take 2d6 blight damage at the start of their turns, and if cast at 15 or more Madness, enemies inside are also silenced for 1 round. Generates 2d6 Madness when cast.",
      flavorText: "The last sermon. Standing room only. Everything is standing room.",
      source: "talent", class: "False Prophet", treeId: "silence_speaker",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 60,
      castTimeType: "long", castTimeValue: 3,
      cooldownCategory: "long", cooldownValue: 180, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: false, interruptible: true,
      resourceCosts: { mana: { baseAmount: 30 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      damageTypes: ["blight"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      isDot: true, dotDuration: 6, dotTick: "2d6",
      debuffs: ["silenced"], visualTheme: "shadow", tags: ["ultimate", "capstone", "battlefield", "falseprophet"]
    }
  },
  {
    id: "ss_t7_deeper_descent",
    name: "Deeper Descent",
    icon: "spell_shadow_madness",
    maxRanks: 5,
    position: { x: 1.5, y: 6 },
    requires: "ss_t6_fanatical_fervor",
    spell: {
      name: "Deeper Descent",
      description: "There is always more silence to hold. Your maximum Madness increases by 1.",
      flavorText: "The jug gets bigger. The water gets quieter.",
      source: "talent", class: "False Prophet", treeId: "silence_speaker",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "capstone", "madness", "falseprophet"]
    },
    rankUpgrades: [
      { description: "There is always more silence to hold. Your maximum Madness increases by 2." },
      { description: "There is always more silence to hold. Your maximum Madness increases by 3." },
      { description: "There is always more silence to hold. Your maximum Madness increases by 4." },
      { description: "There is always more silence to hold. Your maximum Madness increases by 5, and Heretic's Whisper costs no mana." }
    ]
  },
  {
    id: "ss_t7_zealots_fire",
    name: "Zealot's Fire",
    icon: "spell_shadow_shadowfury",
    maxRanks: 3,
    position: { x: 2, y: 6 },
    requires: "ss_t6_fanatical_fervor",
    spell: {
      name: "Zealot's Fire",
      description: "Righteousness burns on a hair trigger. Whenever you take damage, there is a 25 points chance your next sermon spell costs no mana.",
      flavorText: "Persecution discounts.",
      source: "talent", class: "False Prophet", treeId: "silence_speaker",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "capstone", "cost", "falseprophet"]
    },
    rankUpgrades: [
      { description: "Righteousness burns on a hair trigger. Whenever you take damage, there is a 50 points chance your next sermon spell costs no mana." },
      { description: "Righteousness burns on a hair trigger. When you take damage, your next sermon is free AND deals +1d6 bonus damage." }
    ]
  },
  {
    id: "ss_t7_voice_of_the_void",
    name: "Voice of the Void",
    icon: "spell_shadow_mindshear",
    maxRanks: 3,
    position: { x: 2.5, y: 6 },
    requires: "ss_t6_dark_choir",
    spell: {
      name: "Voice of the Void",
      description: "Your whispers have learned to carry. Heretic's Whisper hits all enemies within 10 feet of its target for half damage.",
      flavorText: "The whisper learned projection. Nobody asked it to.",
      source: "talent", class: "False Prophet", treeId: "silence_speaker",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["wyrd"],
      visualTheme: "shadow", tags: ["passive", "capstone", "cleave", "falseprophet"]
    },
    rankUpgrades: [
      { description: "Your whispers have learned to carry. Heretic's Whisper hits all enemies within 15 feet of its target for full damage." },
      { description: "Your whispers have learned to carry. Heretic's Whisper hits the target AND chains to 2 nearby enemies at full damage; each kill generates Madness." }
    ]
  },
  {
    id: "ss_t7_unhearing",
    name: "Unhearing",
    icon: "spell_shadow_twilight",
    maxRanks: 3,
    position: { x: 3.5, y: 6 },
    requires: "ss_t6_dark_choir",
    spell: {
      name: "Unhearing",
      description: "You stopped listening to anything but the silence. You are immune to wyrd damage from Madness-triggered sources and take 3 less damage from your own Convulsions.",
      flavorText: "The choir sings for others now.",
      source: "talent", class: "False Prophet", treeId: "silence_speaker",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["wyrd"],
      visualTheme: "shadow", tags: ["passive", "capstone", "defense", "falseprophet"]
    },
    rankUpgrades: [
      { description: "You stopped listening to anything but the silence. You are immune to Madness-triggered wyrd damage, take 5 less Convulsion damage, and cannot be silenced." },
      { description: "You stopped listening to anything but the silence. Immune to Madness wyrd damage and silence, Convulsions deal 8 less damage to you, and enemies who damage you take 1d6 wyrd backlash.", primaryDamage: { dice: "1d6", flat: 0, procChance: 100 } }
    ]
  }
];
