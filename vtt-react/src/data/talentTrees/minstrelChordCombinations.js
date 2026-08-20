// ============================================
// MINSTREL — CHORD COMBINATIONS (v3: spec identity redesign)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50.
//
// SPEC IDENTITY: The Battlechoir / Offensive War-Chanter.
// While Harmonic Weaving heals the wounded and Dissonance unravels sanity,
// Chord Combinations turns the Minstrel into a frontline battle conductor:
// generating thunderous Power Chords, commanding ally volleys, sundering armor
// with sonic shockwaves, and unleashing catastrophic crescendos.
//
// SIGNATURE ACTIVES:
//   - Sonic Lance (t1):            Concentrated acoustic bolt dealing storm damage and generating Dominant notes
//   - Battle Anthem (t2):          Party-wide offensive shout granting bonus attack power and speed
//   - Perfect Cadence Strike (t3): Guaranteed critical cadence that sunders armor
//   - Thunder Stanza (t4):         AoE sonic detonation interrupting and knocking enemies back
//   - Crescendo Surge (t5):        Massive burst attack scaling with stored Dominant notes
//   - Rallying Fanfare (t6):       Commands all allies to immediately execute an empowered attack
//   - Titan Anthem (t7):           ULTIMATE — Thunderous storm symphony granting all allies triple damage dice
// ============================================

