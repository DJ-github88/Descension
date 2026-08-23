// ============================================
// LUNARCH — MOONLIGHT SENTINEL (v2: talents are spells)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50.
// Resource: Lunar Phase (New > Waxing > Full > Waning, 3 rounds each).
// The archer tree: ranged precision scales with the Full Moon.
// ============================================

export const LUNARCH_MOONLIGHT_SENTINEL = [
  {
    id: "ms_t1_lunar_precision",
    name: "Lunar Precision",
    icon: "ability_hunter_snipershot",
    maxRanks: 3,
    position: { x: 3.5, y: 0 },
    requires: null,
    spell: {
      name: "Lunar Precision",
      description: "The moon steadies your draw. Your ranged attacks gain +1 to attack rolls and +10 feet range.",
      flavorText: "The tides aim for you.",
      source: "talent", class: "Lunarch", treeId: "moonlight-sentinel",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "accuracy", "lunarch"]
    },
    rankUpgrades: [
      { description: "The moon steadies your draw. Your ranged attacks gain +2 to attack rolls and +15 feet range." },
      { description: "The moon steadies your draw. Your ranged attacks gain +2 to attack rolls, +20 feet range, and deal +1d4 sacred damage during the Full Moon.", damageTypes: ["sacred"], primaryDamage: { dice: "1d4", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "ms_t1_moonlight_arrow",
    name: "Moonlight Arrow",
    icon: "spell_nature_lightning",
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    spell: {
      name: "Moonlight Arrow",
      description: "Loose a shaft that becomes a beam of moonlight: all enemies in a 30-foot line take 2d6 sacred damage.",
      flavorText: "The arrow arrives as light. Light leaves wounds.",
      source: "talent", class: "Lunarch", treeId: "moonlight-sentinel",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "ranged", range: 60, aoeShape: "line", aoeSize: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 8, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 8 } },
      damageTypes: ["sacred"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      visualTheme: "sacred", tags: ["ranged", "line", "lunarch"]
    },
    rankUpgrades: [
      { description: "Loose a shaft that becomes a beam of moonlight: all enemies in a 40-foot line take 3d6 sacred damage.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } },
      { description: "Loose a shaft that becomes a beam of moonlight: all enemies in a 50-foot line take 4d6 sacred damage.", primaryDamage: { dice: "4d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "ms_t1_true_shot",
    name: "True Shot",
    icon: "ability_hunter_mastermarksman",
    maxRanks: 2,
    position: { x: 4, y: 0 },
    requires: null,
    spell: {
      name: "True Shot",
      description: "Once per turn when you hit with a ranged attack, spend 1 Action Point to immediately make another ranged attack with advantage.",
      flavorText: "The second shot was always the plan.",
      source: "talent", class: "Lunarch", treeId: "moonlight-sentinel",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "action-economy", "lunarch"]
    },
    rankUpgrades: [
      { description: "Once per turn when you hit with a ranged attack, spend 1 Action Point to make another ranged attack with advantage; during the Full Moon it costs no Action Point." }
    ]
  },

  {
    id: "ms_t2_lunar_guidance",
    name: "Lunar Guidance",
    icon: "ability_hunter_focusedaim",
    maxRanks: 3,
    position: { x: 2.5, y: 1 },
    requires: "ms_t1_lunar_precision",
    spell: {
      name: "Lunar Guidance",
      description: "Moonlight charts the shot for you. Your ranged attacks ignore half cover and three-quarters cover.",
      flavorText: "Walls are a moon-phase problem.",
      source: "talent", class: "Lunarch", treeId: "moonlight-sentinel",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "cover", "lunarch"]
    },
    rankUpgrades: [
      { description: "Moonlight charts the shot for you. Your ranged attacks ignore half and three-quarters cover, and during the Full Moon a critical hit grants an immediate free attack." },
      { description: "Moonlight charts the shot for you. Your ranged attacks ignore ALL cover, and Full Moon criticals grant a free attack at advantage." }
    ]
  },
  {
    id: "ms_t2_radiant_burst",
    name: "Radiant Burst",
    icon: "spell_holy_searinglight",
    maxRanks: 3,
    position: { x: 3.5, y: 1 },
    requires: "ms_t1_moonlight_arrow",
    spell: {
      name: "Radiant Burst",
      description: "Full Moon criticals detonate. When you critically hit with a ranged attack during the Full Moon, all enemies within 10 feet of the target take 1d8 sacred damage.",
      flavorText: "The moon applauds. Violently.",
      source: "talent", class: "Lunarch", treeId: "moonlight-sentinel",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["sacred"],
      primaryDamage: { dice: "1d8", flat: 0, procChance: 100 },
      visualTheme: "sacred", tags: ["passive", "crit", "aoe", "lunarch"]
    },
    rankUpgrades: [
      { description: "Full Moon criticals detonate. When you critically hit with a ranged attack during the Full Moon, all enemies within 10 feet of the target take 2d8 sacred damage.", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 } },
      { description: "Full Moon criticals detonate. When you critically hit with a ranged attack during the Full Moon, all enemies within 15 feet of the target take 3d8 sacred damage.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "ms_t3_marksman_focus",
    name: "Marksman Focus",
    icon: "ability_hunter_assassinate",
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: "ms_t2_lunar_guidance",
    spell: {
      name: "Marksman Focus",
      description: "Mark a target within 90 feet for 1 minute: your next attack against it has advantage and deals +2d6 sacred damage.",
      flavorText: "The mark is a promise the arrow keeps.",
      source: "talent", class: "Lunarch", treeId: "moonlight-sentinel",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "single", rangeType: "ranged", range: 90,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 12, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 6 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      damageTypes: ["sacred"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      debuffs: ["marked"], visualTheme: "sacred", tags: ["mark", "setup", "lunarch"]
    },
    rankUpgrades: [
      { description: "Mark a target within 90 feet for 1 minute: your next TWO attacks against it have advantage and deal +3d6 sacred damage.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } },
      { description: "Mark a target within 120 feet for 1 minute: all your attacks against it have advantage and deal +3d6 sacred damage; the mark cannot be removed.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "ms_t3_deadly_precision",
    name: "Deadly Precision",
    icon: "ability_hunter_rapidkilling",
    maxRanks: 3,
    position: { x: 3.5, y: 2 },
    requires: "ms_t2_radiant_burst",
    spell: {
      name: "Deadly Precision",
      description: "Your critical hit range with ranged attacks increases by 1 (crit on 19-20).",
      flavorText: "The window widens. The moon insists.",
      source: "talent", class: "Lunarch", treeId: "moonlight-sentinel",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "crit", "lunarch"]
    },
    rankUpgrades: [
      { description: "Your critical hit range with ranged attacks increases by 1 (19-20), and critical hits during the Full Moon deal maximum damage." },
      { description: "Your critical hit range with ranged attacks increases by 2 (18-20), and Full Moon critical hits deal maximum damage." }
    ]
  },

  {
    id: "ms_t4_lunar_empowerment",
    name: "Lunar Empowerment",
    icon: "spell_holy_mindvision",
    maxRanks: 3,
    position: { x: 4, y: 3 },
    requires: "ms_t3_marksman_focus",
    spell: {
      name: "Lunar Empowerment",
      description: "The Full Moon strips away their wards. During the Full Moon, your ranged attacks reduce the target's sacred resistance by 5 (minimum 0) for 1 minute.",
      flavorText: "Moonlight is patient armor removal.",
      source: "talent", class: "Lunarch", treeId: "moonlight-sentinel",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", damageTypes: ["sacred"],
      visualTheme: "sacred", tags: ["passive", "penetration", "full-moon", "lunarch"]
    },
    rankUpgrades: [
      { description: "The Full Moon strips away their wards. During the Full Moon, your ranged attacks reduce sacred resistance by 10 (minimum 0) for 1 minute." },
      { description: "The Full Moon strips away their wards. During the Full Moon, your ranged attacks reduce sacred resistance by 15 and sacred immunity to resistance." }
    ]
  },
  {
    id: "ms_t4_lunar_sentinel",
    name: "Lunar Sentinel",
    icon: "ability_hunter_piercingshots",
    maxRanks: 2,
    position: { x: 2, y: 3 },
    requires: "ms_t3_deadly_precision",
    spell: {
      name: "Lunar Sentinel",
      description: "You guard the sky's silence. Use your reaction to make a ranged attack when an enemy within 30 feet casts a spell; during the Full Moon, this reaction deals +2d6 sacred damage.",
      flavorText: "Interrupt, delivered at 300 feet per second.",
      source: "talent", class: "Lunarch", treeId: "moonlight-sentinel",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["sacred"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      visualTheme: "sacred", tags: ["passive", "reaction", "interrupt", "lunarch"]
    },
    rankUpgrades: [
      { description: "You guard the sky's silence. Use your reaction to make a ranged attack when an enemy within 60 feet casts a spell; during the Full Moon it deals +4d6 sacred damage and knocks the spell out of their hands (spell fails).", primaryDamage: { dice: "4d6", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "ms_t5_tidal_shot",
    name: "Tidal Shot",
    icon: "spell_nature_moonglow",
    maxRanks: 3,
    position: { x: 3, y: 4 },
    requires: "ms_t4_lunar_empowerment",
    spell: {
      name: "Tidal Shot",
      description: "Gravity bows to the moon in your arrow. Your next ranged attack this turn drags all enemies within 10 feet of the target 5 feet toward it and deals +2d6 arcane damage.",
      flavorText: "Everything falls. Mostly toward the wound.",
      source: "talent", class: "Lunarch", treeId: "moonlight-sentinel",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "ranged", range: 90,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 15, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 10 } },
      damageTypes: ["arcane"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      debuffs: ["pulled"], visualTheme: "arcane", tags: ["gravity", "control", "lunarch"]
    },
    rankUpgrades: [
      { description: "Gravity bows to the moon in your arrow. Your next ranged attack drags enemies within 15 feet of the target 10 feet toward it and deals +3d6 arcane damage.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } },
      { description: "Gravity bows to the moon in your arrow. Your next ranged attack drags enemies within 20 feet 15 feet toward the target, deals +4d6 arcane damage, and the pulled cluster is knocked prone.", primaryDamage: { dice: "4d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "ms_t5_waxing_quiver",
    name: "Waxing Quiver",
    icon: "inv_weapon_bow_05",
    maxRanks: 2,
    position: { x: 1, y: 4 },
    requires: "ms_t4_lunar_sentinel",
    spell: {
      name: "Waxing Quiver",
      description: "Your quiver refills as the moon swells. During Waxing Moon, your ranged attacks restore 2 mana on hit.",
      flavorText: "Arrows grow back. Like moonlight does.",
      source: "talent", class: "Lunarch", treeId: "moonlight-sentinel",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "mana", "waxing", "lunarch"]
    },
    rankUpgrades: [
      { description: "Your quiver refills as the moon swells. During Waxing Moon, your ranged attacks restore 4 mana on hit; during Full Moon they restore 2." }
    ]
  },

  {
    id: "ms_t6_celestial_archer",
    name: "Celestial Archer",
    icon: "ability_hunter_combatexperience",
    maxRanks: 1,
    position: { x: 1, y: 5 },
    requires: "ms_t5_tidal_shot",
    spell: {
      name: "Celestial Archer",
      description: "Summon a celestial bow for 1 minute: all your ranged attacks have 120-foot range, ignore cover, and deal +4d6 sacred damage. Costs 10 mana.",
      flavorText: "For one minute, the horizon is a formality.",
      source: "talent", class: "Lunarch", treeId: "moonlight-sentinel",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 120, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { mana: { baseAmount: 10 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      buffs: ["celestial-bow"], damageTypes: ["sacred"],
      primaryDamage: { dice: "4d6", flat: 0, procChance: 100 },
      visualTheme: "sacred", tags: ["transform", "empower", "lunarch"]
    }
  },
  {
    id: "ms_t6_eclipse_aim",
    name: "Eclipse Aim",
    icon: "ability_hunter_improvedsteadyshot",
    maxRanks: 2,
    position: { x: 1.5, y: 5 },
    requires: "ms_t5_tidal_shot",
    spell: {
      name: "Eclipse Aim",
      description: "You have learned to shoot during the dark. During New Moon, your ranged attacks also ignore resistance to sacred damage.",
      flavorText: "The new moon is just a target practicing humility.",
      source: "talent", class: "Lunarch", treeId: "moonlight-sentinel",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["sacred"],
      visualTheme: "sacred", tags: ["passive", "new-moon", "penetration", "lunarch"]
    },
    rankUpgrades: [
      { description: "You have learned to shoot during the dark. During New Moon, your ranged attacks ignore sacred resistance AND deal +2d6 arcane damage.", damageTypes: ["sacred", "arcane"], primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "ms_t6_moonlit_volley",
    name: "Moonlit Volley",
    icon: "ability_hunter_multishot",
    maxRanks: 2,
    position: { x: 3, y: 5 },
    requires: "ms_t5_waxing_quiver",
    spell: {
      name: "Moonlit Volley",
      description: "Rain moonlight shafts on a 20-foot area within 90 feet: enemies inside take 3d8 sacred damage. During Full Moon the volley also blinds for 1 round.",
      flavorText: "One draw. Many verdicts.",
      source: "talent", class: "Lunarch", treeId: "moonlight-sentinel",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "ranged", range: 90, aoeShape: "circle", aoeSize: 20,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 18, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 14 } },
      damageTypes: ["sacred"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      visualTheme: "sacred", tags: ["aoe", "volley", "lunarch"]
    },
    rankUpgrades: [
      { description: "Rain moonlight shafts on a 30-foot area within 120 feet: enemies take 4d8 sacred damage; during Full Moon the volley also blinds for 1 round.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "ms_t7_full_moon_apotheosis",
    name: "Full Moon Apotheosis",
    icon: "spell_nature_starfall",
    maxRanks: 1,
    position: { x: 0, y: 6 },
    requires: "ms_t6_celestial_archer",
    spell: {
      name: "Full Moon Apotheosis",
      description: "ULTIMATE: Force the Full Moon to rise for 1 minute regardless of the phase clock: during this forced Full Moon, every ranged attack you make is a critical hit, ignores cover and resistance, and Radiant Burst triggers on every strike.",
      flavorText: "You asked the moon to stay. It did.",
      source: "talent", class: "Lunarch", treeId: "moonlight-sentinel",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 300, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { mana: { baseAmount: 30 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      buffs: ["forced-full-moon"], visualTheme: "sacred", tags: ["ultimate", "capstone", "phase", "lunarch"]
    }
  },
  {
    id: "ms_t7_marksman_supreme",
    name: "Marksman Supreme",
    icon: "ability_hunter_snipershot",
    maxRanks: 5,
    position: { x: 2, y: 6 },
    requires: "ms_t6_eclipse_aim",
    spell: {
      name: "Marksman Supreme",
      description: "A thousand draws sharpen the ten-thousandth. All ranged damage you deal is increased by +1d6 damage.",
      flavorText: "Muscle memory, lunar-assisted.",
      source: "talent", class: "Lunarch", treeId: "moonlight-sentinel",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["sacred"],
      visualTheme: "sacred", tags: ["passive", "capstone", "damage", "lunarch"]
    },
    rankUpgrades: [
      { description: "A thousand draws sharpen the ten-thousandth. All ranged damage you deal is increased by +1d8 damage." },
      { description: "A thousand draws sharpen the ten-thousandth. All ranged damage you deal is increased by +1d8 damage." },
      { description: "A thousand draws sharpen the ten-thousandth. All ranged damage you deal is increased by +2d8 damage." },
      { description: "A thousand draws sharpen the ten-thousandth. All ranged damage you deal is increased by +2d8 damage, and Moonlight Arrow costs half mana." }
    ]
  },
  {
    id: "ms_t7_tides_of_battle",
    name: "Tides of Battle",
    icon: "spell_nature_moonglow",
    maxRanks: 3,
    position: { x: 3, y: 6 },
    requires: "ms_t6_eclipse_aim",
    spell: {
      name: "Tides of Battle",
      description: "The pull of your shots lingers. Enemies hit by Tidal Shot are slowed by 10 feet for 2 rounds.",
      flavorText: "Gravity remembers your work.",
      source: "talent", class: "Lunarch", treeId: "moonlight-sentinel",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", damageTypes: ["arcane"],
      visualTheme: "arcane", tags: ["passive", "capstone", "synergy", "lunarch"]
    },
    rankUpgrades: [
      { description: "The pull of your shots lingers. Enemies hit by Tidal Shot are slowed by 15 feet for 2 rounds and cannot teleport." },
      { description: "The pull of your shots lingers. Tidal Shot's victims are slowed 20 feet, cannot teleport, and grant your allies advantage on attacks against them for 1 round." }
    ]
  },
  {
    id: "ms_t7_nightwatch",
    name: "Nightwatch",
    icon: "ability_hunter_camouflage",
    maxRanks: 3,
    position: { x: 4, y: 6 },
    requires: "ms_t6_moonlit_volley",
    spell: {
      name: "Nightwatch",
      description: "You see everything the moon touches. You have advantage on Perception checks, and enemies never benefit from darkness or dim light against your attacks.",
      flavorText: "The night shift has one deputy. Promoted by necessity.",
      source: "talent", class: "Lunarch", treeId: "moonlight-sentinel",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "capstone", "senses", "lunarch"]
    },
    rankUpgrades: [
      { description: "You see everything the moon touches. Advantage on Perception, enemies never benefit from darkness, and hidden enemies are visible to you within 60 feet." },
      { description: "You see everything the moon touches. Advantage on Perception, no darkness benefit, hidden and INVISIBLE enemies are visible to you within 60 feet." }
    ]
  },
  {
    id: "ms_t7_lunar_rhythm",
    name: "Lunar Rhythm",
    icon: "spell_nature_starfall",
    maxRanks: 3,
    position: { x: 1, y: 6 },
    requires: "ms_t6_moonlit_volley",
    spell: {
      name: "Lunar Rhythm",
      description: "You fight in time with the sky. Your phase timer between Lunar Phase transitions is reduced by 1 round (phases cycle faster).",
      flavorText: "The month is negotiable. You negotiated it.",
      source: "talent", class: "Lunarch", treeId: "moonlight-sentinel",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "capstone", "phase", "lunarch"]
    },
    rankUpgrades: [
      { description: "You fight in time with the sky. Your phase timer is reduced by 1 round, and phase-transition moments grant you 5 mana." },
      { description: "You fight in time with the sky. Your phase timer is reduced by 2 rounds (minimum 1), and each transition grants 5 mana and 1d6 temporary health." }
    ]
  }
];
