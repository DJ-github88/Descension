// ============================================
// MINSTREL — HARMONIC WEAVING (v3: spec identity redesign)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50.
//
// SPEC IDENTITY: The Soulsinger / Restorative Harmonist.
// While Battlechoir drives offensive war-chants and Dissonance shatters sanity,
// Harmonic Weaving weaves restorative cadences, cleanses spiritual wounds,
// generates party-wide shield barriers, and commands the tide-song of resurrection.
//
// SIGNATURE ACTIVES:
//   - Soothing Hymn (t1):        Instant group heal and tonic note generation
//   - Submediant Ward (t2):      Deploy sacred barrier absorbing incoming burst
//   - Authentic Cadence (t3):    Resolve notes for massive targeted rejuvenation
//   - Cleansing Stanza (t4):     Purge debuffs across all allies and grant save buffs
//   - Healing Chorus (t5):       Channeled symphony of tidal healing across 40 feet
//   - Death-Defying Aria (t6):   Reaction to catch and revive a fallen ally instantly
//   - Mereval Symphony (t7):     ULTIMATE — Eternal restorative tide making the party invincible
// ============================================

export const MINSTREL_HARMONIC_WEAVING = [
  // ──────────────── TIER 1 (8 pts) ────────────────
  {
    id: "hw_t1_soothing_hymn",
    name: "Soothing Hymn",
    icon: "spell_holy_prayerofhealing",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Soothing Hymn",
      description: "Play a restorative tide-melody: heal all allies within 30 feet for 2d6 health and generate 1 Note I (Tonic) and 1 Note IV (Subdominant).",
      flavorText: "Every healing melody starts on the same shore.",
      source: "talent", class: "Minstrel", treeId: "harmonic_weaving",
      spellType: "ACTIVE", category: "healing",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 6, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { mana: { baseAmount: 4 } },
      healing: { dice: "2d6", flat: 0 },
      visualTheme: "sacred", tags: ["healing", "notes", "aoe", "minstrel"]
    },
    rankUpgrades: [
      { description: "Heals all allies within 30 feet for 3d6 health and grants +1 Note I.", healing: { dice: "3d6", flat: 0 } },
      { description: "Heals all allies for 4d6 health, grants +2 Note I, and overheal becomes temporary health.", healing: { dice: "4d6", flat: 0 } }
    ]
  },
  {
    id: "hw_t1_tonic_resonance",
    name: "Tonic Resonance",
    icon: "spell_holy_silence",
    maxRanks: 3,
    position: { x: 2.5, y: 0 },
    requires: null,
    spell: {
      name: "Tonic Resonance",
      description: "Whenever you generate Note I (Tonic), the lowest-health ally within 30 feet is healed for 1d4 health and gains +1 Durability Steps to equipped durability for 1 round.",
      flavorText: "The sea tends its drowned things gently.",
      source: "talent", class: "Minstrel", treeId: "harmonic_weaving",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "self",
      healing: { dice: "1d4", flat: 0 },
      visualTheme: "sacred", tags: ["passive", "notes", "healing", "minstrel"]
    },
    rankUpgrades: [
      { description: "Note I generation heals lowest-health ally for 2d4 and grants +2 Durability Steps to equipped durability.", healing: { dice: "2d4", flat: 0 } },
      { description: "Note I generation heals for 3d4, grants +2 Durability Steps to equipped durability, and cleanses 1 minor debuff.", healing: { dice: "3d4", flat: 0 } }
    ]
  },
  {
    id: "hw_t1_gentle_tempo",
    name: "Slack Tide Grace",
    icon: "spell_holy_divinehymn",
    maxRanks: 2,
    position: { x: 4, y: 0 },
    requires: null,
    spell: {
      name: "Slack Tide Grace",
      description: "All your healing and cadence spells cost 2 less mana (minimum 1). Movement speed +10ft while you hold at least 3 notes.",
      flavorText: "A calm performer plays longer. Usually survives longer too.",
      source: "talent", class: "Minstrel", treeId: "harmonic_weaving",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "cost", "mobility", "minstrel"]
    },
    rankUpgrades: [
      { description: "Spells cost 3 less mana; movement speed +15ft while holding notes, and holding 5+ notes grants +2 to all saving throws." }
    ]
  },

  // ──────────────── TIER 2 (6 pts) ────────────────
  {
    id: "hw_t2_submediant_shield",
    name: "Submediant Ward",
    icon: "spell_holy_divineprovidence",
    maxRanks: 3,
    position: { x: 1, y: 1.5 },
    requires: "hw_t1_soothing_hymn",
    spell: {
      name: "Submediant Ward",
      description: "Spend 2 notes: envelop an ally within 45 feet in a resonant barrier absorbing 3d8 damage for 1 minute. When the ward breaks, it bursts, healing adjacent allies for 2d6.",
      flavorText: "The saddest note is the most protective. Ask any sailor.",
      source: "talent", class: "Minstrel", treeId: "harmonic_weaving",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "single", rangeType: "ranged", range: 45,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 8, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { notes: { baseAmount: 2 } },
      buffs: ["shield"], visualTheme: "sacred", tags: ["shield", "defense", "burst-heal", "minstrel"]
    },
    rankUpgrades: [
      { description: "Ward absorbs 4d8 damage, bursts for 3d8 healing on break, and cooldown drops to 6s.", cooldownValue: 6 },
      { description: "Ward absorbs 6d8 damage, bursts for 4d8 healing, and can be placed on two allies simultaneously.", resourceCosts: { notes: { baseAmount: 2 } } }
    ]
  },
  {
    id: "hw_t2_cadence_echo",
    name: "Cadence Memory",
    icon: "spell_holy_powerwordbarrier",
    maxRanks: 3,
    position: { x: 3, y: 1.5 },
    requires: "hw_t1_tonic_resonance",
    spell: {
      name: "Cadence Memory",
      description: "When you resolve any cadence, retain 1 note of your choice from the consumed chord, and all allies gain 1d6 temporary health.",
      flavorText: "Nothing truly ends. Especially not the good parts.",
      source: "talent", class: "Minstrel", treeId: "harmonic_weaving",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "cadence", "notes", "minstrel"]
    },
    rankUpgrades: [
      { description: "Retain 2 notes of your choice from consumed cadences; allies gain 2d6 temporary health." },
      { description: "Retain 2 notes freely; allies gain 3d6 temporary health and 10% movement speed for 1 round." }
    ]
  },

  // ──────────────── TIER 3 (6 pts) ────────────────
  {
    id: "hw_t3_authentic_mastery",
    name: "Authentic Cadence",
    icon: "spell_holy_layonhands",
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: "hw_t2_submediant_shield",
    spell: {
      name: "Authentic Cadence",
      description: "Spend 4 notes (V to I progression): unleash an authentic resolution on an ally within 45 feet. Heals 3d8 health and grants +3 Durability Steps to equipped durability and 20% all-damage resistance for 2 rounds.",
      flavorText: "The grand finale resonates deeper than any individual note.",
      source: "talent", class: "Minstrel", treeId: "harmonic_weaving",
      spellType: "ACTIVE", category: "healing",
      targetingMode: "single", rangeType: "ranged", range: 45,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 10, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { notes: { baseAmount: 4 } },
      healing: { dice: "3d8", flat: 0 },
      buffs: ["authentic-resolve"], visualTheme: "sacred", tags: ["cadence", "nuke-heal", "buff", "minstrel"]
    },
    rankUpgrades: [
      { description: "Heals 4d8 health, grants +3 Durability Steps to equipped durability and 20% resistance for 2 rounds.", healing: { dice: "4d8", flat: 0 } },
      { description: "Heals 5d8 health, grants +3 Durability Steps to equipped durability, 20% resistance, and also heals all adjacent allies for 50% of the amount.", healing: { dice: "5d8", flat: 0 } }
    ]
  },
  {
    id: "hw_t3_plagal_bounty",
    name: "Plagal Flow",
    icon: "spell_holy_renew",
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: "hw_t2_cadence_echo",
    spell: {
      name: "Plagal Flow",
      description: "Whenever you complete a cadence, all allies within 30 feet gain regeneration: healing 1d6 health per round for 3 rounds.",
      flavorText: "Amen, said the tide.",
      source: "talent", class: "Minstrel", treeId: "harmonic_weaving",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "self",
      healing: { dice: "1d6", flat: 0, isHoT: true, hotDuration: 3, hotTick: "1d6" },
      visualTheme: "sacred", tags: ["passive", "cadence", "hot", "minstrel"]
    },
    rankUpgrades: [
      { description: "Cadences grant regeneration of 2d6 health per round for 3 rounds.", healing: { dice: "2d6", flat: 0, isHoT: true, hotDuration: 3, hotTick: "2d6" } },
      { description: "Cadences grant 3d6 health per round for 4 rounds, and regeneration ticks cannot be halted by heal-reduction effects." }
    ]
  },

  // ──────────────── TIER 4 (5 pts) ────────────────
  {
    id: "hw_t4_cleansing_stanza",
    name: "Cleansing Stanza",
    icon: "spell_holy_divineprovidence",
    maxRanks: 3,
    position: { x: 1, y: 4.5 },
    requires: "hw_t3_authentic_mastery",
    spell: {
      name: "Cleansing Stanza",
      description: "Spend 2 notes: emit a wave of pure harmonic resonance. Removes ALL curses, diseases, poisons, and debuffs from all allies within 35 feet, granting them immunity to new debuffs for 1 round.",
      flavorText: "Optimism, weaponized against corruption.",
      source: "talent", class: "Minstrel", treeId: "harmonic_weaving",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 35,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 18, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { notes: { baseAmount: 2 } },
      buffs: ["cleanse-immunity"], visualTheme: "sacred", tags: ["cleanse", "aoe", "immunity", "minstrel"]
    },
    rankUpgrades: [
      { description: "Removes all debuffs, grants 2 rounds of immunity, and heals cleansed allies for 2d8 each.", cooldownValue: 14 },
      { description: "Removes all debuffs, grants 2 rounds immunity, heals for 3d8, and refunds 1 note for every debuff removed.", cooldownValue: 12 }
    ]
  },
  {
    id: "hw_t4_lullaby_ward",
    name: "Lullaby Ward",
    icon: "spell_holy_silence",
    maxRanks: 2,
    position: { x: 3.5, y: 4.5 },
    requires: "hw_t3_plagal_bounty",
    spell: {
      name: "Lullaby Ward",
      description: "When an ally within 30 feet is targeted by an enemy spell, use a reaction to grant them advantage on the save and a 2d8 damage shield.",
      flavorText: "Sleep tight. The wards hold.",
      source: "talent", class: "Minstrel", treeId: "harmonic_weaving",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "reaction", "save-buff", "minstrel"]
    },
    rankUpgrades: [
      { description: "Reaction grants +4 to the saving throw, a 4d8 damage shield, and if the save succeeds, refunds 2 notes to you." }
    ]
  },

  // ──────────────── TIER 5 (5 pts) ────────────────
  {
    id: "hw_t5_healing_chorus",
    name: "Healing Chorus",
    icon: "spell_holy_prayerofhealing",
    maxRanks: 2,
    position: { x: 1, y: 6 },
    requires: "hw_t4_cleansing_stanza",
    spell: {
      name: "Healing Chorus",
      description: "Spend 4 notes: channel a soaring vocal hymn for 3 rounds. All allies within 40 feet heal for 3d8 health each round and cannot be knocked down or displaced while within the song.",
      flavorText: "The sea sings bass. It is very good at it.",
      source: "talent", class: "Minstrel", treeId: "harmonic_weaving",
      spellType: "ACTIVE", category: "healing",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 40,
      castTimeType: "channeled", castTimeValue: 3,
      cooldownCategory: "long", cooldownValue: 45, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { notes: { baseAmount: 4 } },
      healing: { dice: "3d8", flat: 0 },
      visualTheme: "sacred", tags: ["channel", "aoe-heal", "unyielding", "minstrel"]
    },
    rankUpgrades: [
      { description: "Heals 5d8 per round within 40 feet, allies gain +2 to all rolls while inside, and can be channeled while taking other actions.", cooldownValue: 35 }
    ]
  },
  {
    id: "hw_t5_tonic_overflow",
    name: "Tonic Surge",
    icon: "spell_holy_powerwordbarrier",
    maxRanks: 3,
    position: { x: 3, y: 6 },
    requires: "hw_t4_lullaby_ward",
    spell: {
      name: "Tonic Surge",
      description: "Whenever you hold 4 or more notes, all your healing spells heal for 30% more, and you passively heal adjacent allies for 1d6 health every round.",
      flavorText: "The tonic cannot be contained. Neither can the tide.",
      source: "talent", class: "Minstrel", treeId: "harmonic_weaving",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "healing-boost", "aura", "minstrel"]
    },
    rankUpgrades: [
      { description: "Holding 4+ notes boosts healing by 50% and passive aura heals for 2d6 per round." },
      { description: "Holding 4+ notes boosts healing by 75%, aura heals for 3d6, and you generate 1 free Note I every round." }
    ]
  },

  // ──────────────── TIER 6 (5 pts) ────────────────
  {
    id: "hw_t6_death_defying_aria",
    name: "Death-Defying Aria",
    icon: "spell_holy_resurrection",
    maxRanks: 1,
    position: { x: 1, y: 7.5 },
    requires: "hw_t5_healing_chorus",
    spell: {
      name: "Death-Defying Aria",
      description: "Reaction: when an ally within 60 feet drops to 0 health, consume 4 notes to instantly revive them with 50% maximum health and 30 temporary health. Cooldown: 90s.",
      flavorText: "The encore nobody wanted to need.",
      source: "talent", class: "Minstrel", treeId: "harmonic_weaving",
      spellType: "ACTIVE", category: "healing",
      targetingMode: "single", rangeType: "ranged", range: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 90, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { notes: { baseAmount: 4 } },
      healing: { dice: "6d10", flat: 0 },
      visualTheme: "sacred", tags: ["revive", "reaction", "cheat-death", "minstrel"]
    },
    rankUpgrades: []
  },
  {
    id: "hw_t6_unbroken_chorus",
    name: "Symphonic Harmony",
    icon: "spell_holy_divinehymn",
    maxRanks: 2,
    position: { x: 2.5, y: 7.5 },
    requires: "hw_t5_tonic_overflow",
    spell: {
      name: "Symphonic Harmony",
      description: "When you cast a healing spell, 30% of the healing done is duplicated to ALL other allies within 30 feet.",
      flavorText: "The melody splits cleanly, losing nothing in the translation.",
      source: "talent", class: "Minstrel", treeId: "harmonic_weaving",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "smart-heal", "cleave", "minstrel"]
    },
    rankUpgrades: [
      { description: "40% of single-target healing is duplicated to all allies within 35 feet, and overheal grants +1 Durability Steps to equipped durability (stacks up to +3)." }
    ]
  },
  {
    id: "hw_t6_tide_resilience",
    name: "Tidal Sanctum",
    icon: "spell_holy_powerwordbarrier",
    maxRanks: 2,
    position: { x: 4, y: 7.5 },
    requires: "hw_t5_tonic_overflow",
    spell: {
      name: "Tidal Sanctum",
      description: "You and all allies within 30 feet cannot have your maximum health reduced, and take 15% less damage from all sources.",
      flavorText: "The harbor wall holds against the open deep.",
      source: "talent", class: "Minstrel", treeId: "harmonic_weaving",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "aura", "defense", "minstrel"]
    },
    rankUpgrades: [
      { description: "Party takes 25% less damage from all sources and gains +3 to all saving throws against magical effects." }
    ]
  },

  // ──────────────── TIER 7 / CAPSTONE (15 pts) ────────────────
  {
    id: "hw_t7_mereval_symphony",
    name: "Mereval Symphony",
    icon: "spell_holy_divinehymn",
    maxRanks: 1,
    position: { x: 0.5, y: 8 },
    requires: "hw_t6_death_defying_aria",
    spell: {
      name: "Mereval Symphony",
      description: "ULTIMATE: Spend 6 notes to unleash the Grand Symphony of the Mereval for 1 minute: all allies within 50 feet regenerate 4d8 health each round, cannot drop below 1 health from any single attack, and all enemy damage within the radius is reduced by 40%.",
      flavorText: "The song the world was sung with. You are conducting it now.",
      source: "talent", class: "Minstrel", treeId: "harmonic_weaving",
      spellType: "ACTIVE", category: "healing",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 50,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 180, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { notes: { baseAmount: 6 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      healing: { dice: "4d8", flat: 0 },
      buffs: ["grand-symphony"], visualTheme: "sacred", tags: ["ultimate", "capstone", "invulnerability", "minstrel"]
    },
    rankUpgrades: []
  },
  {
    id: "hw_t7_sacred_choir",
    name: "Sacred Choir Doctrine",
    icon: "spell_holy_prayerofhealing",
    maxRanks: 5,
    position: { x: 1.5, y: 8 },
    requires: "hw_t6_death_defying_aria",
    spell: {
      name: "Sacred Choir Doctrine",
      description: "Every verse harmonizes. All healing you perform across all spells and cadences is increased by 10%.",
      flavorText: "A hundred voices, singing in one throat.",
      source: "talent", class: "Minstrel", treeId: "harmonic_weaving",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "capstone", "healing-boost", "minstrel"]
    },
    rankUpgrades: [
      { description: "All healing increased by 20%." },
      { description: "All healing increased by 35%." },
      { description: "All healing increased by 50%." },
      { description: "All healing increased by 70%, and Soothing Hymn generates 4 notes instead of 2." }
    ]
  },
  {
    id: "hw_t7_endless_cadence",
    name: "Endless Cadence",
    icon: "spell_holy_powerwordbarrier",
    maxRanks: 3,
    position: { x: 2.5, y: 8 },
    requires: "hw_t6_unbroken_chorus",
    spell: {
      name: "Endless Cadence",
      description: "Whenever you complete a cadence, your next cadence within 2 rounds costs 2 fewer notes (minimum 1).",
      flavorText: "The resolution of one chord is the opening of the next.",
      source: "talent", class: "Minstrel", treeId: "harmonic_weaving",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "capstone", "cadence-chain", "minstrel"]
    },
    rankUpgrades: [
      { description: "Chained cadences cost 3 fewer notes, and their healing is increased by 25%." },
      { description: "Chained cadences cost 3 fewer notes, deal +50% healing, and grant 1 Action Point on completion." }
    ]
  },
  {
    id: "hw_t7_fountain_of_life",
    name: "Fountain of the Deep",
    icon: "spell_holy_renew",
    maxRanks: 3,
    position: { x: 3.5, y: 8 },
    requires: "hw_t6_unbroken_chorus",
    spell: {
      name: "Fountain of the Deep",
      description: "Whenever an ally is healed above maximum health, they gain 100% of the excess as a temporary health barrier (up to 40 temp HP).",
      flavorText: "The tide cannot overflow; it only claims higher ground.",
      source: "talent", class: "Minstrel", treeId: "harmonic_weaving",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "capstone", "overheal-shield", "minstrel"]
    },
    rankUpgrades: [
      { description: "Overheal converts to temporary health up to 70 temp HP, and allies with temp HP deal +10% damage." },
      { description: "Overheal converts to temporary health up to 100 temp HP; allies with temp HP deal +20% damage and gain +2 Durability Steps to equipped durability." }
    ]
  },
  {
    id: "hw_t7_tide_immortality",
    name: "Immortal Cadence",
    icon: "spell_holy_divineprovidence",
    maxRanks: 3,
    position: { x: 4.5, y: 8 },
    requires: "hw_t6_tide_resilience",
    spell: {
      name: "Immortal Cadence",
      description: "While you maintain at least 4 notes, you cannot be killed: lethal damage consumes all your notes and heals you for 5d10 health (cooldown: 120s).",
      flavorText: "The song refuses to let the singer fall.",
      source: "talent", class: "Minstrel", treeId: "harmonic_weaving",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "capstone", "cheat-death", "minstrel"]
    },
    rankUpgrades: [
      { description: "Lethal damage consumes notes, heals you for 7d10, and grants you 40 temporary health (cooldown: 90s)." },
      { description: "Lethal damage consumes notes, heals you for full health, casts Cleansing Stanza automatically, and resets Death-Defying Aria (cooldown: 60s)." }
    ]
  }
];
