// ============================================
// ARCANONEER — PRISM MAGE (v3: spec identity redesign)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50.
//
// SPEC IDENTITY: The elemental sniper. You commit to ONE element each combat,
// hunt for matching spheres, lock in your chosen element with Crystal Focus,
// and detonate focused payoffs that a chaos-spec or architect-spec never gets.
// Where Entropy Weaver embraces randomness and Architect builds structures,
// you eliminate variables — the fewer elements in play, the more damage each one does.
//
// SIGNATURE ACTIVES:
//   - Crystal Focus (t2):        Lock element → bonus damage this turn
//   - Resonance Chord (t3):      AoE pulse on 3+ matching spheres banked
//   - Prismatic Burst (t3):      Element cone from banked same-element spheres
//   - Refraction Strike (t4):    Targeted pierce through all enemies in a line
//   - Perfect Clarity (t5):      Once-per-combat: choose your entire sphere roll
//   - Prismatic Cataclysm (t7):  ULTIMATE — spend 6 matching spheres for catastrophic burst
// ============================================

export const ARCANONEER_PRISM_MAGE = [
  // ──────────────── TIER 1 (8 pts) ────────────────
  {
    id: "pm_t1_sphere_purity",
    name: "Sphere Purity",
    icon: "spell_fire_fireball02",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Sphere Purity",
      description: "Pure element combinations (two spheres of the same element) deal 1d6 additional damage of that element. When you roll 3+ spheres of one element in a single turn, gain 1 temporary mana.",
      flavorText: "A clause written twice is a clause that holds.",
      source: "talent", class: "Arcanoneer", treeId: "prism_mage",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["ember", "rime", "storm", "arcane"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "arcane", tags: ["passive", "purity", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "Pure element combinations deal 2d6 additional damage. Rolling 3+ of one element grants 2 temporary mana.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } },
      { description: "Pure element combinations deal 3d6 additional damage. Rolling 3+ of one element grants 3 temporary mana and briefly reduces that element's cooldowns by 2 seconds.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "pm_t1_elemental_commitment",
    name: "Elemental Commitment",
    icon: "spell_arcane_arcaneresilience",
    maxRanks: 3,
    position: { x: 2.5, y: 0 },
    requires: null,
    spell: {
      name: "Elemental Commitment",
      description: "At the start of combat, declare a Focused Element. Your Focused Element deals +10 points damage and you reroll any sphere of that element that shows lower than a 3 (reroll once, keep result).",
      flavorText: "The Canopy-Ledger permits amendments. With teeth.",
      source: "talent", class: "Arcanoneer", treeId: "prism_mage",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["ember", "rime", "storm", "arcane"],
      visualTheme: "arcane", tags: ["passive", "commitment", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "Focused Element deals +20 points damage. You reroll any rolled sphere of that element that shows lower than a 5 (once, keep result)." },
      { description: "Focused Element deals +30 points damage. You may choose the exact value (not just reroll) of one Focused Element sphere you roll each turn." }
    ]
  },
  {
    id: "pm_t1_reroll_mastery",
    name: "Reroll Mastery",
    icon: "spell_arcane_arcanepotency",
    maxRanks: 2,
    position: { x: 4, y: 0 },
    requires: null,
    spell: {
      name: "Reroll Mastery",
      description: "You may reroll up to 2 spheres per turn. The first reroll each turn costs 1 mana; additional rerolls cost 2 mana each.",
      flavorText: "The audit found an appeals process.",
      source: "talent", class: "Arcanoneer", treeId: "prism_mage",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "reroll", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "Reroll up to 3 spheres per turn. The first two rerolls each turn are free; additional rerolls cost 1 mana." }
    ]
  },

  // ──────────────── TIER 2 (6 pts) ────────────────
  {
    id: "pm_t2_crystal_focus",
    name: "Crystal Focus",
    icon: "inv_misc_gem_diamond_01",
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: "pm_t1_sphere_purity",
    spell: {
      name: "Crystal Focus",
      description: "Declare your Focused Element and spend 2 mana: for this turn, spells using your Focused Element deal 2d6 additional damage and score crits on a 17+. Cannot be used if you have no spheres of the Focused Element banked.",
      flavorText: "Exclusion is also a specification.",
      source: "talent", class: "Arcanoneer", treeId: "prism_mage",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 8, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { mana: { baseAmount: 2 } },
      damageTypes: ["ember", "rime", "storm", "arcane"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      buffs: ["crystal-focus"], visualTheme: "arcane", tags: ["empower", "focus", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "Declare Focused Element and spend 2 mana: this turn, Focused Element spells deal 3d6 additional damage and crit on 16+. Cooldown drops to 6 seconds.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 }, cooldownValue: 6 },
      { description: "Declare Focused Element for free: this turn, Focused Element spells deal 4d6 additional damage, crit on 15+, and pierce resistance by 15 points.", primaryDamage: { dice: "4d6", flat: 0, procChance: 100 }, resourceCosts: { mana: { baseAmount: 0 } } }
    ]
  },
  {
    id: "pm_t2_sphere_hunting",
    name: "Sphere Hunting",
    icon: "spell_arcane_portalshattrath",
    maxRanks: 3,
    position: { x: 3.5, y: 1 },
    requires: "pm_t1_reroll_mastery",
    spell: {
      name: "Sphere Hunting",
      description: "When you reroll a sphere, you may choose it to be your Focused Element instead of rolling randomly (once per turn).",
      flavorText: "The hunt ends in acquisition.",
      source: "talent", class: "Arcanoneer", treeId: "prism_mage",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "reroll", "control", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "When you reroll a sphere, you may choose it to be your Focused Element — up to twice per turn." },
      { description: "When you reroll a sphere, you always choose its element unconditionally (the reroll is now a selection)." }
    ]
  },

  // ──────────────── TIER 3 (6 pts) ────────────────
  {
    id: "pm_t3_resonance_chord",
    name: "Resonance Chord",
    icon: "spell_arcane_arcanetorrent",
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: "pm_t2_crystal_focus",
    spell: {
      name: "Resonance Chord",
      description: "When you have 3 or more banked spheres of the same element, spend 1 of them: deal 2d8 damage of that element to all enemies within 20 feet and impose -2 to their saves against that element for 1 round.",
      flavorText: "The pipes hum in agreement. The agreement detonates.",
      source: "talent", class: "Arcanoneer", treeId: "prism_mage",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 20,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 10, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { spheres: { baseAmount: 1 } },
      damageTypes: ["ember", "rime", "storm", "arcane"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      debuffs: ["elemental-vulnerability"],
      visualTheme: "arcane", tags: ["aoe", "resonance", "debuff", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "Spend 1 matching sphere: 3d8 AoE damage within 25 feet. Victims save at -3 against that element for 1 round.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 }, aoeSize: 25 },
      { description: "Spend 1 matching sphere: 4d8 AoE damage within 30 feet. Victims save at -4 against that element for 2 rounds, and the element's next Crystal Focus is free.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 }, aoeSize: 30 }
    ]
  },
  {
    id: "pm_t3_prismatic_burst",
    name: "Prismatic Burst",
    icon: "spell_arcane_starfire",
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: "pm_t2_sphere_hunting",
    spell: {
      name: "Prismatic Burst",
      description: "Consume 2 spheres of the same element: release a 30-foot cone dealing 3d8 damage of that element per sphere consumed. If both spheres are your Focused Element, victims are slowed (half move) for 1 round.",
      flavorText: "One element. One very wide signature.",
      source: "talent", class: "Arcanoneer", treeId: "prism_mage",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 30, aoeShape: "cone", aoeSize: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 8, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 4 }, spheres: { baseAmount: 2 } },
      damageTypes: ["ember", "rime", "storm", "arcane"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      debuffs: ["slowed"],
      visualTheme: "arcane", tags: ["cone", "purity", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "Consume 2 same-element spheres: 40-foot cone deals 4d8 per sphere. Focused Element burst also staggers (enemies lose 1 action next turn).", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 }, aoeSize: 40 },
      { description: "Consume 2–3 same-element spheres: 40-foot cone deals 5d8 per sphere, crits on 17+. Focused Element burst staggers and leaves a 10-foot elemental hazard zone for 1 round.", primaryDamage: { dice: "5d8", flat: 0, procChance: 100 } }
    ]
  },

  // ──────────────── TIER 4 (5 pts) ────────────────
  {
    id: "pm_t4_elemental_dominion",
    name: "Elemental Dominion",
    icon: "spell_fire_moltenblood",
    maxRanks: 3,
    position: { x: 0.5, y: 3 },
    requires: "pm_t3_resonance_chord",
    spell: {
      name: "Elemental Dominion",
      description: "You gain resistance to your Focused Element. When you take damage of your Focused Element, you instead absorb it: gain 1 temporary mana per 4 damage absorbed.",
      flavorText: "Sign enough contracts in one ink and the ink signs back.",
      source: "talent", class: "Arcanoneer", treeId: "prism_mage",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["ember", "rime", "storm", "arcane"],
      visualTheme: "arcane", tags: ["passive", "resistance", "absorption", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "When you take damage of your Focused Element, you absorb it: gain 1 temporary mana per 2 damage absorbed, and gain +1 to hit with that element for 1 round." },
      { description: "Immunity to your Focused Element. Focused Element damage you absorb grants 1 temporary mana per 2 damage, and half the absorbed damage is re-dealt to the nearest enemy." }
    ]
  },
  {
    id: "pm_t4_refraction_strike",
    name: "Refraction Strike",
    icon: "spell_arcane_blink",
    maxRanks: 3,
    position: { x: 3.5, y: 3 },
    requires: "pm_t3_prismatic_burst",
    spell: {
      name: "Refraction Strike",
      description: "Spend 1 Focused Element sphere: launch a piercing bolt of that element. It travels in a 60-foot line, passing through all creatures, dealing 3d10 damage to each. The bolt refocuses at each target — it does not lose power.",
      flavorText: "The clause pierces. Interference is breach of contract.",
      source: "talent", class: "Arcanoneer", treeId: "prism_mage",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "ranged", range: 60, aoeShape: "line", aoeSize: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 15, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 5 }, spheres: { baseAmount: 1 } },
      damageTypes: ["ember", "rime", "storm", "arcane"],
      primaryDamage: { dice: "3d10", flat: 0, procChance: 100 },
      visualTheme: "arcane", tags: ["pierce", "line", "single-target-chain", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "80-foot piercing bolt deals 4d10 to each target. After the bolt, each target it hit takes 1d6 additional Focused Element damage at the start of their next turn.", primaryDamage: { dice: "4d10", flat: 0, procChance: 100 } },
      { description: "80-foot piercing bolt deals 5d10 to each target and grants you 1 Focused Element sphere per target hit (max 3).", primaryDamage: { dice: "5d10", flat: 0, procChance: 100 } }
    ]
  },

  // ──────────────── TIER 5 (5 pts) ────────────────
  {
    id: "pm_t5_perfect_clarity",
    name: "Perfect Clarity",
    icon: "spell_arcane_mindmastery",
    maxRanks: 3,
    position: { x: 1, y: 4 },
    requires: "pm_t4_elemental_dominion",
    spell: {
      name: "Perfect Clarity",
      description: "Once per combat: instead of rolling spheres this turn, choose up to 4 spheres of any element composition (within your bank limit). The chosen spheres deal +1d6 damage when spent.",
      flavorText: "For one moment, the dice file a petition and you deny it.",
      source: "talent", class: "Arcanoneer", treeId: "prism_mage",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 90, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { mana: { baseAmount: 0 } },
      visualTheme: "arcane", tags: ["reroll", "control", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "Twice per combat: choose up to 4 spheres freely. Chosen spheres deal +2d6 damage when spent and their Crystal Focus is automatically active this turn." },
      { description: "Twice per combat: choose up to 5 spheres freely. Chosen spheres deal +3d6 damage when spent, activate Crystal Focus, and grant 2 temporary mana." }
    ]
  },
  {
    id: "pm_t5_crystal_armor",
    name: "Crystal Armor",
    icon: "inv_misc_gem_crystal_01",
    maxRanks: 3,
    position: { x: 3, y: 4 },
    requires: "pm_t4_refraction_strike",
    spell: {
      name: "Crystal Armor",
      description: "While you hold 3 or more banked spheres of the same element, gain +2 Durability Steps to equipped durability and resistance to your Focused Element. Losing the 3-sphere cluster removes this durability.",
      flavorText: "The bank, worn as a coat. Filed under protection.",
      source: "talent", class: "Arcanoneer", treeId: "prism_mage",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["ember", "rime", "storm", "arcane"],
      visualTheme: "arcane", tags: ["passive", "defense", "bank", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "While holding 2+ banked spheres of the same element, gain +3 Durability Steps to equipped durability and resistance to your Focused Element." },
      { description: "While holding 2+ banked spheres of the same element, gain +4 Durability Steps to equipped durability, resistance to your Focused Element, and +2 to all saves." }
    ]
  },

  // ──────────────── TIER 6 (5 pts) ────────────────
  {
    id: "pm_t6_sphere_perfection",
    name: "Sphere Perfection",
    icon: "spell_arcane_arcanetorrent",
    maxRanks: 1,
    position: { x: 1, y: 5 },
    requires: "pm_t5_perfect_clarity",
    spell: {
      name: "Sphere Perfection",
      description: "Pure element combinations roll their damage dice at maximum. Prismatic Burst and Resonance Chord deal maximum dice when using your Focused Element.",
      flavorText: "The dice were always going to agree. Now it is binding.",
      source: "talent", class: "Arcanoneer", treeId: "prism_mage",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["ember", "rime", "storm", "arcane"],
      visualTheme: "arcane", tags: ["passive", "maximize", "arcanoneer"]
    },
    rankUpgrades: []
  },
  {
    id: "pm_t6_prism_battery",
    name: "Prism Battery",
    icon: "inv_misc_gem_01",
    maxRanks: 2,
    position: { x: 2.5, y: 5 },
    requires: "pm_t5_crystal_armor",
    spell: {
      name: "Prism Battery",
      description: "Your sphere bank maximum increases by 2, and at the start of combat you begin with 2 spheres of your Focused Element already banked.",
      flavorText: "Pig iron, chambered and willing.",
      source: "talent", class: "Arcanoneer", treeId: "prism_mage",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "bank", "opener", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "Sphere bank maximum +4; begin combat with 4 Focused Element spheres banked. Your Focused Element's first Crystal Focus this combat is free." }
    ]
  },
  {
    id: "pm_t6_resonant_feedback",
    name: "Resonant Feedback",
    icon: "spell_arcane_arcane_resistance",
    maxRanks: 3,
    position: { x: 4, y: 5 },
    requires: "pm_t5_perfect_clarity",
    spell: {
      name: "Resonant Feedback",
      description: "After casting Resonance Chord or Prismatic Burst with your Focused Element, your next Crystal Focus this turn costs 0 mana.",
      flavorText: "The pipes hum louder. The meter loves it.",
      source: "talent", class: "Arcanoneer", treeId: "prism_mage",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "synergy", "mana", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "After Resonance Chord or Prismatic Burst with Focused Element, your next Crystal Focus is free AND grants +1 Focused Element sphere." },
      { description: "After Resonance Chord or Prismatic Burst with Focused Element, your next Crystal Focus is free, grants +1 sphere, and restores 2 mana." }
    ]
  },

  // ──────────────── TIER 7 / CAPSTONE (15 pts) ────────────────
  {
    id: "pm_t7_prismatic_cataclysm",
    name: "Prismatic Cataclysm",
    icon: "spell_fire_flamestrike",
    maxRanks: 1,
    position: { x: 0.5, y: 6 },
    requires: "pm_t6_sphere_perfection",
    spell: {
      name: "Prismatic Cataclysm",
      description: "ULTIMATE: Consume 4–6 spheres of your Focused Element. A 50-foot radius erupts for 4d12 damage of that element per sphere consumed (up to 24d12). Victims are made vulnerable to your Focused Element for 1 minute. You are anchored in place for 1 round after.",
      flavorText: "Appendix F: termination of all other parties.",
      source: "talent", class: "Arcanoneer", treeId: "prism_mage",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 50,
      castTimeType: "long", castTimeValue: 3,
      cooldownCategory: "long", cooldownValue: 240, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: false, interruptible: true,
      resourceCosts: { mana: { baseAmount: 20 }, spheres: { baseAmount: 4 } },
      damageTypes: ["ember", "rime", "storm", "arcane"],
      primaryDamage: { dice: "4d12", flat: 0, procChance: 100 },
      debuffs: ["vulnerable"], visualTheme: "arcane", tags: ["ultimate", "capstone", "aoe", "arcanoneer"]
    },
    rankUpgrades: []
  },
  {
    id: "pm_t7_pure_doctrine",
    name: "Pure Doctrine",
    icon: "spell_arcane_arcanepotency",
    maxRanks: 5,
    position: { x: 1.5, y: 6 },
    requires: "pm_t6_resonant_feedback",
    spell: {
      name: "Pure Doctrine",
      description: "The First Contract rewards consistency. All damage dealt by pure element combinations and your Focused Element signature spells (Crystal Focus, Prismatic Burst, Resonance Chord, Refraction Strike) is increased by +1d6 damage.",
      flavorText: "Redundancy, weaponized.",
      source: "talent", class: "Arcanoneer", treeId: "prism_mage",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["ember", "rime", "storm", "arcane"],
      visualTheme: "arcane", tags: ["passive", "capstone", "damage", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "Focused Element signature spell damage increased by +1d8 damage." },
      { description: "Focused Element signature spell damage increased by +1d8 damage." },
      { description: "Focused Element signature spell damage increased by +2d8 damage." },
      { description: "Focused Element signature spell damage increased by +2d8 damage, and Prismatic Cataclysm's anchor is removed." }
    ]
  },
  {
    id: "pm_t7_dominant_clause",
    name: "Dominant Clause",
    icon: "spell_arcane_blink",
    maxRanks: 3,
    position: { x: 2.5, y: 6 },
    requires: "pm_t6_prism_battery",
    spell: {
      name: "Dominant Clause",
      description: "Once per turn, one sphere you roll automatically converts to your Focused Element.",
      flavorText: "The majority element holds the seat.",
      source: "talent", class: "Arcanoneer", treeId: "prism_mage",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "capstone", "conversion", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "Up to 2 rolled spheres per turn automatically convert to your Focused Element." },
      { description: "Up to 3 rolled spheres convert to Focused Element per turn. Prismatic Burst and Resonance Chord cost 1 fewer sphere when all consumed spheres are your Focused Element." }
    ]
  },
  {
    id: "pm_t7_fexric_resonator",
    name: "Fexric Resonator",
    icon: "inv_misc_enggizmos_03",
    maxRanks: 3,
    position: { x: 3.5, y: 6 },
    requires: "pm_t6_prism_battery",
    spell: {
      name: "Fexric Resonator",
      description: "Spells that use only your Focused Element (all spheres consumed match) restore 2 mana after casting.",
      flavorText: "Steam-will, recycled. The pipes approve.",
      source: "talent", class: "Arcanoneer", treeId: "prism_mage",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "capstone", "mana", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "Pure Focused Element spells restore 4 mana. Crystal Focus also reduces Refraction Strike's cooldown by 4 seconds." },
      { description: "Pure Focused Element spells restore 6 mana. Crystal Focus also reduces Refraction Strike's cooldown by 8 seconds and Perfect Clarity charges recharge 60 seconds faster." }
    ]
  }
];
