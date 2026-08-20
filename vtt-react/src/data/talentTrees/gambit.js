// ============================================
// GAMBIT TALENT TREES (v3: full v2/v3 active/passive spec identity overhaul)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50 pts per tree.
//
// SPECS:
//   1. PROBABILITY SAVANT: The Precise Dice Nudger / Statistical Controller / Fate Math Savant.
//   2. HIGH ROLLER:        The Volatile All-In Gambler / Self-Harm Risk Escalator / Jackpot Nuke.
//   3. KARMIC WEAVER:      The Soul-Tethering Debt Collector / Wyrd Fate Linker.
// ============================================

// ============================================
// 1. GAMBIT — PROBABILITY SAVANT
// ============================================
export const GAMBIT_PROBABILITY_SAVANT = [
  // ──────────────── TIER 1 (8 pts) ────────────────
  {
    id: "ps_t1_calculated_nudge",
    name: "Calculated Nudge",
    icon: "inv_misc_scalesofjustice",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Calculated Nudge",
      description: "Spend 1 Fortune Point (FP) as a reaction: alter any d20 roll within 60 feet by +2 or -2 after seeing the result. Generates 1 FP if the modified roll succeeds.",
      flavorText: "The Iceheart Sea teaches that every wave is a wager.",
      source: "talent", class: "Gambit", treeId: "probability_savant",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "single", rangeType: "ranged", range: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 4, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { fortunePoints: { baseAmount: 1 } },
      visualTheme: "arcane", tags: ["reaction", "dice-nudge", "math", "gambit"]
    },
    rankUpgrades: [
      { description: "Alters roll by +/-3 and grants the target +1d6 bonus damage on success." },
      { description: "Alters roll by +/-4, grants +2d6 damage, and refunds the FP unconditionally." }
    ]
  },
  {
    id: "ps_t1_balanced_ledger",
    name: "Balanced Ledger",
    icon: "inv_misc_coin_01",
    maxRanks: 3,
    position: { x: 2.5, y: 0 },
    requires: null,
    spell: {
      name: "Balanced Ledger",
      description: "Your maximum Fortune Points increase by 3. When you have 4 or more FP, your attacks gain +2 to hit and deal +1d6 psychic damage.",
      flavorText: "A book that always balances in the house's favor.",
      source: "talent", class: "Gambit", treeId: "probability_savant",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["psychic"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "arcane", tags: ["passive", "fp-cap", "bonus-damage", "gambit"]
    },
    rankUpgrades: [
      { description: "Max FP +5; at 4+ FP gain +3 to hit and +2d6 psychic damage." },
      { description: "Max FP +8; at 4+ FP gain +4 to hit, +3d6 psychic damage, and +2 Durability Steps to equipped durability." }
    ]
  },
  {
    id: "ps_t1_soft_landing",
    name: "Probability Shield",
    icon: "spell_holy_borrowedtime",
    maxRanks: 2,
    position: { x: 4, y: 0 },
    requires: null,
    spell: {
      name: "Probability Shield",
      description: "When your FP drops to 0, gain a 30-damage psychic ward and you take 20% less damage for 2 rounds.",
      flavorText: "The mathematical law of regression to the mean protects the bankrupt.",
      source: "talent", class: "Gambit", treeId: "probability_savant",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "shield", "safety-net", "gambit"]
    },
    rankUpgrades: [
      { description: "Gain 60-damage psychic ward and take 40% less damage for 3 rounds on hitting 0 FP." }
    ]
  },

  // ──────────────── TIER 2 (6 pts) ────────────────
  {
    id: "ps_t2_card_counter",
    name: "Card Counter Mark",
    icon: "ability_rogue_findweakness",
    maxRanks: 3,
    position: { x: 1, y: 1.5 },
    requires: "ps_t1_calculated_nudge",
    spell: {
      name: "Card Counter Mark",
      description: "Spend 2 FP: mark an enemy within 50 feet for 1 minute: tracks their mathematical weaknesses. Your attacks against them cannot miss, deal 3d8 psychic damage, and all nudges affecting them cost 0 FP.",
      flavorText: "Track the deck, count the discards, predict every motion.",
      source: "talent", class: "Gambit", treeId: "probability_savant",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "single", rangeType: "ranged", range: 50,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 8, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { fortunePoints: { baseAmount: 2 } },
      damageTypes: ["psychic"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      debuffs: ["counted"], visualTheme: "arcane", tags: ["mark", "no-miss", "free-nudge", "gambit"]
    },
    rankUpgrades: [
      { description: "Deals 5d8 psychic damage, and allies also gain advantage on attacks against the marked target.", primaryDamage: { dice: "5d8", flat: 0, procChance: 100 } },
      { description: "Deals 7d8 psychic damage, all ally attacks against target crit on 18+, and resets cooldown on target death.", primaryDamage: { dice: "7d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "ps_t2_aether_foresight",
    name: "Aether Foresight",
    icon: "inv_misc_tarot_01",
    maxRanks: 3,
    position: { x: 3, y: 1.5 },
    requires: "ps_t1_balanced_ledger",
    spell: {
      name: "Aether Foresight",
      description: "When an enemy casts a spell or makes an attack roll against you, peek at fate: force the enemy to roll twice and take the lower result (disadvantage).",
      flavorText: "Knowing the next card before it leaves the shoe.",
      source: "talent", class: "Gambit", treeId: "probability_savant",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "disadvantage", "defense", "gambit"]
    },
    rankUpgrades: [
      { description: "Enemies attack with disadvantage; when they miss, you gain 1 FP." },
      { description: "Enemies attack with disadvantage; misses grant 2 FP and reflect 2d8 psychic damage back." }
    ]
  },

  // ──────────────── TIER 3 (6 pts) ────────────────
  {
    id: "ps_t3_law_of_averages",
    name: "Law of Averages",
    icon: "spell_arcane_arcane04",
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: "ps_t2_card_counter",
    spell: {
      name: "Law of Averages",
      description: "Spend 3 FP: force any d20 roll within 60 feet to resolve as exactly 10. Deals 4d8 psychic damage if used on an enemy, or grants 30 temporary health if used on an ally.",
      flavorText: "Taming the wild swings of fortune into cold certainty.",
      source: "talent", class: "Gambit", treeId: "probability_savant",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "single", rangeType: "ranged", range: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 14, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { fortunePoints: { baseAmount: 3 } },
      damageTypes: ["psychic"],
      primaryDamage: { dice: "4d8", flat: 0, procChance: 100 },
      visualTheme: "arcane", tags: ["fix-dice", "deterministic", "utility", "gambit"]
    },
    rankUpgrades: [
      { description: "Force roll to exactly 12; deals 6d8 psychic or grants 50 temp HP, cooldown drops to 10s.", primaryDamage: { dice: "6d8", flat: 0, procChance: 100 }, cooldownValue: 10 },
      { description: "Force roll to exactly 15 for allies (or 5 for enemies); deals 8d8 psychic or grants 70 temp HP.", primaryDamage: { dice: "8d8", flat: 0, procChance: 100 }, cooldownValue: 8 }
    ]
  },
  {
    id: "ps_t3_variance_suppression",
    name: "Variance Suppression",
    icon: "inv_misc_scalesofjustice",
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: "ps_t2_aether_foresight",
    spell: {
      name: "Variance Suppression",
      description: "All enemy damage rolls against your party cannot roll maximum damage (all damage dice rolled by enemies are reduced by 2).",
      flavorText: "Cutting off the high end of enemy fortune.",
      source: "talent", class: "Gambit", treeId: "probability_savant",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "damage-clamp", "party-defense", "gambit"]
    },
    rankUpgrades: [
      { description: "Enemy damage dice reduced by 3 and enemies cannot score critical hits against your party." },
      { description: "Enemy damage dice reduced by 4, immunity to enemy critical hits, and your party deals +20% damage." }
    ]
  },

  // ──────────────── TIER 4 (5 pts) ────────────────
  {
    id: "ps_t4_quantum_collapse",
    name: "Probability Singularity",
    icon: "spell_arcane_blast",
    maxRanks: 3,
    position: { x: 1, y: 4.5 },
    requires: "ps_t3_law_of_averages",
    spell: {
      name: "Probability Singularity",
      description: "Spend 4 FP: collapse all probability waves in a 30-foot area within 50 feet. Deals 6d10 psychic/force damage to all enemies, silences them for 1 round, and sets all their d20 rolls next round to 1.",
      flavorText: "Total collapse of favorable outcomes for the enemy.",
      source: "talent", class: "Gambit", treeId: "probability_savant",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "ranged", range: 50, aoeShape: "circle", aoeSize: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 20, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { fortunePoints: { baseAmount: 4 } },
      damageTypes: ["psychic", "force"],
      primaryDamage: { dice: "6d10", flat: 0, procChance: 100 },
      debuffs: ["forced-one"], visualTheme: "arcane", tags: ["aoe", "nuke", "forced-fail", "gambit"]
    },
    rankUpgrades: [
      { description: "35-foot area deals 8d10 damage, silences for 2 rounds, and cooldown drops to 16s.", primaryDamage: { dice: "8d10", flat: 0, procChance: 100 }, aoeSize: 35, cooldownValue: 16 },
      { description: "40-foot area deals 10d10 damage, silences for 2 rounds, and all affected foes take double damage for 2 rounds.", primaryDamage: { dice: "10d10", flat: 0, procChance: 100 }, aoeSize: 40, cooldownValue: 12 }
    ]
  },
  {
    id: "ps_t4_perfect_deck",
    name: "Deck Optimization",
    icon: "inv_misc_tarot_01",
    maxRanks: 2,
    position: { x: 3.5, y: 4.5 },
    requires: "ps_t3_variance_suppression",
    spell: {
      name: "Deck Optimization",
      description: "Whenever you draw a card from your magical deck, draw 2 cards and keep both. When you cast a spell, refund 1 FP.",
      flavorText: "Stacking the cards in broad daylight.",
      source: "talent", class: "Gambit", treeId: "probability_savant",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "card-draw", "fp-refund", "gambit"]
    },
    rankUpgrades: [
      { description: "Draw 3 cards and keep all 3; refund 2 FP on every spell cast." }
    ]
  },

  // ──────────────── TIER 5 (5 pts) ────────────────
  {
    id: "ps_t5_grand_equation",
    name: "The Grand Equation",
    icon: "spell_arcane_starfire",
    maxRanks: 2,
    position: { x: 1, y: 6 },
    requires: "ps_t4_quantum_collapse",
    spell: {
      name: "The Grand Equation",
      description: "Spend 5 FP: calculate the perfect sequence of actions for your party for 2 rounds. All party members gain +10 to attack rolls, +4 to saving throws, and all their attacks deal maximum damage dice.",
      flavorText: "The mathematical proof of absolute victory.",
      source: "talent", class: "Gambit", treeId: "probability_savant",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 40,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 30, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { fortunePoints: { baseAmount: 5 } },
      durationRounds: 2, durationRealTime: 12, durationUnit: "seconds",
      buffs: ["grand-equation"], visualTheme: "arcane", tags: ["party-buff", "maximize-dice", "sure-hit", "gambit"]
    },
    rankUpgrades: [
      { description: "Grand Equation lasts 3 rounds: party attacks are guaranteed critical hits and ignore all enemy durability.", cooldownValue: 24 }
    ]
  },
  {
    id: "ps_t5_infinite_fortune",
    name: "Fortune Compound Interest",
    icon: "inv_misc_coin_01",
    maxRanks: 3,
    position: { x: 3, y: 6 },
    requires: "ps_t4_perfect_deck",
    spell: {
      name: "Fortune Compound Interest",
      description: "At the start of every combat round, your current Fortune Points increase by 50% (rounded up), and you start combat at maximum FP.",
      flavorText: "Wealth that breeds wealth exponentially.",
      source: "talent", class: "Gambit", treeId: "probability_savant",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "fp-exponential", "economy", "gambit"]
    },
    rankUpgrades: [
      { description: "FP doubles every round (up to max cap) and your maximum FP increases by +6." },
      { description: "FP doubles every round; maximum FP increases by +12 and abilities cost 1 fewer FP." }
    ]
  },

  // ──────────────── TIER 6 (5 pts) ────────────────
  {
    id: "ps_t6_deterministic_reality",
    name: "Deterministic Reality",
    icon: "inv_misc_platnumdisks",
    maxRanks: 1,
    position: { x: 1, y: 7.5 },
    requires: "ps_t5_grand_equation",
    spell: {
      name: "Deterministic Reality",
      description: "Spend 6 FP: eliminate randomness from the battlefield for 2 rounds: every single roll your party makes is treated as a natural 20, while every roll enemies make is treated as a natural 1.",
      flavorText: "There is no chance. Only the equation.",
      source: "talent", class: "Gambit", treeId: "probability_savant",
      spellType: "ACTIVE", category: "control",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 90, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { fortunePoints: { baseAmount: 6 } },
      durationRounds: 2, durationRealTime: 12, durationUnit: "seconds",
      buffs: ["deterministic-reality"], visualTheme: "arcane", tags: ["all-20s", "all-1s", "climax", "gambit"]
    },
    rankUpgrades: []
  },
  {
    id: "ps_t6_math_criticality",
    name: "Perfect Precision",
    icon: "spell_arcane_blast",
    maxRanks: 2,
    position: { x: 2.5, y: 7.5 },
    requires: "ps_t5_infinite_fortune",
    spell: {
      name: "Perfect Precision",
      description: "All psychic and force spells you cast deal triple critical damage and score critical hits on 17+.",
      flavorText: "Hitting the exact mathematical weak point.",
      source: "talent", class: "Gambit", treeId: "probability_savant",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["psychic", "force"],
      visualTheme: "arcane", tags: ["passive", "crit", "triple-damage", "gambit"]
    },
    rankUpgrades: [
      { description: "Critical hits on 16+; crits deal quadruple damage and refund 3 FP." }
    ]
  },
  {
    id: "ps_t6_probability_shield_aura",
    name: "Statistical Immunity",
    icon: "spell_holy_powerwordbarrier",
    maxRanks: 2,
    position: { x: 4, y: 7.5 },
    requires: "ps_t5_infinite_fortune",
    spell: {
      name: "Statistical Immunity",
      description: "You and all allies within 30 feet take 25% less damage from all sources, and cannot be affected by negative conditions lasting longer than 1 round.",
      flavorText: "Negative outcomes are filtered out before arrival.",
      source: "talent", class: "Gambit", treeId: "probability_savant",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "condition-reduction", "dr", "gambit"]
    },
    rankUpgrades: [
      { description: "Party takes 40% less damage and is completely immune to stun, silence, and paralysis." }
    ]
  },

  // ──────────────── TIER 7 / CAPSTONE (15 pts) ────────────────
  {
    id: "ps_t7_avatar_of_the_savant",
    name: "Avatar of Absolute Certainty",
    icon: "inv_misc_scalesofjustice",
    maxRanks: 1,
    position: { x: 0.5, y: 9.5 },
    requires: "ps_t6_deterministic_reality",
    spell: {
      name: "Avatar of Absolute Certainty",
      description: "ULTIMATE: Spend 8 FP: take supreme control of universal probability for 1 minute: all enemy attacks miss your party automatically (100% miss chance), all party strikes are guaranteed critical hits for maximum dice damage, and all party ability cooldowns reset every round.",
      flavorText: "The dice are removed. The outcome was decided before you entered the room.",
      source: "talent", class: "Gambit", treeId: "probability_savant",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 180, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { fortunePoints: { baseAmount: 8 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      buffs: ["absolute-certainty"], visualTheme: "arcane", tags: ["ultimate", "capstone", "god-mode", "gambit"]
    },
    rankUpgrades: []
  },
  {
    id: "ps_t7_savant_doctrine",
    name: "Probability Savant Doctrine",
    icon: "inv_misc_tarot_01",
    maxRanks: 5,
    position: { x: 1.5, y: 9.5 },
    requires: "ps_t6_deterministic_reality",
    spell: {
      name: "Probability Savant Doctrine",
      description: "All psychic, force, and card-based damage you deal is increased by 10%.",
      flavorText: "The house edge is mathematically absolute.",
      source: "talent", class: "Gambit", treeId: "probability_savant",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["psychic"],
      visualTheme: "arcane", tags: ["passive", "capstone", "damage", "gambit"]
    },
    rankUpgrades: [
      { description: "All psychic and card damage increased by 20%." },
      { description: "All psychic and card damage increased by 35%." },
      { description: "All psychic and card damage increased by 50%." },
      { description: "All psychic and card damage increased by 70%, and Calculated Nudge costs 0 FP." }
    ]
  },
  {
    id: "ps_t7_infinite_fp_engine",
    name: "Infinite Fortune Reservoir",
    icon: "inv_misc_coin_01",
    maxRanks: 3,
    position: { x: 2.5, y: 9.5 },
    requires: "ps_t6_math_criticality",
    spell: {
      name: "Infinite Fortune Reservoir",
      description: "Your maximum Fortune Points increase by 10, and whenever any d20 roll occurs anywhere in the combat, you gain 1 FP.",
      flavorText: "Every toss of the bone pays a royalty.",
      source: "talent", class: "Gambit", treeId: "probability_savant",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "capstone", "fp-engine", "gambit"]
    },
    rankUpgrades: [
      { description: "Max FP +15; gain 2 FP per roll and movement speed +15ft." },
      { description: "Max FP +20; gain 3 FP per roll and all spells cast with 0 cast time." }
    ]
  },
  {
    id: "ps_t7_mathematical_execution",
    name: "Deterministic Guillotine",
    icon: "ability_rogue_deadliness",
    maxRanks: 3,
    position: { x: 3.5, y: 9.5 },
    requires: "ps_t6_math_criticality",
    spell: {
      name: "Deterministic Guillotine",
      description: "When an enemy fails a saving throw against your spells, they take an additional 5d10 psychic true damage.",
      flavorText: "An error in their calculations costs them their life.",
      source: "talent", class: "Gambit", treeId: "probability_savant",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["psychic"],
      primaryDamage: { dice: "5d10", flat: 0, procChance: 100 },
      visualTheme: "arcane", tags: ["passive", "capstone", "punish-fail", "gambit"]
    },
    rankUpgrades: [
      { description: "Save failure deals 8d10 psychic true damage and silences for 1 round." },
      { description: "Save failure deals 12d10 psychic true damage, silences for 2 rounds, and resets all your cooldowns." }
    ]
  },
  {
    id: "ps_t7_statistical_immortality",
    name: "Probability Shift Rebirth",
    icon: "spell_holy_borrowedtime",
    maxRanks: 3,
    position: { x: 4.5, y: 9.5 },
    requires: "ps_t6_probability_shield_aura",
    spell: {
      name: "Probability Shift Rebirth",
      description: "While you maintain at least 4 FP, lethal damage causes a quantum recalculation: restores 50% health, 50 temporary health, sets your FP to max, and freezes all enemies for 1 round (cooldown: 120s).",
      flavorText: "The timeline where you died had a probability of zero.",
      source: "talent", class: "Gambit", treeId: "probability_savant",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "capstone", "cheat-death", "gambit"]
    },
    rankUpgrades: [
      { description: "Survive lethal damage, restore 75% health, 75 temp HP, freeze foes for 2 rounds (cooldown: 90s)." },
      { description: "Survive lethal damage, restore 100% health, and immediately trigger Deterministic Reality automatically for free (cooldown: 60s)." }
    ]
  }
];