export const MINSTREL_CHORD_COMBINATIONS = [
  // ──────────────── TIER 1 (8 pts) ────────────────
  {
    id: "cc_t1_sonic_lance",
    name: "Sonic Lance",
    icon: "spell_arcane_arcanetorrent",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Sonic Lance",
      description: "Cast a focused sonic lance at an enemy within 45 feet: deals 2d8 storm damage and generates 1 Note V (Dominant) and 1 Note I (Tonic).",
      flavorText: "Build tension, then strike with clean intent.",
      source: "talent", class: "Minstrel", treeId: "chord_combinations",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "ranged", range: 45,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 6, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 4 } },
      damageTypes: ["storm"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      visualTheme: "sacred", tags: ["ranged", "storm", "notes", "minstrel"]
    },
    rankUpgrades: [
      { description: "Deals 3d8 storm damage, ignores up to 4 points of enemy Armor, and grants +2 Note V.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } },
      { description: "Deals 3d8 storm damage, ignores up to 4 points of enemy Armor, grants +2 Note V, and resets cooldown on critical hit.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "cc_t1_dominant_fury",
    name: "Dominant Fury",
    icon: "spell_holy_divinehymn",
    maxRanks: 3,
    position: { x: 2.5, y: 0 },
    requires: null,
    spell: {
      name: "Dominant Fury",
      description: "Whenever you generate Note V (Dominant), all your weapon and spell attacks deal +1d6 additional storm damage for 1 round.",
      flavorText: "The dominant demands violence. It usually gets it.",
      source: "talent", class: "Minstrel", treeId: "chord_combinations",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["storm"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "sacred", tags: ["passive", "notes", "damage", "minstrel"]
    },
    rankUpgrades: [
      { description: "Note V generation grants +2d6 storm damage to attacks.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } },
      { description: "Note V grants +3d6 storm damage and your critical strike chance increases by 10 points for 1 round.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "cc_t1_battle_rhythm",
    name: "Battle Cadence Tempo",
    icon: "ability_warrior_bloodfrenzy",
    maxRanks: 2,
    position: { x: 4, y: 0 },
    requires: null,
    spell: {
      name: "Battle Cadence Tempo",
      description: "All allies within 30 feet gain +1 to hit and +1d4 damage on all weapon attacks while you hold at least 2 notes.",
      flavorText: "Forward motion empowers.",
      source: "talent", class: "Minstrel", treeId: "chord_combinations",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "ally-buff", "aura", "minstrel"]
    },
    rankUpgrades: [
      { description: "Allies within 35 feet gain +2 to hit, +1d6 damage, and +10ft movement speed." }
    ]
  },

  // ──────────────── TIER 2 (6 pts) ────────────────
  {
    id: "cc_t2_battle_anthem",
    name: "Battle Anthem",
    icon: "ability_warrior_rallyingshout",
    maxRanks: 3,
    position: { x: 1, y: 1.5 },
    requires: "cc_t1_sonic_lance",
    spell: {
      name: "Battle Anthem",
      description: "Spend 2 notes: chant an invigorating war-anthem. All allies within 35 feet deal +2d8 bonus damage on their next 2 attacks and gain +15ft movement speed for 2 rounds.",
      flavorText: "A hundred blades strike as one beat.",
      source: "talent", class: "Minstrel", treeId: "chord_combinations",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 35,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 12, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { notes: { baseAmount: 2 } },
      buffs: ["battle-anthem"], visualTheme: "sacred", tags: ["anthem", "ally-buff", "burst", "minstrel"]
    },
    rankUpgrades: [
      { description: "Allies deal +3d8 bonus damage on their next 2 attacks and gain +20ft movement speed.", cooldownValue: 10 },
      { description: "Allies deal +4d8 bonus damage on next 3 attacks, gain +25ft speed, and attack with advantage.", cooldownValue: 8 }
    ]
  },
  {
    id: "cc_t2_cadence_momentum",
    name: "Cadence Momentum",
    icon: "spell_holy_powerwordbarrier",
    maxRanks: 3,
    position: { x: 3, y: 1.5 },
    requires: "cc_t1_dominant_fury",
    spell: {
      name: "Cadence Momentum",
      description: "After resolving any offensive cadence, your next spell costs 0 mana.",
      flavorText: "The composition never stops.",
      source: "talent", class: "Minstrel", treeId: "chord_combinations",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "cadence", "maximize", "minstrel"]
    },
    rankUpgrades: [
      { description: "After offensive cadences: next spell costs 0 mana and generates 2 free notes." },
      { description: "After offensive cadences: your next TWO spells cost 0 mana and generate 2 notes each." }
    ]
  },

  // ──────────────── TIER 3 (6 pts) ────────────────
  {
    id: "cc_t3_perfect_strike",
    name: "Perfect Cadence Strike",
    icon: "spell_holy_divinehymn",
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: "cc_t2_battle_anthem",
    spell: {
      name: "Perfect Cadence Strike",
      description: "Spend 4 notes (V to I progression): unleash an explosive acoustic strike against a target within 45 feet. Deals 3d8 storm damage and sunders target durability by -4 for 2 rounds.",
      flavorText: "The perfect progression hits harder than iron.",
      source: "talent", class: "Minstrel", treeId: "chord_combinations",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "ranged", range: 45,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 10, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { notes: { baseAmount: 4 } },
      damageTypes: ["storm"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      debuffs: ["sunder"], visualTheme: "sacred", tags: ["cadence", "nuke", "sunder", "minstrel"]
    },
    rankUpgrades: [
      { description: "Deals 4d8 storm damage and sunders durability by -6 for 3 rounds.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 } },
      { description: "Deals 5d8 storm damage, sunders -6 Durability Steps to target's durability, and shockwaves deal 4d10 storm damage to all enemies within 15 feet.", primaryDamage: { dice: "5d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "cc_t3_circle_mastery",
    name: "Circle of Fifths",
    icon: "spell_shadow_requiem",
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: "cc_t2_cadence_momentum",
    spell: {
      name: "Circle of Fifths",
      description: "When you cast an offensive cadence, a rotating harmonic wheel sweeps around you for 3 rounds: deals 2d8 storm damage to all enemies within 15 feet every round.",
      flavorText: "Eternal rotation of harmonious destruction.",
      source: "talent", class: "Minstrel", treeId: "chord_combinations",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["storm"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      visualTheme: "sacred", tags: ["passive", "aoe", "storm", "minstrel"]
    },
    rankUpgrades: [
      { description: "Harmonic wheel deals 3d8 storm damage within 20 feet and slows enemies by 10ft.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } },
      { description: "Harmonic wheel deals 4d8 storm damage within 25 feet, slows by 15ft, and each tick grants you 1 Note V.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 } }
    ]
  },

  // ──────────────── TIER 4 (5 pts) ────────────────
  {
    id: "cc_t4_thunder_stanza",
    name: "Thunder Stanza",
    icon: "spell_nature_thunderclap",
    maxRanks: 3,
    position: { x: 1, y: 4.5 },
    requires: "cc_t3_perfect_strike",
    spell: {
      name: "Thunder Stanza",
      description: "Spend 3 notes: release a concussive shockwave in a 25-foot radius. Deals 4d8 storm damage, knocks all enemies 15 feet back, and interrupts all spellcasting.",
      flavorText: "A chord loud enough to silence thunder itself.",
      source: "talent", class: "Minstrel", treeId: "chord_combinations",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 25,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 16, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { notes: { baseAmount: 3 } },
      damageTypes: ["storm"],
      primaryDamage: { dice: "4d8", flat: 0, procChance: 100 },
      debuffs: ["knockback", "interrupt"], visualTheme: "sacred", tags: ["aoe", "knockback", "interrupt", "minstrel"]
    },
    rankUpgrades: [
      { description: "30-foot shockwave deals 5d8 storm damage, knocks enemies 20ft back, and knocks them prone.", primaryDamage: { dice: "5d8", flat: 0, procChance: 100 }, aoeSize: 30 },
      { description: "35-foot shockwave deals 6d8 storm damage, knocks enemies prone, and stuns them for 1 round.", primaryDamage: { dice: "6d8", flat: 0, procChance: 100 }, aoeSize: 35 }
    ]
  },
  {
    id: "cc_t4_double_time",
    name: "Double Time Tempo",
    icon: "spell_holy_divinehymn",
    maxRanks: 2,
    position: { x: 3.5, y: 4.5 },
    requires: "cc_t3_circle_mastery",
    spell: {
      name: "Double Time Tempo",
      description: "While you hold 4 or more notes, all your attack and spell cast times are reduced by 50 points, and you gain 1 bonus Action Point at the start of each turn.",
      flavorText: "Accelerando, but with weapons.",
      source: "talent", class: "Minstrel", treeId: "chord_combinations",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "haste", "action-economy", "minstrel"]
    },
    rankUpgrades: [
      { description: "Holding 4+ notes gives instant cast times on all cadence builders and grants 2 bonus Action Points per turn." }
    ]
  },

  // ──────────────── TIER 5 (5 pts) ────────────────
  {
    id: "cc_t5_crescendo_detonation",
    name: "Crescendo Detonation",
    icon: "spell_fire_selfdestruct",
    maxRanks: 2,
    position: { x: 1, y: 6 },
    requires: "cc_t4_thunder_stanza",
    spell: {
      name: "Crescendo Detonation",
      description: "Spend 4 notes: detonate the acoustic tension around a target within 45 feet. Deals 6d10 storm damage to the target and 3d10 to all enemies within 20 feet. Damage increases by +20 points for each Note V in your chord.",
      flavorText: "The loudest moment of the concert.",
      source: "talent", class: "Minstrel", treeId: "chord_combinations",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "ranged", range: 45, aoeShape: "circle", aoeSize: 20,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 24, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { notes: { baseAmount: 4 } },
      damageTypes: ["storm"],
      primaryDamage: { dice: "6d10", flat: 0, procChance: 100 },
      visualTheme: "sacred", tags: ["nuke", "aoe", "storm", "minstrel"]
    },
    rankUpgrades: [
      { description: "Deals 8d10 storm to target and 4d10 to nearby foes. Note V bonus increases to +30 points per Note V.", primaryDamage: { dice: "8d10", flat: 0, procChance: 100 }, cooldownValue: 18 }
    ]
  },
  {
    id: "cc_t5_overture_momentum",
    name: "Overture Momentum",
    icon: "ability_warrior_battleshout",
    maxRanks: 3,
    position: { x: 3, y: 6 },
    requires: "cc_t4_double_time",
    spell: {
      name: "Overture Momentum",
      description: "Whenever an ally hits an enemy affected by your Perfect Strike or Battle Anthem, that ally deals an additional 2d6 storm damage and you gain 1 Note V.",
      flavorText: "Every strike contributes to the score.",
      source: "talent", class: "Minstrel", treeId: "chord_combinations",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["storm"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      visualTheme: "sacred", tags: ["passive", "ally-proc", "notes", "minstrel"]
    },
    rankUpgrades: [
      { description: "Ally hits deal 3d6 bonus storm damage and grant 1 Note V.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } },
      { description: "Ally hits deal 4d6 bonus storm damage, grant 2 Note V, and extend Battle Anthem by 1 round.", primaryDamage: { dice: "4d6", flat: 0, procChance: 100 } }
    ]
  },

  // ──────────────── TIER 6 (5 pts) ────────────────
  {
    id: "cc_t6_rallying_fanfare",
    name: "Rallying Fanfare",
    icon: "ability_warrior_rallyingshout",
    maxRanks: 1,
    position: { x: 1, y: 7.5 },
    requires: "cc_t5_crescendo_detonation",
    spell: {
      name: "Rallying Fanfare",
      description: "Spend 5 notes: command up to 3 allies within 40 feet. Each targeted ally immediately uses a reaction to perform their strongest single-target attack with +4 to hit and double critical damage.",
      flavorText: "A single bar of music, answering a battle.",
      source: "talent", class: "Minstrel", treeId: "chord_combinations",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 40,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 60, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { notes: { baseAmount: 5 } },
      buffs: ["fanfare"], visualTheme: "sacred", tags: ["command", "ally-strike", "burst", "minstrel"]
    },
    rankUpgrades: []
  },
  {
    id: "cc_t6_iron_harmonics",
    name: "Harmonic Fortification",
    icon: "spell_holy_powerwordbarrier",
    maxRanks: 2,
    position: { x: 2.5, y: 7.5 },
    requires: "cc_t5_overture_momentum",
    spell: {
      name: "Harmonic Fortification",
      description: "You and all allies within 30 feet gain +3 Durability Steps to equipped durability, and weapon attacks score critical hits on 18+.",
      flavorText: "Armor tuned to the pitch of battle.",
      source: "talent", class: "Minstrel", treeId: "chord_combinations",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "crit-aura", "durability", "minstrel"]
    },
    rankUpgrades: [
      { description: "Party gains +5 Durability Steps to equipped durability and weapon attacks crit on 17+, dealing triple critical damage." }
    ]
  },
  {
    id: "cc_t6_storm_chords",
    name: "Tempest Cadence",
    icon: "spell_nature_chainlightning",
    maxRanks: 2,
    position: { x: 4, y: 7.5 },
    requires: "cc_t5_overture_momentum",
    spell: {
      name: "Tempest Cadence",
      description: "All storm damage dealt by you and your party ignores 6 Damage Reduction and has a 30 points chance to shock (interferes with enemy actions for 1 round).",
      flavorText: "The lightning hums in key.",
      source: "talent", class: "Minstrel", treeId: "chord_combinations",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["storm"],
      visualTheme: "sacred", tags: ["passive", "penetration", "shock", "minstrel"]
    },
    rankUpgrades: [
      { description: "Storm damage ignores 8 Damage Reduction, shock chance increases to 60 points, and shocked enemies take +20 points damage from all sources." }
    ]
  },

  // ──────────────── TIER 7 / CAPSTONE (15 pts) ────────────────
  {
    id: "cc_t7_titan_anthem",
    name: "Titan Anthem",
    icon: "spell_nature_unrelentingstorm",
    maxRanks: 1,
    position: { x: 0.5, y: 8 },
    requires: "cc_t6_rallying_fanfare",
    spell: {
      name: "Titan Anthem",
      description: "ULTIMATE: Spend 6 notes to conduct the Titan War Anthem for 1 minute: all allies within 50 feet deal TRIPLE damage dice on all attacks and spells, gain +4 Durability Steps to equipped durability, and whenever ANY ally kills an enemy, all party cooldowns are reduced by 10 seconds.",
      flavorText: "The song the mountains sing when they choose to move.",
      source: "talent", class: "Minstrel", treeId: "chord_combinations",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 50,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 180, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { notes: { baseAmount: 6 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      buffs: ["titan-anthem"], visualTheme: "sacred", tags: ["ultimate", "capstone", "party-buff", "minstrel"]
    },
    rankUpgrades: []
  },
  {
    id: "cc_t7_war_conductor",
    name: "War Conductor Doctrine",
    icon: "spell_holy_prayerofhealing",
    maxRanks: 5,
    position: { x: 1.5, y: 8 },
    requires: "cc_t6_rallying_fanfare",
    spell: {
      name: "War Conductor Doctrine",
      description: "All offensive storm damage dealt by your cadences and party battle anthems is increased by +1d6 damage.",
      flavorText: "The baton is mightier than the claymore.",
      source: "talent", class: "Minstrel", treeId: "chord_combinations",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["storm"],
      visualTheme: "sacred", tags: ["passive", "capstone", "damage", "minstrel"]
    },
    rankUpgrades: [
      { description: "Offensive storm damage increased by +1d8 damage." },
      { description: "Offensive storm damage increased by +1d8 damage." },
      { description: "Offensive storm damage increased by +2d8 damage." },
      { description: "Offensive storm damage increased by +2d8 damage, and Sonic Lance costs 0 mana." }
    ]
  },
  {
    id: "cc_t7_infinite_tempo",
    name: "Infinite Cadence",
    icon: "spell_holy_powerwordbarrier",
    maxRanks: 3,
    position: { x: 2.5, y: 8 },
    requires: "cc_t6_iron_harmonics",
    spell: {
      name: "Infinite Cadence",
      description: "Whenever you land a critical strike with an offensive cadence, you immediately generate 3 Note V notes and your next cadence costs 2 fewer notes.",
      flavorText: "The thunder does not pause between strikes.",
      source: "talent", class: "Minstrel", treeId: "chord_combinations",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "capstone", "crit-engine", "minstrel"]
    },
    rankUpgrades: [
      { description: "Crits generate 4 Note V notes and next cadence is free." },
      { description: "Crits generate full notes, next cadence is free and instant, and resets Crescendo Detonation." }
    ]
  },
  {
    id: "cc_t7_storm_overture",
    name: "Storm Overture",
    icon: "spell_nature_cyclone",
    maxRanks: 3,
    position: { x: 3.5, y: 8 },
    requires: "cc_t6_storm_chords",
    spell: {
      name: "Storm Overture",
      description: "At the start of combat, you instantly gain 4 Note V notes and all allies within 30 feet gain +4 to their initiative rolls.",
      flavorText: "The war begins on your first beat.",
      source: "talent", class: "Minstrel", treeId: "chord_combinations",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "capstone", "opener", "initiative", "minstrel"]
    },
    rankUpgrades: [
      { description: "Start combat with 6 Note V notes and party gains +6 to initiative and +15ft first-round speed." },
      { description: "Start combat with full notes, party acts first unconditionally, and your first Battle Anthem is cast automatically for free." }
    ]
  },
  {
    id: "cc_t7_unyielding_anthem",
    name: "Battlechoir Resurgence",
    icon: "ability_warrior_defensivestance",
    maxRanks: 3,
    position: { x: 4.5, y: 8 },
    requires: "cc_t6_storm_chords",
    spell: {
      name: "Battlechoir Resurgence",
      description: "Whenever an ally drops below half maximum Hit Points, you automatically emit a free Battle Anthem and grant that ally a 4d8 damage shield (cooldown: 30s).",
      flavorText: "When the line wavers, the chorus sings loudest.",
      source: "talent", class: "Minstrel", treeId: "chord_combinations",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "capstone", "protection", "minstrel"]
    },
    rankUpgrades: [
      { description: "Emits Battle Anthem + 6d8 damage shield, and the ally immediately makes a free retaliation strike." },
      { description: "Emits Battle Anthem + 8d8 shield, ally makes free retaliation strike with guaranteed critical hit, and restores 20 Hit Points." }
    ]
  }
];
