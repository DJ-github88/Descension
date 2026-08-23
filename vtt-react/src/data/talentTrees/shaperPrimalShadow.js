// ============================================
// SHAPER — PRIMAL SHADOW (v2: talents are spells)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50.
// The stealth tree: Silence Predator form, ambushes, living darkness.
// ============================================

export const SHAPER_PRIMAL_SHADOW = [
  {
    id: "ps_t1_silence_predator",
    name: "Silence Predator",
    icon: "ability_stealth",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Silence Predator",
      description: "Enter Silence Predator form for 1 minute: you may stealth even in combat, stealth attacks generate 1 additional Flux, and enemies do not hear your movement. Costs 3 Flux.",
      flavorText: "The quiet has teeth.",
      source: "talent", class: "Shaper", treeId: "primal-shadow",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 10, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { kineticFlux: { baseAmount: 3 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      buffs: ["silence-predator"], visualTheme: "shadow", tags: ["form", "stealth", "shaper"]
    },
    rankUpgrades: [
      { description: "Enter Silence Predator form: combat-stealth, +2 Flux from stealth attacks, silent movement, and +10 feet stealthed movement speed. Costs 3 Flux." },
      { description: "Enter Silence Predator form: combat-stealth, +3 Flux from stealth attacks, silent movement, +15 feet speed, and exiting stealth with an attack grants that attack advantage. Costs 2 Flux." }
    ]
  },
  {
    id: "ps_t1_shadow_cloak",
    name: "Shadow Cloak",
    icon: "spell_shadow_nethercloak",
    maxRanks: 2,
    position: { x: 2, y: 0 },
    requires: null,
    spell: {
      name: "Shadow Cloak",
      description: "Wrap yourself in clinging dark as 1 Action Point: while stealthed you gain +2 to attack and damage rolls. Lasts until you attack or take damage.",
      flavorText: "The dark was using it as a coat rack anyway.",
      source: "talent", class: "Shaper", treeId: "primal-shadow",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 8, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { mana: { baseAmount: 3 } },
      buffs: ["shadow-cloak"], visualTheme: "shadow", tags: ["stealth", "buff", "shaper"]
    },
    rankUpgrades: [
      { description: "Wrap yourself in clinging dark: while stealthed you gain +3 to attack and damage rolls." }
    ]
  },
  {
    id: "ps_t1_ambush_mastery",
    name: "Ambush Mastery",
    icon: "ability_rogue_ambush",
    maxRanks: 3,
    position: { x: 3, y: 0 },
    requires: null,
    spell: {
      name: "Ambush Mastery",
      description: "Stealth attacks deal 2d6 additional blight damage, and attacks against unaware targets have advantage.",
      flavorText: "The first mistake is not hearing the second one.",
      source: "talent", class: "Shaper", treeId: "primal-shadow",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["blight"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["passive", "ambush", "crit", "shaper"]
    },
    rankUpgrades: [
      { description: "Stealth attacks deal 3d6 additional blight damage; attacks against unaware targets have advantage and score critical hits on 19-20.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } },
      { description: "Stealth attacks deal 3d8 additional blight damage; attacks against unaware targets have advantage, score critical hits on 19-20, and ignore 2 points of durability.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "ps_t2_phantom_step",
    name: "Phantom Step",
    icon: "spell_shadow_shadowstep",
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: "ps_t1_silence_predator",
    spell: {
      name: "Phantom Step",
      description: "While in Silence Predator, you may teleport 15 feet through walls and solid objects (not into occupied spaces), and you may teleport while prone or restrained. Costs 1 Flux.",
      flavorText: "The wall and the shadow have an arrangement.",
      source: "talent", class: "Shaper", treeId: "primal-shadow",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "self", rangeType: "self", range: 15,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 6, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { kineticFlux: { baseAmount: 1 } },
      visualTheme: "shadow", tags: ["mobility", "teleport", "form", "shaper"]
    },
    rankUpgrades: [
      { description: "While in Silence Predator, teleport 25 feet through walls and objects, even while prone or restrained. Costs 1 Flux." },
      { description: "While in Silence Predator, teleport 40 feet through anything (including wards and barriers), and each teleport leaves a shadow decoy for 1 round. Costs 1 Flux." }
    ]
  },
  {
    id: "ps_t2_shadow_eruption",
    name: "Shadow Eruption",
    icon: "spell_shadow_shadowbolt",
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: "ps_t1_ambush_mastery",
    spell: {
      name: "Shadow Eruption",
      description: "Groven ancestor-bridges calcify into something stronger. When you exit stealth with an attack, all enemies within 10 feet take 2d6 blight damage and have disadvantage on their next attack.",
      flavorText: "Stealth ends loudly. On purpose.",
      source: "talent", class: "Shaper", treeId: "primal-shadow",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["blight"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["passive", "ambush", "aoe", "shaper"]
    },
    rankUpgrades: [
      { description: "When you exit stealth with an attack, enemies within 15 feet take 3d6 blight damage and have disadvantage on their next attack.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } },
      { description: "Exiting stealth erupts for 4d6 blight in 15 feet, victims have disadvantage, and they must save or be blinded until your next turn.", primaryDamage: { dice: "4d6", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "ps_t3_darkness_within",
    name: "Darkness Within",
    icon: "spell_shadow_shadowform",
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: "ps_t2_phantom_step",
    spell: {
      name: "Darkness Within",
      description: "While in Silence Predator, divination magic and special senses such as tremorsense or blindsight detect you at half range.",
      flavorText: "You are not invisible. You are unconsidered.",
      source: "talent", class: "Shaper", treeId: "primal-shadow",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "form", "anti-detection", "shaper"]
    },
    rankUpgrades: [
      { description: "While in Silence Predator, divination magic and all special senses detect you at half range, and you cannot be marked or scried." },
      { description: "While in Silence Predator, divination and all special senses detect you only within 10 feet, and you cannot be marked or scried." }
    ]
  },
  {
    id: "ps_t3_eternal_darkness",
    name: "Eternal Darkness",
    icon: "spell_shadow_darkritual",
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: "ps_t2_shadow_eruption",
    spell: {
      name: "Eternal Darkness",
      description: "Silence Predator's presence pulls a 15-foot zone of magical darkness around you: you see through it perfectly, enemies inside are blinded. Costs 2 Flux.",
      flavorText: "The dark and you have joint custody of the battlefield.",
      source: "talent", class: "Shaper", treeId: "primal-shadow",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 15,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 20, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { kineticFlux: { baseAmount: 2 } },
      durationRounds: 3, durationRealTime: 18, durationUnit: "seconds",
      debuffs: ["blinded"], visualTheme: "shadow", tags: ["darkness", "zone", "control", "shaper"]
    },
    rankUpgrades: [
      { description: "Pull a 20-foot zone of magical darkness for 4 rounds: you see perfectly, enemies inside are blinded." },
      { description: "Pull a 30-foot darkness zone for 5 rounds: you see perfectly, enemies are blinded, and their darkvision is suppressed inside.", durationRounds: 5, durationRealTime: 30 }
    ]
  },

  {
    id: "ps_t4_shadow_mutation",
    name: "Shadow Mutation",
    icon: "spell_shadow_demonicempathy",
    maxRanks: 3,
    position: { x: 0, y: 3 },
    requires: "ps_t3_darkness_within",
    spell: {
      name: "Shadow Mutation",
      description: "Your shadow-infused shifts deal 1d6 additional blight damage, and blight damage you deal heals you for half. Costs 1 Body Toll per shadow shift.",
      flavorText: "Groven ancestor-bridges calcify into something stronger.",
      source: "talent", class: "Shaper", treeId: "primal-shadow",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["blight"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["passive", "lifesteal", "mutation", "shaper"]
    },
    rankUpgrades: [
      { description: "Shadow shifts deal 2d6 additional blight damage and heal you for half the blight damage you deal.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } },
      { description: "Shadow shifts deal 3d6 additional blight, heal you for half of all blight dealt, and no longer cost Body Toll.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "ps_t4_shadow_weaving",
    name: "Shadow Weaving",
    icon: "spell_shadow_blackplague",
    maxRanks: 2,
    position: { x: 4, y: 3 },
    requires: "ps_t3_eternal_darkness",
    spell: {
      name: "Shadow Weaving",
      description: "Transition to Silence Predator from ANY form for 3 Flux, and while in Silence Predator you may use the abilities of your other forms.",
      flavorText: "All forms are one form wearing different shadows.",
      source: "talent", class: "Shaper", treeId: "primal-shadow",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "forms", "hybrid", "shaper"]
    },
    rankUpgrades: [
      { description: "Transition to Silence Predator from any form for 2 Flux, use all other forms' abilities while in it, and those abilities count as stealth attacks." }
    ]
  },

  {
    id: "ps_t5_dance_of_shadows",
    name: "Dance of Shadows",
    icon: "spell_shadow_gathershadows",
    maxRanks: 3,
    position: { x: 0.5, y: 4 },
    requires: "ps_t4_shadow_mutation",
    spell: {
      name: "Dance of Shadows",
      description: "Once per turn when transitioning into Silence Predator, teleport to any location within 30 feet as part of the transition.",
      flavorText: "The shadow left early. You are just catching up.",
      source: "talent", class: "Shaper", treeId: "primal-shadow",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "mobility", "form", "shaper"]
    },
    rankUpgrades: [
      { description: "Once per turn on entering Silence Predator, teleport 45 feet and gain advantage on your next attack." },
      { description: "On entering Silence Predator, teleport 45 feet with advantage on the next attack; kills made within 6 seconds of the teleport reset the transition cooldown." }
    ]
  },
  {
    id: "ps_t5_umbral_hunger",
    name: "Umbral Hunger",
    icon: "spell_shadow_soulleech",
    maxRanks: 2,
    position: { x: 3.5, y: 4 },
    requires: "ps_t4_shadow_weaving",
    spell: {
      name: "Umbral Hunger",
      description: "The shadow inside eats your fear. While any enemy is blinded by your Eternal Darkness, you regenerate 1d6 health per round.",
      flavorText: "Their blindness feeds you. Chew quietly.",
      source: "talent", class: "Shaper", treeId: "primal-shadow",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "self",
      healing: { dice: "1d6", flat: 0 },
      visualTheme: "shadow", tags: ["passive", "synergy", "regen", "shaper"]
    },
    rankUpgrades: [
      { description: "The shadow inside eats their fear: while any enemy is blinded by your darkness, you regenerate 2d6 health and gain 1 Flux per round.", healing: { dice: "2d6", flat: 0 } }
    ]
  },

  {
    id: "ps_t6_shadow_ascendant",
    name: "Shadow Ascendant",
    icon: "spell_shadow_demonicempathy",
    maxRanks: 1,
    position: { x: 1.5, y: 5 },
    requires: "ps_t5_dance_of_shadows",
    spell: {
      name: "Shadow Ascendant",
      description: "Become a living shadow for 1 minute: immune to non-magical damage, magical damage against you is halved, you may teleport 60 feet as 1 Action Point, and your attacks deal maximum damage. Costs all current Flux (minimum 5) and 3 Body Toll.",
      flavorText: "Groven ancestor-bridges calcify into something stronger. So did you.",
      source: "talent", class: "Shaper", treeId: "primal-shadow",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 240, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { kineticFlux: { baseAmount: 10 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      buffs: ["shadow-ascendant"], visualTheme: "shadow", tags: ["transform", "evasion", "shaper"]
    }
  },
  {
    id: "ps_t6_predators_economy",
    name: "Predator's Economy",
    icon: "ability_rogue_findweakness",
    maxRanks: 2,
    position: { x: 2, y: 5 },
    requires: "ps_t5_umbral_hunger",
    spell: {
      name: "Predator's Economy",
      description: "Kills made from stealth refund Silence Predator's Flux cost and reset its cooldown.",
      flavorText: "The hunt pays for itself.",
      source: "talent", class: "Shaper", treeId: "primal-shadow",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", damageTypes: ["blight"],
      visualTheme: "shadow", tags: ["passive", "kill", "engine", "shaper"]
    },
    rankUpgrades: [
      { description: "Stealth kills refund Silence Predator's cost, reset its cooldown, and grant 2 additional Flux." }
    ]
  },
  {
    id: "ps_t6_nights_cartography",
    name: "Night's Cartography",
    icon: "spell_shadow_darkritual",
    maxRanks: 2,
    position: { x: 2.5, y: 5 },
    requires: "ps_t5_umbral_hunger",
    spell: {
      name: "Night's Cartography",
      description: "You have mapped every shadow on the field. While in Silence Predator, you know the location of all enemies within 60 feet, even through total cover.",
      flavorText: "The dark has a floor plan. You drafted it.",
      source: "talent", class: "Shaper", treeId: "primal-shadow",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "senses", "form", "shaper"]
    },
    rankUpgrades: [
      { description: "While in Silence Predator, you know the position of all enemies within 120 feet through any cover, and your attacks against them ignore cover." }
    ]
  },

  {
    id: "ps_t7_the_silence_between",
    name: "The Silence Between",
    icon: "spell_shadow_gathershadows",
    maxRanks: 1,
    position: { x: 0, y: 6 },
    requires: "ps_t6_shadow_ascendant",
    spell: {
      name: "The Silence Between",
      description: "ULTIMATE: For 1 minute, you exist in the gap between moments: Shadow Ascendant is permanently active, every attack is a stealth attack (triggering Ambush Mastery and Shadow Eruption), teleportation is unlimited and free, and each enemy that dies extends the form by 1 round. Costs 4 Body Toll.",
      flavorText: "Between one heartbeat and the next, there is a country. You are its only citizen.",
      source: "talent", class: "Shaper", treeId: "primal-shadow",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 300, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { kineticFlux: { baseAmount: 12 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      buffs: ["silence-between"], damageTypes: ["blight"],
      visualTheme: "shadow", tags: ["ultimate", "capstone", "transform", "shaper"]
    }
  },
  {
    id: "ps_t7_abyssal_flux",
    name: "Abyssal Flux",
    icon: "spell_shadow_shadowward",
    maxRanks: 5,
    position: { x: 1, y: 6 },
    requires: "ps_t6_predators_economy",
    spell: {
      name: "Abyssal Flux",
      description: "The shadow reservoir has no floor. Your maximum Flux increases by 1.",
      flavorText: "Deeper dark, deeper pool.",
      source: "talent", class: "Shaper", treeId: "primal-shadow",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "capstone", "resource", "shaper"]
    },
    rankUpgrades: [
      { description: "The shadow reservoir has no floor. Your maximum Flux increases by 2." },
      { description: "The shadow reservoir has no floor. Your maximum Flux increases by 3." },
      { description: "The shadow reservoir has no floor. Your maximum Flux increases by 4." },
      { description: "The shadow reservoir has no floor. Your maximum Flux increases by 5, and Silence Predator form costs 1 Flux." }
    ]
  },
  {
    id: "ps_t7_veilwalker",
    name: "Veilwalker",
    icon: "spell_shadow_shadowwalk",
    maxRanks: 3,
    position: { x: 2, y: 6 },
    requires: "ps_t6_nights_cartography",
    spell: {
      name: "Veilwalker",
      description: "Phantom Step's teleport leaves a shadow veil behind: enemies who attack your former position automatically miss.",
      flavorText: "You were there. Emphasis on were.",
      source: "talent", class: "Shaper", treeId: "primal-shadow",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "capstone", "decoy", "shaper"]
    },
    rankUpgrades: [
      { description: "Phantom Step leaves a shadow veil for 1 round; enemies attacking it miss, and the veil detonates for 2d6 blight when struck.", damageTypes: ["blight"], primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } },
      { description: "Phantom Step's veil lasts 2 rounds, misses attackers, detonates for 4d6 blight, and the veil can Phantom Step once more on your command.", primaryDamage: { dice: "4d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "ps_t7_night_terror",
    name: "Night Terror",
    icon: "spell_shadow_twilight",
    maxRanks: 3,
    position: { x: 3, y: 6 },
    requires: "ps_t6_predators_economy",
    spell: {
      name: "Night Terror",
      description: "Enemies blinded by your Eternal Darkness are also frightened, and they take 1d6 blight damage at the start of their turns inside it.",
      flavorText: "It is not the dark they fear. It is what the dark is standing in.",
      source: "talent", class: "Shaper", treeId: "primal-shadow",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["blight"],
      isDot: true, dotDuration: 3, dotTick: "1d6",
      visualTheme: "shadow", tags: ["passive", "capstone", "synergy", "shaper"]
    },
    rankUpgrades: [
      { description: "Enemies in your darkness are blinded, frightened, and take 2d6 blight per turn.", dotTick: "2d6" },
      { description: "Enemies in your darkness are blinded, frightened, and take 3d6 blight per turn; fleeing enemies provoke opportunity attacks from your shadow veil.", dotTick: "3d6" }
    ]
  },
  {
    id: "ps_t7_dark_communion",
    name: "Dark Communion",
    icon: "spell_shadow_metamorphosis",
    maxRanks: 3,
    position: { x: 4, y: 6 },
    requires: "ps_t6_nights_cartography",
    spell: {
      name: "Dark Communion",
      description: "Shadow Ascendant's costs soften with familiarity: its Body Toll cost decreases by 1.",
      flavorText: "The form stops charging rent.",
      source: "talent", class: "Shaper", treeId: "primal-shadow",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "capstone", "body-toll", "shaper"]
    },
    rankUpgrades: [
      { description: "Shadow Ascendant's Body Toll decreases by 2, and while transformed your stealth attacks heal double from Shadow Mutation." },
      { description: "Shadow Ascendant costs 3 less Body Toll (minimum 0), heals double from Shadow Mutation, and its duration increases by 2 rounds." }
    ]
  }
];
