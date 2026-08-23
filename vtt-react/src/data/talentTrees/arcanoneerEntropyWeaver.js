// ============================================
// ARCANONEER — ENTROPY WEAVER (v3: spec identity redesign)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50.
//
// SPEC IDENTITY: The chaos conductor. You don't fear Wild Magic Surges — you
// manufacture them, direct them, and weaponize them. Where Prism Mage eliminates
// variables and Sphere Architect controls the economy, you introduce chaos
// deliberately and then steer it. Your wyrd spheres are triggers; surges are your
// most powerful tool. You choose who they hurt and who they help.
//
// SIGNATURE ACTIVES:
//   - Surge Injection (t2):   Force a surge on any spell you or ally casts this turn
//   - Entropy Field (t2):     Zone where all spells trigger surges + disadvantage on saves
//   - Chaos Nova (t3):        Detonate banked wyrd spheres for massive AoE
//   - Borrowed Fate (t4):     Intercept and redirect an enemy's surge to yourself
//   - Void Rift (t5):         Persistent hazard zone that spits a surge each round
//   - Apocalypse (t7):        ULTIMATE — mass surge eruption across 60-foot radius
// ============================================

export const ARCANONEER_ENTROPY_WEAVER = [
  // ──────────────── TIER 1 (8 pts) ────────────────
  {
    id: "ew_t1_chaos_generation",
    name: "Chaos Generation",
    icon: "spell_shadow_shadowwordpain",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Chaos Generation",
      description: "Roll 5d8 for sphere generation instead of 4d8. Any wyrd sphere you roll has a 20 points chance to immediately trigger a minor Wild Magic Surge (GM rolls; you choose its target).",
      flavorText: "The Canopy-Ledger frowned on this. You filed it anyway.",
      source: "talent", class: "Arcanoneer", treeId: "entropy_weaver",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", damageTypes: ["wyrd"],
      visualTheme: "wyrd", tags: ["passive", "spheres", "chaos", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "Roll 5d8 for spheres. Wyrd spheres you roll have a 35 points chance to trigger a minor surge (your target choice)." },
      { description: "Roll 5d8 for spheres. Wyrd spheres have a 50 points chance to trigger a minor surge (your target choice), and wyrd spheres rolled this way deal +1d6 damage when spent." }
    ]
  },
  {
    id: "ew_t1_wild_magic_attunement",
    name: "Wild Magic Attunement",
    icon: "spell_arcane_portalironforge",
    maxRanks: 3,
    position: { x: 2.5, y: 0 },
    requires: null,
    spell: {
      name: "Wild Magic Attunement",
      description: "You are attuned to the Wild Magic Surge table. Whenever a surge occurs within 60 feet (yours or anyone else's), you may choose to absorb it: the surge's damage targets the enemy nearest you instead of its original target. Once per turn.",
      flavorText: "Clause: unknown. Outcome: negotiable.",
      source: "talent", class: "Arcanoneer", treeId: "entropy_weaver",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", damageTypes: ["wyrd"],
      visualTheme: "wyrd", tags: ["passive", "redirect", "surge", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "Absorb any surge within 60 feet once per turn. When you absorb a surge, you also gain 1 wyrd sphere." },
      { description: "Absorb any surge within 60 feet twice per turn. Absorbed surges deal +1d6 bonus damage when redirected to their new target." }
    ]
  },
  {
    id: "ew_t1_chaos_amplification",
    name: "Chaos Amplification",
    icon: "spell_shadow_unstableaffliction_3",
    maxRanks: 2,
    position: { x: 4, y: 0 },
    requires: null,
    spell: {
      name: "Chaos Amplification",
      description: "All wyrd element combinations deal 1d6 additional wyrd damage. When a surge you direct deals damage, you gain 2 mana.",
      flavorText: "Amplify what cannot be predicted. Bill the amplification.",
      source: "talent", class: "Arcanoneer", treeId: "entropy_weaver",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["wyrd"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "wyrd", tags: ["passive", "damage", "chaos", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "Wyrd combinations deal 2d6 additional wyrd damage. Directed surges restore 4 mana and grant +5 points crit chance to your next spell.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } }
    ]
  },

  // ──────────────── TIER 2 (6 pts) ────────────────
  {
    id: "ew_t2_surge_injection",
    name: "Surge Injection",
    icon: "spell_arcane_polymorph",
    maxRanks: 3,
    position: { x: 0, y: 1 },
    requires: "ew_t1_wild_magic_attunement",
    spell: {
      name: "Surge Injection",
      description: "Spend 1 wyrd sphere and 3 mana: the next spell cast this turn (yours or an ally's) also triggers a Wild Magic Surge. You choose whether the surge's effect is beneficial (targets an ally) or harmful (targets an enemy within range of the spell).",
      flavorText: "All contracts become chaos contracts under sufficient pressure.",
      source: "talent", class: "Arcanoneer", treeId: "entropy_weaver",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 8, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { mana: { baseAmount: 3 }, spheres: { baseAmount: 1 } },
      visualTheme: "wyrd", tags: ["surge", "inject", "control", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "Spend 1 wyrd sphere and 2 mana: next spell triggers a surge, polarity your choice. If harmful, the surge deals +15 points damage. Cooldown drops to 6 seconds.", cooldownValue: 6, resourceCosts: { mana: { baseAmount: 2 }, spheres: { baseAmount: 1 } } },
      { description: "Free once per turn: next spell triggers a surge, polarity your choice. Harmful surges deal +1d6 bonus damage. You may inject twice per turn (second injection costs 2 mana).", resourceCosts: { mana: { baseAmount: 0 }, spheres: { baseAmount: 1 } } }
    ]
  },
  {
    id: "ew_t2_entropy_field",
    name: "Entropy Field",
    icon: "spell_shadow_shadowfury",
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: "ew_t1_chaos_generation",
    spell: {
      name: "Entropy Field",
      description: "Open a 20-foot Entropy Field within 60 feet for 1 minute: every spell cast inside (by anyone) triggers a Wild Magic Surge. You choose all surge polarities for surges inside the field.",
      flavorText: "Probability thins here. On purpose.",
      source: "talent", class: "Arcanoneer", treeId: "entropy_weaver",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "aoe", rangeType: "ranged", range: 60, aoeShape: "circle", aoeSize: 20,
      castTimeType: "short", castTimeValue: 1,
      cooldownCategory: "medium", cooldownValue: 30, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: true,
      resourceCosts: { mana: { baseAmount: 8 }, spheres: { baseAmount: 1 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      debuffs: ["entropy"], damageTypes: ["wyrd"],
      visualTheme: "wyrd", tags: ["field", "control", "surge", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "30-foot Entropy Field: all spells inside trigger surges (your polarity choices) and enemies inside save against surges with disadvantage.", aoeSize: 30 },
      { description: "40-foot Entropy Field: all spells trigger surges, enemies save at disadvantage, and enemies who surge inside take 2d6 wyrd damage from the field itself.", aoeSize: 40 }
    ]
  },
  {
    id: "ew_t2_unstable_sphere",
    name: "Unstable Sphere",
    icon: "spell_shadow_mindbomb",
    maxRanks: 3,
    position: { x: 3.5, y: 1 },
    requires: "ew_t1_chaos_amplification",
    spell: {
      name: "Unstable Sphere",
      description: "Your wyrd spheres are volatile: when spent, roll 1d6. On 1–2: surge triggers immediately (you choose polarity). On 3–4: deals +2d6 bonus wyrd damage. On 5–6: refunds 2 mana.",
      flavorText: "Schroedinger filed this one personally.",
      source: "talent", class: "Arcanoneer", treeId: "entropy_weaver",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", damageTypes: ["wyrd"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 33 },
      visualTheme: "wyrd", tags: ["passive", "gamble", "chaos", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "Wyrd sphere spent: 1–2 surge (your polarity), 3–4 deals +3d6 wyrd damage, 5–6 refunds 3 mana. Any result grants +5 points crit chance this turn.", primaryDamage: { dice: "3d6", flat: 0, procChance: 33 } },
      { description: "Wyrd sphere spent: 1–2 surge (+15 points damage, your polarity), 3–4 deals +3d6 wyrd damage, 5–6 refunds 4 mana AND grants a free Surge Injection.", primaryDamage: { dice: "3d6", flat: 0, procChance: 33 } }
    ]
  },

  // ──────────────── TIER 3 (6 pts) ────────────────
  {
    id: "ew_t3_chaos_nova",
    name: "Chaos Nova",
    icon: "spell_fire_felrainoffire",
    maxRanks: 3,
    position: { x: 0.5, y: 2 },
    requires: "ew_t2_surge_injection",
    spell: {
      name: "Chaos Nova",
      description: "Consume 1 wyrd sphere: detonate wyrd energy in a 30-foot radius, dealing 3d8 wyrd damage plus 1d8 for each additional wyrd sphere in your bank. Each enemy hit triggers a wild surge (you choose: all harmful or all beneficial).",
      flavorText: "The clause detonates. Everyone is within jurisdiction.",
      source: "talent", class: "Arcanoneer", treeId: "entropy_weaver",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 18, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { mana: { baseAmount: 8 }, spheres: { baseAmount: 1 } },
      damageTypes: ["wyrd"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      visualTheme: "wyrd", tags: ["nova", "aoe", "chaos", "surge", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "Consume 1 wyrd sphere: 30-foot nova deals 4d8 + 1d8 per banked wyrd sphere. Each hit triggers a surge (your polarity per target). Cooldown drops to 14 seconds.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 }, cooldownValue: 14 },
      { description: "Consume 2 wyrd spheres: 40-foot nova deals 5d8 + 2d8 per banked wyrd sphere. Each hit triggers a surge (individual polarity choice). You gain 1 wyrd sphere for every 3 enemies hit.", primaryDamage: { dice: "5d8", flat: 0, procChance: 100 }, aoeSize: 40, resourceCosts: { mana: { baseAmount: 10 }, spheres: { baseAmount: 2 } } }
    ]
  },
  {
    id: "ew_t3_reality_fracture",
    name: "Reality Fracture",
    icon: "spell_arcane_portaldarnassus",
    maxRanks: 2,
    position: { x: 3.5, y: 2 },
    requires: "ew_t2_entropy_field",
    spell: {
      name: "Reality Fracture",
      description: "Beneficial Wild Magic Surges you direct also apply to one ally of your choice within 30 feet (they receive the same beneficial effect). You may choose surges' polarity per-target rather than all-at-once.",
      flavorText: "The crack in the contract lets the light in — and out.",
      source: "talent", class: "Arcanoneer", treeId: "entropy_weaver",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "surge", "ally", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "Beneficial surges you direct copy to two allies within 30 feet. Per-target polarity control applies to all your surges. Beneficial surges on allies are 50 points stronger." }
    ]
  },

  // ──────────────── TIER 4 (5 pts) ────────────────
  {
    id: "ew_t4_borrowed_fate",
    name: "Borrowed Fate",
    icon: "spell_shadow_manaburn",
    maxRanks: 2,
    position: { x: 0, y: 3 },
    requires: "ew_t3_chaos_nova",
    spell: {
      name: "Borrowed Fate",
      description: "Reaction: when an enemy within 60 feet would trigger a Wild Magic Surge, spend 3 mana to intercept it. The surge is yours to direct — choose a new target and polarity. The original caster loses the surge entirely.",
      flavorText: "Their chaos, escrowed. Yours now.",
      source: "talent", class: "Arcanoneer", treeId: "entropy_weaver",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "self", rangeType: "ranged", range: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 10, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { mana: { baseAmount: 3 } },
      visualTheme: "wyrd", tags: ["reaction", "intercept", "surge", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "Reaction: intercept any surge within 60 feet for free (once per round). Redirect it to any target you choose at +25 points damage or +25 points healing strength." }
    ]
  },
  {
    id: "ew_t4_catastrophic_surge",
    name: "Catastrophic Surge",
    icon: "spell_arcane_arcane04",
    maxRanks: 3,
    position: { x: 3.5, y: 3 },
    requires: "ew_t3_reality_fracture",
    spell: {
      name: "Catastrophic Surge",
      description: "Harmful surges you direct deal maximum damage. You may voluntarily trigger a harmful surge targeting any enemy within 60 feet once per turn for 4 mana — no spell required.",
      flavorText: "Voluntary catastrophe. The paperwork is immaculate.",
      source: "talent", class: "Arcanoneer", treeId: "entropy_weaver",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["wyrd"],
      visualTheme: "wyrd", tags: ["passive", "surge", "maximize", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "Harmful surges deal max damage at +25 points. Voluntary surges cost 2 mana and can be triggered twice per turn." },
      { description: "Harmful surges deal max damage at +25 points. Voluntary surges cost 2 mana twice per turn, and surge kills generate 1 wyrd sphere." }
    ]
  },

  // ──────────────── TIER 5 (5 pts) ────────────────
  {
    id: "ew_t5_void_rift",
    name: "Void Rift",
    icon: "spell_shadow_shadowfiend",
    maxRanks: 2,
    position: { x: 0.5, y: 4 },
    requires: "ew_t4_borrowed_fate",
    spell: {
      name: "Void Rift",
      description: "Tear a 15-foot Void Rift within 40 feet that lasts 1 minute. At the start of each round, the rift spits one automatic harmful surge targeting the nearest enemy inside (or any enemy if none are inside). You choose all its surge targets and effects.",
      flavorText: "Chaos, scheduled. It arrives at the agreed-upon time.",
      source: "talent", class: "Arcanoneer", treeId: "entropy_weaver",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "aoe", rangeType: "ranged", range: 40, aoeShape: "circle", aoeSize: 15,
      castTimeType: "short", castTimeValue: 1,
      cooldownCategory: "long", cooldownValue: 60, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: true,
      resourceCosts: { mana: { baseAmount: 10 }, spheres: { baseAmount: 2 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      damageTypes: ["wyrd"],
      visualTheme: "wyrd", tags: ["rift", "persistent", "surge", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "20-foot Void Rift within 40 feet. Spits 2 automatic surges per round (your targets and effects each). Enemies inside take 1d6 wyrd damage per round. Cooldown drops to 45 seconds.", aoeSize: 20, cooldownValue: 45 }
    ]
  },
  {
    id: "ew_t5_chaos_armor",
    name: "Chaos Armor",
    icon: "spell_shadow_nethercloak",
    maxRanks: 2,
    position: { x: 2.5, y: 4 },
    requires: "ew_t4_catastrophic_surge",
    spell: {
      name: "Chaos Armor",
      description: "While you hold any wyrd spheres in your bank, gain +1 Durability Steps to equipped durability per wyrd sphere and resistance to wyrd damage. Beneficial surges targeting you also shield you for 1d6 health.",
      flavorText: "The chaos defends its landlord.",
      source: "talent", class: "Arcanoneer", treeId: "entropy_weaver",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["wyrd"],
      visualTheme: "wyrd", tags: ["passive", "defense", "bank", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "Gain +2 Durability Steps to equipped durability per banked wyrd sphere and resistance to wyrd damage. Beneficial surges targeting you shield you for 2d6 health." }
    ]
  },
  {
    id: "ew_t5_borrowed_entropy",
    name: "Entropic Residue",
    icon: "spell_shadow_mindsteal",
    maxRanks: 2,
    position: { x: 4, y: 4 },
    requires: "ew_t4_borrowed_fate",
    spell: {
      name: "Entropic Residue",
      description: "When a surge you directed deals damage to an enemy, that enemy takes 1d6 wyrd damage at the start of their next 2 turns (residue burns). Stacks once per surge source.",
      flavorText: "Even chaos leaves a paper trail.",
      source: "talent", class: "Arcanoneer", treeId: "entropy_weaver",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["wyrd"],
      isDot: true, dotDuration: 2, dotTick: "1d6",
      visualTheme: "wyrd", tags: ["passive", "dot", "surge", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "Directed surges leave 1d6 wyrd residue per turn for 3 turns. Residue stacks twice.", dotTick: "1d6", dotDuration: 3 }
    ]
  },

  // ──────────────── TIER 6 (5 pts) ────────────────
  {
    id: "ew_t6_entropy_weaving",
    name: "Entropy Weaving",
    icon: "spell_shadow_nightmare",
    maxRanks: 2,
    position: { x: 1.5, y: 5 },
    requires: "ew_t5_void_rift",
    spell: {
      name: "Entropy Weaving",
      description: "Your wyrd damage ignores 4 Damage Reduction. Surge Injection and Borrowed Fate no longer consume spheres — only mana.",
      flavorText: "The weave holds, even when the pattern shifts.",
      source: "talent", class: "Arcanoneer", treeId: "entropy_weaver",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", damageTypes: ["wyrd"],
      visualTheme: "wyrd", tags: ["passive", "penetration", "chaos", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "Wyrd damage ignores 6 Damage Reduction. Surge Injection and Borrowed Fate cost 0 mana as well (once per turn each)." }
    ]
  },
  {
    id: "ew_t6_volatile_power",
    name: "Volatile Power",
    icon: "spell_fire_volcano",
    maxRanks: 3,
    position: { x: 3.5, y: 5 },
    requires: "ew_t5_chaos_armor",
    spell: {
      name: "Volatile Power",
      description: "Wyrd spells chain to a nearby enemy within 10 feet for half damage; each chain triggers its own harmful surge (your target).",
      flavorText: "Chaos, forwarded to interested parties.",
      source: "talent", class: "Arcanoneer", treeId: "entropy_weaver",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["wyrd"],
      visualTheme: "wyrd", tags: ["passive", "chain", "surge", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "Wyrd spells chain to 2 enemies within 20 feet for full damage; each chain triggers a surge (your target)." },
      { description: "Wyrd spells chain to 3 enemies within 20 feet for full damage; each chain surges (your target per chain) and chain kills generate wyrd spheres." }
    ]
  },

  // ──────────────── TIER 7 / CAPSTONE (15 pts) ────────────────
  {
    id: "ew_t7_apocalypse",
    name: "Apocalypse",
    icon: "spell_fire_felhellfire",
    maxRanks: 1,
    position: { x: 0.5, y: 6 },
    requires: "ew_t6_entropy_weaving",
    spell: {
      name: "Apocalypse",
      description: "ULTIMATE: Consume up to 6 wyrd spheres. A 60-foot eruption deals 5d12 wyrd damage per sphere consumed. Every enemy hit triggers a harmful surge — you choose each one's effect individually. Allies in the area receive a beneficial surge of your choice.",
      flavorText: "Final clause. All parties terminated. Chaos retains its copy.",
      source: "talent", class: "Arcanoneer", treeId: "entropy_weaver",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 60,
      castTimeType: "long", castTimeValue: 3,
      cooldownCategory: "long", cooldownValue: 240, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: false, interruptible: true,
      resourceCosts: { mana: { baseAmount: 25 }, spheres: { baseAmount: 6 } },
      damageTypes: ["wyrd"],
      primaryDamage: { dice: "5d12", flat: 0, procChance: 100 },
      visualTheme: "wyrd", tags: ["ultimate", "capstone", "aoe", "chaos", "surge", "arcanoneer"]
    },
    rankUpgrades: []
  },
  {
    id: "ew_t7_entropy_doctrine",
    name: "Entropy Doctrine",
    icon: "spell_shadow_shadowwordpain",
    maxRanks: 5,
    position: { x: 1.5, y: 6 },
    requires: "ew_t6_entropy_weaving",
    spell: {
      name: "Entropy Doctrine",
      description: "Chaos, consistently applied. All wyrd damage you deal is increased by +1d6 damage. Directed surges deal +1d6 bonus damage or provide 10 points stronger healing.",
      flavorText: "A doctrine of disorder, held with terrifying consistency.",
      source: "talent", class: "Arcanoneer", treeId: "entropy_weaver",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["wyrd"],
      visualTheme: "wyrd", tags: ["passive", "capstone", "damage", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "Wyrd damage +20 points. Directed surges deal +1d8 bonus damage or provide +20 points stronger healing." },
      { description: "Wyrd damage +35 points. Directed surges +35 points. Void Rift's automatic surges deal maximum damage." },
      { description: "Wyrd damage +50 points. Directed surges +50 points. Void Rift spits 3 surges per round." },
      { description: "Wyrd damage +70 points. Directed surges +70 points. Chaos Nova and Apocalypse cooldowns reduced by 20 points." }
    ]
  },
  {
    id: "ew_t7_chain_reaction_engine",
    name: "Chain Reaction Engine",
    icon: "spell_nature_chainlightning",
    maxRanks: 3,
    position: { x: 2.5, y: 6 },
    requires: "ew_t6_volatile_power",
    spell: {
      name: "Chain Reaction Engine",
      description: "Volatile Power chains deal full damage (not half). Each chain that kills an enemy also triggers an additional harmful surge targeting an enemy of your choice.",
      flavorText: "First bounce, full price. Second bounce, free surge.",
      source: "talent", class: "Arcanoneer", treeId: "entropy_weaver",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["wyrd"],
      visualTheme: "wyrd", tags: ["passive", "capstone", "chain", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "Chains deal full damage. Kill chains surge. Kill chains also refund 1 wyrd sphere." },
      { description: "Chains deal 130 points damage. Kill chains surge AND generate a wyrd sphere. Chaos Nova's cooldown refreshes on any kill during its detonation." }
    ]
  },
  {
    id: "ew_t7_probabilistic_existence",
    name: "Probabilistic Existence",
    icon: "spell_arcane_arcane01",
    maxRanks: 3,
    position: { x: 3.5, y: 6 },
    requires: "ew_t6_volatile_power",
    spell: {
      name: "Probabilistic Existence",
      description: "Attacks against you have a 15 points chance to miss outright — the attacker must reroll with disadvantage. This probability rises by 5 points for each wyrd sphere in your bank.",
      flavorText: "You were never quite there. Neither was the arrow.",
      source: "talent", class: "Arcanoneer", treeId: "entropy_weaver",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "capstone", "evasion", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "Attacks against you have a 20 points base miss chance (+5 points per wyrd sphere banked). Spells targeting you also have a 10 points miss chance." },
      { description: "25 points base miss chance (+5 points per wyrd sphere). Spells 15 points miss. When an attack misses this way, you steal the attacker's luck: gain +5% crit chance for 1 round." }
    ]
  }
];