// ============================================
// 2. GAMBIT — HIGH ROLLER
// ============================================
export const GAMBIT_HIGH_ROLLER = [
  // ──────────────── TIER 1 (8 pts) ────────────────
  {
    id: "hr_t1_all_in_strike",
    name: "All-In Strike",
    icon: "ability_warrior_bloodfrenzy",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "All-In Strike",
      description: "Sacrifice 10% of your current HP: unleash a reckless melee/ranged strike dealing 3d8 fire/force damage and gaining Fortune Points equal to 1 per 5 HP sacrificed.",
      flavorText: "The Iceheart Sea teaches that pain is fuel.",
      source: "talent", class: "Gambit", treeId: "high_roller",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "melee", range: 10,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 6, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { healthPercent: { baseAmount: 10 } },
      damageTypes: ["fire", "force"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      visualTheme: "fire", tags: ["self-harm", "fp-builder", "burst", "gambit"]
    },
    rankUpgrades: [
      { description: "Sacrifice 15% HP: deals 5d8 damage and generates double FP.", primaryDamage: { dice: "5d8", flat: 0, procChance: 100 } },
      { description: "Sacrifice 20% HP: deals 7d8 damage, generates triple FP, and strike is an automatic critical hit.", primaryDamage: { dice: "7d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "hr_t1_double_down",
    name: "Double Down",
    icon: "ability_warrior_endlessrage",
    maxRanks: 3,
    position: { x: 2.5, y: 0 },
    requires: null,
    spell: {
      name: "Double Down",
      description: "Whenever you take self-damage from spells or abilities, gain 2 Fortune Points and your next attack deals +1d8 bonus fire damage.",
      flavorText: "When the wager hurts, double the bet.",
      source: "talent", class: "Gambit", treeId: "high_roller",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["fire"],
      primaryDamage: { dice: "1d8", flat: 0, procChance: 100 },
      visualTheme: "fire", tags: ["passive", "self-harm-fuel", "bonus-damage", "gambit"]
    },
    rankUpgrades: [
      { description: "Gain 3 FP on self-damage and +2d8 bonus fire damage." },
      { description: "Gain 4 FP on self-damage, +3d8 bonus fire damage, and +15ft movement speed." }
    ]
  },
  {
    id: "hr_t1_expanded_hand",
    name: "Fate Reserve",
    icon: "inv_misc_tarot_01",
    maxRanks: 2,
    position: { x: 4, y: 0 },
    requires: null,
    spell: {
      name: "Fate Reserve",
      description: "Your maximum Fortune Points increase by 4. Below 50% health, all your abilities cost 1 fewer FP.",
      flavorText: "A deeper pocket when the stakes turn dire.",
      source: "talent", class: "Gambit", treeId: "high_roller",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "fire", tags: ["passive", "fp-cap", "low-hp-bonus", "gambit"]
    },
    rankUpgrades: [
      { description: "Max FP +8; below 50% health, abilities cost 2 fewer FP and gain +2 Durability Steps to equipped durability." }
    ]
  },

  // ──────────────── TIER 2 (6 pts) ────────────────
  {
    id: "hr_t2_wild_gamble",
    name: "Wild Card Detonation",
    icon: "spell_fire_selfdestruct",
    maxRanks: 3,
    position: { x: 1, y: 1.5 },
    requires: "hr_t1_all_in_strike",
    spell: {
      name: "Wild Card Detonation",
      description: "Spend all current FP (minimum 3): detonate a massive blast of chaotic flame in a 25-foot radius. Deals 2d10 fire damage per FP spent to all enemies, and deals 2d6 self-damage to you.",
      flavorText: "Throw the whole deck into the fire and watch it explode.",
      source: "talent", class: "Gambit", treeId: "high_roller",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 25,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 8, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { fortunePoints: { baseAmount: 3 } },
      damageTypes: ["fire"],
      primaryDamage: { dice: "6d10", flat: 0, procChance: 100 },
      visualTheme: "fire", tags: ["aoe", "fp-dump", "high-damage", "gambit"]
    },
    rankUpgrades: [
      { description: "30-foot blast deals 2d12 fire damage per FP spent and self-damage is reduced by 50%.", primaryDamage: { dice: "8d10", flat: 0, procChance: 100 }, aoeSize: 30 },
      { description: "35-foot blast deals 3d10 fire damage per FP spent, self-damage grants full FP refund if 3+ enemies hit.", primaryDamage: { dice: "10d10", flat: 0, procChance: 100 }, aoeSize: 35 }
    ]
  },
  {
    id: "hr_t2_desperate_measures",
    name: "Desperate Measures",
    icon: "spell_fire_fire",
    maxRanks: 3,
    position: { x: 3, y: 1.5 },
    requires: "hr_t1_double_down",
    spell: {
      name: "Desperate Measures",
      description: "While below 50% health, your damage dealt is increased by +30% and all your attacks score critical hits on 18+.",
      flavorText: "The gambler plays best when cornered.",
      source: "talent", class: "Gambit", treeId: "high_roller",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "fire", tags: ["passive", "low-hp-power", "crit", "gambit"]
    },
    rankUpgrades: [
      { description: "Below 50% HP: damage +50% and crits on 17+." },
      { description: "Below 50% HP: damage +75%, crits on 16+, and you take 25% less damage from enemy attacks." }
    ]
  },

  // ──────────────── TIER 3 (6 pts) ────────────────
  {
    id: "hr_t3_catastrophic_wager",
    name: "Catastrophic Wager",
    icon: "ability_rogue_deadliness",
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: "hr_t2_wild_gamble",
    spell: {
      name: "Catastrophic Wager",
      description: "Spend 50% of your current HP: immediately gain maximum Fortune Points, and your next 2 attacks deal TRIPLE damage and have 100% lifesteal.",
      flavorText: "Bet your life on a single turn of the wheel.",
      source: "talent", class: "Gambit", treeId: "high_roller",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 20, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { healthPercent: { baseAmount: 50 } },
      buffs: ["catastrophic-wager"], visualTheme: "fire", tags: ["high-risk", "triple-damage", "lifesteal", "gambit"]
    },
    rankUpgrades: [
      { description: "Spend 40% HP: gain max FP, next 3 attacks deal triple damage with 100% lifesteal, cooldown drops to 16s.", cooldownValue: 16 },
      { description: "Spend 30% HP: gain max FP, next 4 attacks deal quadruple damage with 150% lifesteal, cooldown drops to 12s.", cooldownValue: 12 }
    ]
  },
  {
    id: "hr_t3_shockwave_gambler",
    name: "Explosive Risk",
    icon: "spell_fire_selfdestruct",
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: "hr_t2_desperate_measures",
    spell: {
      name: "Explosive Risk",
      description: "Whenever you take self-damage, all enemies within 20 feet take an equal amount of fire damage and are knocked back 10 feet.",
      flavorText: "Your wounds explode outward like shrapnel.",
      source: "talent", class: "Gambit", treeId: "high_roller",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["fire"],
      visualTheme: "fire", tags: ["passive", "retaliation", "aoe-burst", "gambit"]
    },
    rankUpgrades: [
      { description: "Enemies take 150% of your self-damage in a 25-foot radius." },
      { description: "Enemies take 200% of your self-damage in a 30-foot radius and are knocked prone." }
    ]
  },

  // ──────────────── TIER 4 (5 pts) ────────────────
  {
    id: "hr_t4_jackpot_roulette",
    name: "Jackpot Roulette",
    icon: "inv_misc_tarot_01",
    maxRanks: 3,
    position: { x: 1, y: 4.5 },
    requires: "hr_t3_catastrophic_wager",
    spell: {
      name: "Jackpot Roulette",
      description: "Spend 4 FP: spin the Wheel of Ruin on an enemy within 50 feet. Deals 8d10 fire/chaos damage. If you roll an 18-20, hits for 20d10 damage and restores full health.",
      flavorText: "Triple sevens on the execution block.",
      source: "talent", class: "Gambit", treeId: "high_roller",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "ranged", range: 50,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 20, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { fortunePoints: { baseAmount: 4 } },
      damageTypes: ["fire"],
      primaryDamage: { dice: "8d10", flat: 0, procChance: 100 },
      visualTheme: "fire", tags: ["single-nuke", "jackpot", "extreme-burst", "gambit"]
    },
    rankUpgrades: [
      { description: "Deals 11d10 damage; jackpot triggers on 17-20 for 25d10 damage and full heal.", primaryDamage: { dice: "11d10", flat: 0, procChance: 100 }, cooldownValue: 16 },
      { description: "Deals 14d10 damage; jackpot triggers on 16-20 for 30d10 damage, full heal, and resets all cooldowns.", primaryDamage: { dice: "14d10", flat: 0, procChance: 100 }, cooldownValue: 12 }
    ]
  },
  {
    id: "hr_t4_ adrenaline_surge",
    name: "Adrenaline Rush",
    icon: "spell_nature_bloodlust",
    maxRanks: 2,
    position: { x: 3.5, y: 4.5 },
    requires: "hr_t3_shockwave_gambler",
    spell: {
      name: "Adrenaline Rush",
      description: "Whenever you drop below 30% health, you gain 2 Action Points and 40 temporary health for 2 rounds.",
      flavorText: "The thrill of near-death accelerates the blood.",
      source: "talent", class: "Gambit", treeId: "high_roller",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "fire", tags: ["passive", "action-economy", "temp-hp", "gambit"]
    },
    rankUpgrades: [
      { description: "Gain 3 Action Points, 70 temporary health, and +30ft speed below 30% HP." }
    ]
  },

  // ──────────────── TIER 5 (5 pts) ────────────────
  {
    id: "hr_t5_cosmic_bankruptcy",
    name: "Cosmic Bankruptcy Eruption",
    icon: "spell_fire_selfdestruct",
    maxRanks: 2,
    position: { x: 1, y: 6 },
    requires: "hr_t4_jackpot_roulette",
    spell: {
      name: "Cosmic Bankruptcy Eruption",
      description: "Spend all remaining FP (must be at least 6): trigger an intentional bankruptcy nova. Deals 12d10 fire damage to ALL enemies within 40 feet, stuns all enemies for 2 rounds, and restores your HP to 100%.",
      flavorText: "Blow the bank, take the house down with it.",
      source: "talent", class: "Gambit", treeId: "high_roller",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 40,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 30, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { fortunePoints: { baseAmount: 6 } },
      damageTypes: ["fire"],
      primaryDamage: { dice: "12d10", flat: 0, procChance: 100 },
      debuffs: ["stun"], visualTheme: "fire", tags: ["mass-nuke", "mass-stun", "full-heal", "gambit"]
    },
    rankUpgrades: [
      { description: "Deals 16d10 fire damage in a 50-foot area, stuns for 2 rounds, restores full HP and mana.", primaryDamage: { dice: "16d10", flat: 0, procChance: 100 }, aoeSize: 50, cooldownValue: 24 }
    ]
  },
  {
    id: "hr_t5_reckless_fortune",
    name: "Reckless Fortune Siphon",
    icon: "inv_misc_coin_01",
    maxRanks: 3,
    position: { x: 3, y: 6 },
    requires: "hr_t4_ adrenaline_surge",
    spell: {
      name: "Reckless Fortune Siphon",
      description: "All fire and chaos damage you deal heals you for 30% of the damage dealt. Overheal becomes a permanent fire shield up to 50 temp HP.",
      flavorText: "The flames consume the enemy and stitch the gambler.",
      source: "talent", class: "Gambit", treeId: "high_roller",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "self", visualTheme: "fire", tags: ["passive", "lifesteal", "fire-shield", "gambit"]
    },
    rankUpgrades: [
      { description: "Heal for 50% of fire/chaos damage; shield caps at 80 temp HP." },
      { description: "Heal for 75% of damage; shield caps at 120 temp HP and damages attackers for 3d8 fire on hit." }
    ]
  },

  // ──────────────── TIER 6 (5 pts) ────────────────
  {
    id: "hr_t6_jackpot_supreme",
    name: "Jackpot Supreme",
    icon: "inv_misc_platnumdisks",
    maxRanks: 1,
    position: { x: 1, y: 7.5 },
    requires: "hr_t5_cosmic_bankruptcy",
    spell: {
      name: "Jackpot Supreme",
      description: "Spend 6 FP: enter the Gold Sovereign trance for 1 minute: all attacks deal quadruple damage, your self-damage is reduced to 0, and every critical strike generates 3 free FP.",
      flavorText: "The machine will never stop paying out.",
      source: "talent", class: "Gambit", treeId: "high_roller",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 90, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { fortunePoints: { baseAmount: 6 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      buffs: ["jackpot-supreme"], visualTheme: "fire", tags: ["god-mode", "quad-damage", "no-self-harm", "gambit"]
    },
    rankUpgrades: []
  },
  {
    id: "hr_t6_pyro_criticality",
    name: "Infernal Gambits",
    icon: "spell_fire_fire",
    maxRanks: 2,
    position: { x: 2.5, y: 7.5 },
    requires: "hr_t5_reckless_fortune",
    spell: {
      name: "Infernal Gambits",
      description: "All fire and chaos spells score critical hits on 17+ and critical hits burn the target for 5d8 fire damage over 2 rounds.",
      flavorText: "Burning the cards to light the furnace.",
      source: "talent", class: "Gambit", treeId: "high_roller",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["fire"],
      visualTheme: "fire", tags: ["passive", "crit", "burn-dot", "gambit"]
    },
    rankUpgrades: [
      { description: "Critical hits on 16+; burn deals 8d8 fire damage and shreds 50% of enemy durability." }
    ]
  },
  {
    id: "hr_t6_phoenix_gambler",
    name: "Phoenix Wager",
    icon: "spell_fire_soulburn",
    maxRanks: 2,
    position: { x: 4, y: 7.5 },
    requires: "hr_t5_reckless_fortune",
    spell: {
      name: "Phoenix Wager",
      description: "While below 25% health, you gain +6 Durability Steps to equipped durability, 40% all-damage resistance, and cannot be knocked unconscious.",
      flavorText: "Refusing to fall while the bet is still on the table.",
      source: "talent", class: "Gambit", treeId: "high_roller",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "fire", tags: ["passive", "low-hp-tank", "unyielding", "gambit"]
    },
    rankUpgrades: [
      { description: "Gain +8 Durability Steps to equipped durability, 60% resistance below 25% HP, and attacks deal double damage." }
    ]
  },

  // ──────────────── TIER 7 / CAPSTONE (15 pts) ────────────────
  {
    id: "hr_t7_avatar_of_the_high_roller",
    name: "Avatar of the Cataclysmic Gambler",
    icon: "ability_warrior_bloodfrenzy",
    maxRanks: 1,
    position: { x: 0.5, y: 9.5 },
    requires: "hr_t6_jackpot_supreme",
    spell: {
      name: "Avatar of the Cataclysmic Gambler",
      description: "ULTIMATE: Spend 8 FP: transform into the Avatar of the Burning Casino for 1 minute: continuous fire novas erupt from you every round dealing 8d10 fire damage to all enemies, your attacks crit on 15+, and all damage taken heals you instead of harming you.",
      flavorText: "The house burns down, and you dance in the ashes of the winnings.",
      source: "talent", class: "Gambit", treeId: "high_roller",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 180, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { fortunePoints: { baseAmount: 8 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      buffs: ["avatar-high-roller"], visualTheme: "fire", tags: ["ultimate", "capstone", "god-mode", "gambit"]
    },
    rankUpgrades: []
  },
  {
    id: "hr_t7_high_roller_doctrine",
    name: "High Roller Doctrine",
    icon: "spell_fire_selfdestruct",
    maxRanks: 5,
    position: { x: 1.5, y: 9.5 },
    requires: "hr_t6_jackpot_supreme",
    spell: {
      name: "High Roller Doctrine",
      description: "All fire, chaos, and high-risk damage you deal is increased by 10%.",
      flavorText: "Bigger stakes, bigger flames.",
      source: "talent", class: "Gambit", treeId: "high_roller",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["fire"],
      visualTheme: "fire", tags: ["passive", "capstone", "damage", "gambit"]
    },
    rankUpgrades: [
      { description: "All fire and high-risk damage increased by 20%." },
      { description: "All fire and high-risk damage increased by 35%." },
      { description: "All fire and high-risk damage increased by 50%." },
      { description: "All fire and high-risk damage increased by 70%, and All-In Strike costs 0 HP." }
    ]
  },
  {
    id: "hr_t7_infinite_risk_engine",
    name: "Endless Stake Battery",
    icon: "inv_misc_coin_01",
    maxRanks: 3,
    position: { x: 2.5, y: 9.5 },
    requires: "hr_t6_pyro_criticality",
    spell: {
      name: "Endless Stake Battery",
      description: "Your maximum FP increases by 10, and whenever you deal fire damage, you generate 2 FP.",
      flavorText: "The stakes never stop multiplying.",
      source: "talent", class: "Gambit", treeId: "high_roller",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "fire", tags: ["passive", "capstone", "fp-engine", "gambit"]
    },
    rankUpgrades: [
      { description: "Max FP +15; generate 3 FP per damage hit and movement speed +15ft." },
      { description: "Max FP +20; generate 4 FP per hit and all fire abilities cost 1 fewer FP." }
    ]
  },
  {
    id: "hr_t7_double_jackpot",
    name: "Cascading Jackpots",
    icon: "inv_misc_tarot_01",
    maxRanks: 3,
    position: { x: 3.5, y: 9.5 },
    requires: "hr_t6_pyro_criticality",
    spell: {
      name: "Cascading Jackpots",
      description: "When Jackpot Roulette triggers a jackpot, it immediately recasts itself automatically on the next nearest enemy for free.",
      flavorText: "One win triggers the whole bank of machines.",
      source: "talent", class: "Gambit", treeId: "high_roller",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", visualTheme: "fire", tags: ["passive", "capstone", "cascade-nuke", "gambit"]
    },
    rankUpgrades: [
      { description: "Jackpot recasts up to 2 times across nearby foes." },
      { description: "Jackpot recasts up to 4 times, wiping entire packs of enemies." }
    ]
  },
  {
    id: "hr_t7_jackpot_rebirth",
    name: "The Final Gamble Rebirth",
    icon: "spell_fire_soulburn",
    maxRanks: 3,
    position: { x: 4.5, y: 9.5 },
    requires: "hr_t6_phoenix_gambler",
    spell: {
      name: "The Final Gamble Rebirth",
      description: "Lethal damage triggers an immediate all-or-nothing roll: prevents death, restores 50% health, 50 temporary health, sets FP to max, and unleashes Cosmic Bankruptcy Eruption for free (cooldown: 120s).",
      flavorText: "You bet your death and won.",
      source: "talent", class: "Gambit", treeId: "high_roller",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "fire", tags: ["passive", "capstone", "cheat-death", "gambit"]
    },
    rankUpgrades: [
      { description: "Survive lethal damage, restore 75% health, 75 temp HP, full FP (cooldown: 90s)." },
      { description: "Survive lethal damage, restore 100% health, and immediately activate Avatar of the Cataclysmic Gambler for free (cooldown: 60s)." }
    ]
  }
];

// ============================================
// 3. GAMBIT — KARMIC WEAVER
// ============================================
export const GAMBIT_KARMIC_WEAVER = [
  // ──────────────── TIER 1 (8 pts) ────────────────
  {
    id: "kw_t1_fate_binding",
    name: "Fate Binding Tether",
    icon: "spell_arcane_prismaticcloak",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Fate Binding Tether",
      description: "Tether two enemies (or an enemy and an ally) within 45 feet for 1 minute: tethered targets share 50% of all damage taken, and each damage event generates 1 Karmic Debt (KD) stack.",
      flavorText: "Two lives woven onto a single loom.",
      source: "talent", class: "Gambit", treeId: "karmic_weaver",
      spellType: "ACTIVE", category: "control",
      targetingMode: "multi", rangeType: "ranged", range: 45,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 6, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 4 } },
      buffs: ["fate-tether"], visualTheme: "shadow", tags: ["tether", "damage-share", "kd-builder", "gambit"]
    },
    rankUpgrades: [
      { description: "Tether up to 3 targets: share 75% damage, generates 2 KD stacks per hit." },
      { description: "Tether up to 4 targets: share 100% full damage, generates 3 KD stacks per hit, and targets cannot move further than 30ft apart." }
    ]
  },
  {
    id: "kw_t1_splintered_loom",
    name: "Splintered Loom",
    icon: "spell_shadow_curseofsargeras",
    maxRanks: 3,
    position: { x: 2.5, y: 0 },
    requires: null,
    spell: {
      name: "Splintered Loom",
      description: "Your attacks against tethered enemies deal +1d6 bonus necrotic damage per 2 Karmic Debt stacks you possess.",
      flavorText: "The weight of unpaid karmic balance crushes the soul.",
      source: "talent", class: "Gambit", treeId: "karmic_weaver",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["necrotic"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["passive", "debt-scaling", "damage", "gambit"]
    },
    rankUpgrades: [
      { description: "Deal +2d6 bonus necrotic damage per 2 KD stacks." },
      { description: "Deal +3d6 bonus necrotic damage per 2 KD stacks and ignore 30% resistance." }
    ]
  },
  {
    id: "kw_t1_debt_harvester",
    name: "Debt Siphon",
    icon: "inv_misc_scalesofjustice",
    maxRanks: 2,
    position: { x: 4, y: 0 },
    requires: null,
    spell: {
      name: "Debt Siphon",
      description: "Whenever a tethered creature takes damage, you and all allies heal for 25% of the shared damage dealt.",
      flavorText: "Collecting the dividend on suffering.",
      source: "talent", class: "Gambit", treeId: "karmic_weaver",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "lifesteal", "tether-heal", "gambit"]
    },
    rankUpgrades: [
      { description: "Heal for 50% of shared damage dealt, and grants 20 temporary health on tethered kill." }
    ]
  },

  // ──────────────── TIER 2 (6 pts) ────────────────
  {
    id: "kw_t2_karmic_tax",
    name: "Karmic Tax Collection",
    icon: "spell_shadow_lifedrain02",
    maxRanks: 3,
    position: { x: 1, y: 1.5 },
    requires: "kw_t1_fate_binding",
    spell: {
      name: "Karmic Tax Collection",
      description: "Spend 3 KD stacks: siphon life from all tethered enemies. Deals 4d8 necrotic damage to each tethered foe, heals you for 100% of the damage, and slows them by 20ft for 2 rounds.",
      flavorText: "Payment is demanded immediately, with interest.",
      source: "talent", class: "Gambit", treeId: "karmic_weaver",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "ranged", range: 50, aoeShape: "circle", aoeSize: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 8, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { karmicDebt: { baseAmount: 3 } },
      damageTypes: ["necrotic"],
      primaryDamage: { dice: "4d8", flat: 0, procChance: 100 },
      debuffs: ["slow"], visualTheme: "shadow", tags: ["aoe", "lifesteal", "tether-siphon", "gambit"]
    },
    rankUpgrades: [
      { description: "Deals 6d8 necrotic damage, heals for 150%, and roots tethered foes for 1 round.", primaryDamage: { dice: "6d8", flat: 0, procChance: 100 } },
      { description: "Deals 8d8 necrotic damage, heals for 200%, stuns for 1 round, and generates 3 Fortune Points.", primaryDamage: { dice: "8d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "kw_t2_strain_redirection",
    name: "Strain Redirection",
    icon: "spell_holy_borrowedtime",
    maxRanks: 3,
    position: { x: 3, y: 1.5 },
    requires: "kw_t1_splintered_loom",
    spell: {
      name: "Strain Redirection",
      description: "Whenever you take damage, 40% of the damage is transferred directly onto tethered enemies instead.",
      flavorText: "Let the debtors pay for the creditor's wounds.",
      source: "talent", class: "Gambit", treeId: "karmic_weaver",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "damage-transfer", "defense", "gambit"]
    },
    rankUpgrades: [
      { description: "Transfer 60% of damage taken onto tethered enemies." },
      { description: "Transfer 80% of damage taken onto tethered enemies, and attackers are tethered automatically." }
    ]
  },

  // ──────────────── TIER 3 (6 pts) ────────────────
  {
    id: "kw_t3_wyrd_collapse",
    name: "Wyrd Collapse",
    icon: "spell_shadow_shadowfury",
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: "kw_t2_karmic_tax",
    spell: {
      name: "Wyrd Collapse",
      description: "Spend 5 KD stacks: cause the karmic threads on all tethered targets to violently snap. Deals 6d10 necrotic/force damage to each target and incapacitates them for 1 round.",
      flavorText: "The loom shatters under the impossible weight of accumulated debt.",
      source: "talent", class: "Gambit", treeId: "karmic_weaver",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 50,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 16, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { karmicDebt: { baseAmount: 5 } },
      damageTypes: ["necrotic", "force"],
      primaryDamage: { dice: "6d10", flat: 0, procChance: 100 },
      debuffs: ["incapacitated"], visualTheme: "shadow", tags: ["mass-nuke", "mass-cc", "snap", "gambit"]
    },
    rankUpgrades: [
      { description: "Deals 8d10 damage, incapacitates for 2 rounds, and silences targets for 2 rounds.", primaryDamage: { dice: "8d10", flat: 0, procChance: 100 } },
      { description: "Deals 10d10 damage, incapacitates for 2 rounds, and re-tethers all survivors automatically for free.", primaryDamage: { dice: "10d10", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "kw_t3_tapestry_anchor",
    name: "Wyrd Anchor",
    icon: "spell_arcane_arcane04",
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: "kw_t2_strain_redirection",
    spell: {
      name: "Wyrd Anchor",
      description: "Tethered allies are completely immune to crowd control, gain +3 Durability Steps to equipped durability, and receive +30% increased healing.",
      flavorText: "Anchored into the safe weave of destiny.",
      source: "talent", class: "Gambit", treeId: "karmic_weaver",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "ally-protection", "cc-immune", "gambit"]
    },
    rankUpgrades: [
      { description: "Tethered allies gain +5 Durability Steps to equipped durability, +50% healing, and take 20% less damage." },
      { description: "Tethered allies gain +7 Durability Steps to equipped durability, +75% healing, 35% less damage, and cannot die while tethered to you." }
    ]
  },

  // ──────────────── TIER 4 (5 pts) ────────────────
  {
    id: "kw_t4_soul_ledger_execute",
    name: "Foreclosure Execution",
    icon: "ability_rogue_shadowdance",
    maxRanks: 3,
    position: { x: 1, y: 4.5 },
    requires: "kw_t3_wyrd_collapse",
    spell: {
      name: "Foreclosure Execution",
      description: "Spend 6 KD stacks: claim the soul of a tethered enemy within 45 feet. Deals 8d10 necrotic damage (doubled if target is below 50% HP). If the target dies, all other tethered enemies take 6d10 damage.",
      flavorText: "Foreclosing on mortal existence.",
      source: "talent", class: "Gambit", treeId: "karmic_weaver",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "ranged", range: 45,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 20, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { karmicDebt: { baseAmount: 6 } },
      damageTypes: ["necrotic"],
      primaryDamage: { dice: "8d10", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["execute", "chain-death", "nuke", "gambit"]
    },
    rankUpgrades: [
      { description: "Deals 11d10 damage (tripled below 50% HP); death explosion deals 8d10 necrotic to all tethered foes.", primaryDamage: { dice: "11d10", flat: 0, procChance: 100 }, cooldownValue: 16 },
      { description: "Deals 14d10 damage (quadrupled below 50% HP); death resets this spell's cooldown immediately.", primaryDamage: { dice: "14d10", flat: 0, procChance: 100 }, cooldownValue: 12 }
    ]
  },
  {
    id: "kw_t4_debt_snowball",
    name: "Compounding Karma",
    icon: "inv_misc_scalesofjustice",
    maxRanks: 2,
    position: { x: 3.5, y: 4.5 },
    requires: "kw_t3_tapestry_anchor",
    spell: {
      name: "Compounding Karma",
      description: "Your maximum Karmic Debt increases by 6. At 5+ KD stacks, you generate 2 KD stacks per round automatically.",
      flavorText: "Interest accrues every second the debt remains unpaid.",
      source: "talent", class: "Gambit", treeId: "karmic_weaver",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "kd-engine", "gambit"]
    },
    rankUpgrades: [
      { description: "Max KD +10; generate 4 KD per round automatically and your spells deal +20% damage." }
    ]
  },

  // ──────────────── TIER 5 (5 pts) ────────────────
  {
    id: "kw_t5_grand_tapestry",
    name: "The Grand Karmic Web",
    icon: "spell_shadow_unholyfrenzy",
    maxRanks: 2,
    position: { x: 1, y: 6 },
    requires: "kw_t4_soul_ledger_execute",
    spell: {
      name: "The Grand Karmic Web",
      description: "Spend 6 KD stacks: cast a global web connecting ALL enemies on the battlefield into a single shared karmic matrix for 1 minute. 100% of all damage dealt to any enemy is dealt to ALL enemies.",
      flavorText: "One throat cut bleeds every soldier in the army.",
      source: "talent", class: "Gambit", treeId: "karmic_weaver",
      spellType: "ACTIVE", category: "control",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 30, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { karmicDebt: { baseAmount: 6 } },
      buffs: ["global-web"], visualTheme: "shadow", tags: ["mass-tether", "all-enemies", "matrix", "gambit"]
    },
    rankUpgrades: [
      { description: "Matrix lasts 2 minutes: all enemies take +25% bonus damage and cannot regain health while connected.", cooldownValue: 24 }
    ]
  },
  {
    id: "kw_t5_karmic_drain",
    name: "Predatory Creditor",
    icon: "spell_shadow_lifedrain01",
    maxRanks: 3,
    position: { x: 3, y: 6 },
    requires: "kw_t4_debt_snowball",
    spell: {
      name: "Predatory Creditor",
      description: "Tethered enemies deal 25% less damage, and you steal 2 Action Points and 10 mana from tethered foes every round.",
      flavorText: "Foreclosing on their action economy.",
      source: "talent", class: "Gambit", treeId: "karmic_weaver",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "action-theft", "weaken", "gambit"]
    },
    rankUpgrades: [
      { description: "Tethered enemies deal 40% less damage; steal 3 AP and 20 mana per round." },
      { description: "Tethered enemies deal 50% less damage; steal 4 AP, 30 mana, and reduce their movement speed to 0." }
    ]
  },

  // ──────────────── TIER 6 (5 pts) ────────────────
  {
    id: "kw_t6_fate_rewoven",
    name: "Fate Rewoven",
    icon: "inv_misc_platnumdisks",
    maxRanks: 1,
    position: { x: 1, y: 7.5 },
    requires: "kw_t5_grand_tapestry",
    spell: {
      name: "Fate Rewoven",
      description: "Spend 8 KD stacks: instantly execute all non-boss tethered enemies below 30% health, deal 8d10 psychic damage to surviving bosses, reset your KD to 0, and restore full health and FP to all party members.",
      flavorText: "Once per encounter, the ledger is wiped clean with catastrophic finality.",
      source: "talent", class: "Gambit", treeId: "karmic_weaver",
      spellType: "ACTIVE", category: "healing",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 90, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { karmicDebt: { baseAmount: 8 } },
      healing: { dice: "10d10", flat: 0 },
      damageTypes: ["psychic"],
      primaryDamage: { dice: "8d10", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["mass-execute", "mass-heal", "climax", "gambit"]
    },
    rankUpgrades: []
  },
  {
    id: "kw_t6_necrotic_criticality",
    name: "Karmic Severance",
    icon: "spell_shadow_curseofsargeras",
    maxRanks: 2,
    position: { x: 2.5, y: 7.5 },
    requires: "kw_t5_karmic_drain",
    spell: {
      name: "Karmic Severance",
      description: "All necrotic and tether damage scores critical hits on 18+ and critical hits spread tether to 1 adjacent enemy for free.",
      flavorText: "Every wound creates a new thread in the web.",
      source: "talent", class: "Gambit", treeId: "karmic_weaver",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["necrotic"],
      visualTheme: "shadow", tags: ["passive", "crit", "auto-spread", "gambit"]
    },
    rankUpgrades: [
      { description: "Critical hits on 16+; crits deal triple damage and spread tether to 2 adjacent foes." }
    ]
  },
  {
    id: "kw_t6_invulnerable_loom",
    name: "Woven Immortality",
    icon: "spell_holy_powerwordbarrier",
    maxRanks: 2,
    position: { x: 4, y: 7.5 },
    requires: "kw_t5_karmic_drain",
    spell: {
      name: "Woven Immortality",
      description: "While you have at least 2 tethered enemies, you cannot take more than 20 damage from any single attack.",
      flavorText: "Dispersing lethal force across a network of victims.",
      source: "talent", class: "Gambit", treeId: "karmic_weaver",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "damage-clamp", "invulnerable", "gambit"]
    },
    rankUpgrades: [
      { description: "Single attack damage capped at 10 damage, and you reflect 50% of all absorbed damage to tethered foes." }
    ]
  },

  // ──────────────── TIER 7 / CAPSTONE (15 pts) ────────────────
  {
    id: "kw_t7_avatar_of_the_weaver",
    name: "Avatar of the Wyrd Sovereign",
    icon: "spell_shadow_shadowwordpain",
    maxRanks: 1,
    position: { x: 0.5, y: 9.5 },
    requires: "kw_t6_fate_rewoven",
    spell: {
      name: "Avatar of the Wyrd Sovereign",
      description: "ULTIMATE: Spend 10 KD stacks: ascend into the Sovereign Weaver for 1 minute: every enemy in combat is permanently tethered to you and each other, takes 10d10 necrotic damage per round, and 100% of all damage allies take is dealt directly to enemies instead.",
      flavorText: "The grand loom spins its final thread. None shall escape the pattern.",
      source: "talent", class: "Gambit", treeId: "karmic_weaver",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 180, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { karmicDebt: { baseAmount: 10 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      damageTypes: ["necrotic"],
      primaryDamage: { dice: "10d10", flat: 0, procChance: 100 },
      buffs: ["avatar-wyrd"], visualTheme: "shadow", tags: ["ultimate", "capstone", "god-mode", "gambit"]
    },
    rankUpgrades: []
  },
  {
    id: "kw_t7_karmic_doctrine",
    name: "Karmic Weaver Doctrine",
    icon: "spell_shadow_curseofsargeras",
    maxRanks: 5,
    position: { x: 1.5, y: 9.5 },
    requires: "kw_t6_fate_rewoven",
    spell: {
      name: "Karmic Weaver Doctrine",
      description: "All necrotic, tether, and karmic damage you deal is increased by 10%.",
      flavorText: "The debt collector always takes his cut.",
      source: "talent", class: "Gambit", treeId: "karmic_weaver",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["necrotic"],
      visualTheme: "shadow", tags: ["passive", "capstone", "damage", "gambit"]
    },
    rankUpgrades: [
      { description: "All necrotic and tether damage increased by 20%." },
      { description: "All necrotic and tether damage increased by 35%." },
      { description: "All necrotic and tether damage increased by 50%." },
      { description: "All necrotic and tether damage increased by 70%, and Fate Binding Tether costs 0 mana." }
    ]
  },
  {
    id: "kw_t7_infinite_debt_engine",
    name: "Endless Karmic Reservoir",
    icon: "inv_misc_scalesofjustice",
    maxRanks: 3,
    position: { x: 2.5, y: 9.5 },
    requires: "kw_t6_necrotic_criticality",
    spell: {
      name: "Endless Karmic Reservoir",
      description: "Your maximum Karmic Debt increases by 10. You generate 3 KD stacks per turn in combat.",
      flavorText: "A bottomless ledger of cosmic retribution.",
      source: "talent", class: "Gambit", treeId: "karmic_weaver",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "capstone", "kd-engine", "gambit"]
    },
    rankUpgrades: [
      { description: "Max KD +15; generate 5 KD per turn and movement speed +15ft." },
      { description: "Max KD +20; generate 7 KD per turn and abilities cost 2 fewer KD." }
    ]
  },
  {
    id: "kw_t7_soul_debt_shatter",
    name: "Debt Shatterstorm",
    icon: "spell_shadow_shadowfury",
    maxRanks: 3,
    position: { x: 3.5, y: 9.5 },
    requires: "kw_t6_necrotic_criticality",
    spell: {
      name: "Debt Shatterstorm",
      description: "When a tethered enemy dies, release a soul shockwave dealing 6d10 necrotic damage to all enemies within 30 feet.",
      flavorText: "A defaulting debtor takes the neighborhood down with him.",
      source: "talent", class: "Gambit", treeId: "karmic_weaver",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["necrotic"],
      primaryDamage: { dice: "6d10", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["passive", "capstone", "death-nova", "gambit"]
    },
    rankUpgrades: [
      { description: "Nova deals 9d10 necrotic damage and stuns survivors for 1 round." },
      { description: "Nova deals 12d10 necrotic damage, stuns for 2 rounds, and refunds full KD." }
    ]
  },
  {
    id: "kw_t7_tether_rebirth",
    name: "Karmic Transference Rebirth",
    icon: "spell_holy_resurrection",
    maxRanks: 3,
    position: { x: 4.5, y: 9.5 },
    requires: "kw_t6_invulnerable_loom",
    spell: {
      name: "Karmic Transference Rebirth",
      description: "While at least one enemy is tethered, lethal damage transfers your death to the tethered enemy instead: instakills the tethered enemy, restores your HP to 50%, grants 50 temp HP, and grants max KD (cooldown: 120s).",
      flavorText: "Your death was transferred to their bill.",
      source: "talent", class: "Gambit", treeId: "karmic_weaver",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "capstone", "cheat-death", "gambit"]
    },
    rankUpgrades: [
      { description: "Survive lethal damage, restore 75% health, 75 temp HP, kill up to 2 tethered enemies (cooldown: 90s)." },
      { description: "Survive lethal damage, restore 100% health, instakill all tethered non-bosses, and activate Avatar of the Wyrd Sovereign for free (cooldown: 60s)." }
    ]
  }
];
