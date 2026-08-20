// ============================================
// ARCANONEER — SPHERE ARCHITECT (v3: spec identity redesign)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50.
//
// SPEC IDENTITY: The battlefield engineer. Where Prism Mage eliminates variables
// and Entropy Weaver weaponizes chaos, you BUILD — persistent runic matrices that
// amplify every spell passing through them, mana crystals that store resources for
// the perfect moment, and a bank so well-managed that you never lack for the exact
// sphere you need. Your damage comes from leverage, not volume.
//
// A Sphere Architect at round 3 has 2 matrices running, a crystal charged with
// 15 mana, and a sphere bank arranged exactly how they want it. A Prism Mage or
// Entropy Weaver at round 3 is still burning everything as fast as it comes.
//
// SIGNATURE ACTIVES:
//   - Sphere Manipulation (t1):  Swap banked spheres to any element
//   - Runic Matrix (t3):         Deploy an amplifying field — spells through it cost less + deal more
//   - Mana Crystal (t2):         Store mana reserves; shatter for burst or defense
//   - Sphere Synthesis (t3):     Craft any sphere from 2 different ones
//   - Crystal Bastion (t5):      Convert stored mana into a damage-absorbing shield
//   - Elemental Convergence (t7):ULTIMATE — draft a custom spell from scratch
// ============================================

export const ARCANONEER_SPHERE_ARCHITECT = [
  // ──────────────── TIER 1 (8 pts) ────────────────
  {
    id: "sa_t1_runic_precision",
    name: "Runic Precision",
    icon: "spell_arcane_arcaneresilience",
    maxRanks: 3,
    position: { x: 0.5, y: 0 },
    requires: null,
    spell: {
      name: "Runic Precision",
      description: "3-sphere spells cost 2 less mana. When you cast a spell through an active Runic Matrix, your next sphere roll is made with 5d8 instead of 4d8 (take highest 4).",
      flavorText: "Precision is cheaper than correction.",
      source: "talent", class: "Arcanoneer", treeId: "sphere_architect",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "cost", "matrix", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "3-sphere spells cost 3 less mana. Casting through a Runic Matrix gives 5d8 sphere roll (take highest 4) and also refunds 1 mana." },
      { description: "3-sphere spells cost 4 less mana. Casting through a Runic Matrix gives 5d8 sphere roll (take highest 4), refunds 2 mana, and lets you immediately swap 1 banked sphere for free." }
    ]
  },
  {
    id: "sa_t1_sphere_manipulation",
    name: "Sphere Manipulation",
    icon: "spell_arcane_arcanepotency",
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    spell: {
      name: "Sphere Manipulation",
      description: "Spend 3 mana: swap up to 2 banked spheres for any elements of your choice. The swapped spheres deal +1d4 damage when next spent.",
      flavorText: "The spheres do not mind. They are not consulted.",
      source: "talent", class: "Arcanoneer", treeId: "sphere_architect",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 5, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { mana: { baseAmount: 3 } },
      damageTypes: ["ember", "rime", "storm", "arcane"],
      primaryDamage: { dice: "1d4", flat: 0, procChance: 100 },
      visualTheme: "arcane", tags: ["swap", "control", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "Spend 2 mana: swap up to 3 banked spheres to chosen elements. Swapped spheres deal +1d6 when next spent. Cooldown drops to 4 seconds.", resourceCosts: { mana: { baseAmount: 2 } }, primaryDamage: { dice: "1d6", flat: 0, procChance: 100 }, cooldownValue: 4 },
      { description: "Spend 1 mana: swap any number of banked spheres to chosen elements. Swapped spheres deal +1d8 when next spent. Cooldown drops to 3 seconds.", resourceCosts: { mana: { baseAmount: 1 } }, primaryDamage: { dice: "1d8", flat: 0, procChance: 100 }, cooldownValue: 3 }
    ]
  },
  {
    id: "sa_t1_efficient_banking",
    name: "Efficient Banking",
    icon: "inv_misc_rune_01",
    maxRanks: 2,
    position: { x: 3.5, y: 0 },
    requires: null,
    spell: {
      name: "Efficient Banking",
      description: "Banked spheres persist between encounters (they don't reset between fights). Your sphere bank maximum increases by 2.",
      flavorText: "Savings, elemental. Interest, none. The Neth checked.",
      source: "talent", class: "Arcanoneer", treeId: "sphere_architect",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "bank", "persistence", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "Banked spheres persist between encounters; bank maximum +4. After a short rest, roll your bank composition once and keep or replace up to 2 spheres." }
    ]
  },

  // ──────────────── TIER 2 (6 pts) ────────────────
  {
    id: "sa_t2_mana_crystal",
    name: "Mana Crystal",
    icon: "inv_misc_gem_crystal_01",
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: "sa_t1_sphere_manipulation",
    spell: {
      name: "Mana Crystal",
      description: "Store up to 10 mana in a Mana Crystal over any number of turns (1 mana per Action Point spent). Shatter the crystal (instant, 1 Action Point): recover all stored mana. You can only hold 1 crystal at a time.",
      flavorText: "The Velun keep everything in writing. Including reserves.",
      source: "talent", class: "Arcanoneer", treeId: "sphere_architect",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 10, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { mana: { baseAmount: 0 } },
      visualTheme: "arcane", tags: ["storage", "mana", "crystal", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "Store up to 20 mana in a crystal. Shattering also grants 1 sphere of your choice and a bonus Action Point (use it only to cast). Cooldown drops to 8 seconds.", cooldownValue: 8 },
      { description: "Store up to 30 mana in a crystal. In combat, crystals passively accrue 1 mana per round. Shattering grants 2 chosen spheres and a bonus Action Point." }
    ]
  },
  {
    id: "sa_t2_sphere_lock",
    name: "Sphere Lock",
    icon: "spell_arcane_portalshattrath",
    maxRanks: 3,
    position: { x: 0.5, y: 2 },
    requires: "sa_t1_runic_precision",
    spell: {
      name: "Sphere Lock",
      description: "At the end of your turn, declare one element locked: that element is guaranteed to appear in your next sphere roll. Locked spheres deal +1d6 damage when spent.",
      flavorText: "The reservation is non-transferable.",
      source: "talent", class: "Arcanoneer", treeId: "sphere_architect",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", damageTypes: ["ember", "rime", "storm", "arcane"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "arcane", tags: ["passive", "lock", "guarantee", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "Lock one element; it appears guaranteed in next roll. Locked spheres deal +2d6 when spent.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } },
      { description: "Lock two elements simultaneously; both guaranteed in next roll. Locked spheres deal +2d6 when spent and cost 1 less mana to use." }
    ]
  },
  {
    id: "sa_t2_precision_casting",
    name: "Precision Casting",
    icon: "spell_arcane_blast",
    maxRanks: 2,
    position: { x: 3.5, y: 2 },
    requires: "sa_t1_efficient_banking",
    spell: {
      name: "Precision Casting",
      description: "Spells cast through an active Runic Matrix gain +2 to hit and cannot be counterspelled. Additionally, 2-sphere spells cost 1 less mana.",
      flavorText: "The clause names its target. The target attends.",
      source: "talent", class: "Arcanoneer", treeId: "sphere_architect",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "accuracy", "matrix", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "Spells through a Runic Matrix gain +3 to hit, cannot be interrupted, ignore half cover, and 2-sphere spells cost 2 less mana." }
    ]
  },

  // ──────────────── TIER 3 (6 pts) ────────────────
  {
    id: "sa_t3_runic_matrix",
    name: "Runic Matrix",
    icon: "spell_arcane_rune",
    maxRanks: 2,
    position: { x: 1, y: 4 },
    requires: "sa_t2_sphere_lock",
    spell: {
      name: "Runic Matrix",
      description: "Inscribe a Runic Matrix centered on a point within 30 feet (10-foot radius). It lasts 1 minute. Spells cast through the matrix cost 2 less mana and deal +1d8 damage. You may have 1 active Runic Matrix at a time.",
      flavorText: "Pre-printed clauses. Just add violence.",
      source: "talent", class: "Arcanoneer", treeId: "sphere_architect",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "aoe", rangeType: "ranged", range: 30, aoeShape: "circle", aoeSize: 10,
      castTimeType: "short", castTimeValue: 1,
      cooldownCategory: "medium", cooldownValue: 20, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: false, interruptible: true,
      resourceCosts: { mana: { baseAmount: 8 }, spheres: { baseAmount: 1 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      damageTypes: ["arcane"],
      primaryDamage: { dice: "1d8", flat: 0, procChance: 100 },
      buffs: ["runic-matrix"], visualTheme: "arcane", tags: ["matrix", "zone", "empower", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "15-foot Runic Matrix within 30 feet (1 minute). Spells through it cost 3 less mana and deal +2d8 damage. Cooldown drops to 16 seconds.", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 }, aoeSize: 15, cooldownValue: 16 }
    ]
  },
  {
    id: "sa_t3_sphere_synthesis",
    name: "Sphere Synthesis",
    icon: "spell_arcane_polymorph",
    maxRanks: 3,
    position: { x: 3.5, y: 4 },
    requires: "sa_t2_mana_crystal",
    spell: {
      name: "Sphere Synthesis",
      description: "Spend 4 mana: combine 2 spheres of different elements in your bank into 1 sphere of any element you choose. The synthesized sphere deals +1d6 damage when spent.",
      flavorText: "Two clauses, one signature. Legal in three provinces.",
      source: "talent", class: "Arcanoneer", treeId: "sphere_architect",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 6, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { mana: { baseAmount: 4 }, spheres: { baseAmount: 2 } },
      damageTypes: ["ember", "rime", "storm", "arcane"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "arcane", tags: ["synthesis", "conversion", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "Spend 2 mana: synthesize 2 different spheres into 1 chosen sphere. Synthesized sphere deals +2d6 when spent. Cooldown drops to 5 seconds.", resourceCosts: { mana: { baseAmount: 2 } }, primaryDamage: { dice: "2d6", flat: 0, procChance: 100 }, cooldownValue: 5 },
      { description: "Free synthesis once per turn: combine 2 different spheres into 1 chosen sphere. Synthesized sphere deals +2d6 when spent and counts as a pure pair for purity bonuses." }
    ]
  },

  // ──────────────── TIER 4 (5 pts) ────────────────
  {
    id: "sa_t4_sphere_network",
    name: "Sphere Network",
    icon: "spell_arcane_arcanetorrent",
    maxRanks: 3,
    position: { x: 1, y: 5.5 },
    requires: "sa_t3_runic_matrix",
    spell: {
      name: "Sphere Network",
      description: "While your Runic Matrix is active, single-target spells cast through it also strike 1 additional target within 30 feet of the primary target at 50% damage.",
      flavorText: "Networking. The spheres hate it. It works.",
      source: "talent", class: "Arcanoneer", treeId: "sphere_architect",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["arcane"],
      visualTheme: "arcane", tags: ["passive", "multi-target", "matrix", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "Matrix-amplified single-target spells strike 2 additional targets within 30 feet at 50% damage each." },
      { description: "Matrix-amplified single-target spells strike 3 additional targets within 45 feet at 50% damage each." }
    ]
  },
  {
    id: "sa_t4_perfect_control",
    name: "Perfect Control",
    icon: "spell_arcane_mindmastery",
    maxRanks: 2,
    position: { x: 3.5, y: 5.5 },
    requires: "sa_t3_sphere_synthesis",
    spell: {
      name: "Perfect Control",
      description: "As a free action at the start of your turn, rearrange your entire sphere bank in any order. Spells gain +1 to attack rolls for each element currently represented in your bank.",
      flavorText: "Total command, filed in triplicate.",
      source: "talent", class: "Arcanoneer", treeId: "sphere_architect",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "control", "bank", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "Rearrange bank freely each turn. Spells gain +2 to attack rolls per element represented and ignore half cover. You may Sphere Manipulate as a free action (once per turn)." }
    ]
  },

  // ──────────────── TIER 5 (5 pts) ────────────────
  {
    id: "sa_t5_runic_ascendancy",
    name: "Runic Ascendancy",
    icon: "spell_arcane_portaldarnassus",
    maxRanks: 1,
    position: { x: 0.5, y: 7 },
    requires: "sa_t4_sphere_network",
    spell: {
      name: "Runic Ascendancy",
      description: "You may maintain 2 Runic Matrices simultaneously. Damage dice of spells cast through any matrix are maximized.",
      flavorText: "The architecture now outranks the architect.",
      source: "talent", class: "Arcanoneer", treeId: "sphere_architect",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["arcane"],
      visualTheme: "arcane", tags: ["passive", "matrix", "maximize", "arcanoneer"]
    },
    rankUpgrades: []
  },
  {
    id: "sa_t5_crystal_bastion",
    name: "Crystal Bastion",
    icon: "inv_misc_gem_crystal_02",
    maxRanks: 2,
    position: { x: 2.5, y: 7 },
    requires: "sa_t4_perfect_control",
    spell: {
      name: "Crystal Bastion",
      description: "Shatter your Mana Crystal defensively (instant reaction): gain a damage shield absorbing 3d6 per 5 mana stored in the crystal. The stored mana is lost but so is the incoming damage.",
      flavorText: "The savings account becomes the wall.",
      source: "talent", class: "Arcanoneer", treeId: "sphere_architect",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 20, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { mana: { baseAmount: 0 } },
      buffs: ["shield"], visualTheme: "arcane", tags: ["reaction", "defense", "crystal", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "Crystal Bastion absorbs 4d6 per 5 stored mana. After the shield breaks, it detonates for 2d6 arcane damage to all adjacent enemies." }
    ]
  },
  {
    id: "sa_t5_scheduled_withdrawal",
    name: "Scheduled Withdrawal",
    icon: "inv_misc_rune_02",
    maxRanks: 1,
    position: { x: 4, y: 7 },
    requires: "sa_t4_sphere_network",
    spell: {
      name: "Scheduled Withdrawal",
      description: "At the start of your turn, if you cast no spell the previous turn, gain 2 banked spheres of your choice. This represents deliberate preparation — holding back to set up the perfect turn.",
      flavorText: "Patience compounds. The bank pays in ammunition.",
      source: "talent", class: "Arcanoneer", treeId: "sphere_architect",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "bank", "patience", "arcanoneer"]
    },
    rankUpgrades: []
  },

  // ──────────────── TIER 6 (5 pts) ────────────────
  {
    id: "sa_t6_arcane_efficiency",
    name: "Arcane Efficiency",
    icon: "spell_arcane_arcane04",
    maxRanks: 2,
    position: { x: 0.5, y: 7.5 },
    requires: "sa_t5_runic_ascendancy",
    spell: {
      name: "Arcane Efficiency",
      description: "4-sphere spells cost 3 less mana. While both Runic Matrices are active simultaneously, your sphere bank rolls an additional die (5d8, take highest 4).",
      flavorText: "Silence, contractually guaranteed.",
      source: "talent", class: "Arcanoneer", treeId: "sphere_architect",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "cost", "matrix", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "4-sphere spells cost 5 less mana. Both matrices active: 5d8 sphere roll (take highest 4). Sphere Manipulation costs 0 mana." }
    ]
  },
  {
    id: "sa_t6_rune_optimization",
    name: "Rune Optimization",
    icon: "spell_arcane_rune",
    maxRanks: 3,
    position: { x: 2.5, y: 7.5 },
    requires: "sa_t5_crystal_bastion",
    spell: {
      name: "Rune Optimization",
      description: "Each Runic Matrix gains 1 additional charge (can empower 1 more spell before needing recast). Deploying a Runic Matrix now costs 1 fewer sphere.",
      flavorText: "The inscriptions align with the weave.",
      source: "talent", class: "Arcanoneer", treeId: "sphere_architect",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "matrix", "optimization", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "Each matrix gains 2 additional charges. Deploying costs 0 spheres." },
      { description: "Matrices are permanent until replaced (no duration). Deploying costs 0 spheres. You may Sphere Synthesize through a matrix for free once per matrix per turn." }
    ]
  },

  // ──────────────── TIER 7 / CAPSTONE (15 pts) ────────────────
  {
    id: "sa_t7_elemental_convergence",
    name: "Elemental Convergence",
    icon: "spell_arcane_portalironforge",
    maxRanks: 1,
    position: { x: 0, y: 8 },
    requires: "sa_t5_runic_ascendancy",
    spell: {
      name: "Elemental Convergence",
      description: "ULTIMATE: Spend 8 mana and 1–6 spheres of any elements to draft a custom spell effect: you describe the damage type, range, area, target, and riders. The number of spheres spent determines the power (1 sphere: minor effect; 6 spheres: legendary effect). The Canopy-Ledger audits the spell after the fact.",
      flavorText: "Valerius wrote the First Contract this way. You are holding the pen now.",
      source: "talent", class: "Arcanoneer", treeId: "sphere_architect",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "long", castTimeValue: 3,
      cooldownCategory: "long", cooldownValue: 240, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: false, interruptible: true,
      resourceCosts: { mana: { baseAmount: 8 }, spheres: { baseAmount: 1 } },
      visualTheme: "arcane", tags: ["ultimate", "capstone", "custom", "arcanoneer"]
    },
    rankUpgrades: []
  },
  {
    id: "sa_t7_ledger_mastery",
    name: "Ledger Mastery",
    icon: "inv_misc_book_09",
    maxRanks: 5,
    position: { x: 1, y: 8 },
    requires: "sa_t6_arcane_efficiency",
    spell: {
      name: "Ledger Mastery",
      description: "Every line item audited. All spell costs are reduced by 1 mana. Spells cast through an active Runic Matrix always have their mana cost reduced to 0 after all other reductions.",
      flavorText: "The audit found savings everywhere.",
      source: "talent", class: "Arcanoneer", treeId: "sphere_architect",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "capstone", "cost", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "All spell costs reduced by 2 mana. Matrix spells free after reductions." },
      { description: "All spell costs reduced by 3 mana. Matrix spells free. Sphere Synthesis and Sphere Manipulation are always free." },
      { description: "All spell costs reduced by 4 mana. Matrix spells free. Synthesis and Manipulation free. Your Mana Crystal accrues 2 mana per round." },
      { description: "All spell costs reduced by 5 mana. Matrix spells free. Synthesis and Manipulation free. Crystal accrues 2 mana/round. Elemental Convergence's cooldown is halved." }
    ]
  },
  {
    id: "sa_t7_deep_vault",
    name: "Deep Vault",
    icon: "inv_misc_gem_bubble",
    maxRanks: 3,
    position: { x: 2, y: 8 },
    requires: "sa_t6_rune_optimization",
    spell: {
      name: "Deep Vault",
      description: "Your sphere bank maximum increases by 2. At the start of combat, your bank contains any spheres you had at the end of your last encounter (Efficient Banking carried them).",
      flavorText: "Structural reinforcement, morally approved.",
      source: "talent", class: "Arcanoneer", treeId: "sphere_architect",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "capstone", "bank", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "Bank maximum +4. All spheres persist between encounters. Once per combat, draw 2 additional spheres of your choice as a free action." },
      { description: "Bank maximum +6. Spheres persist. Free sphere draw twice per combat. Sphere Locked elements persist between rounds automatically." }
    ]
  },
  {
    id: "sa_t7_matrix_lattice",
    name: "Matrix Lattice",
    icon: "spell_arcane_rune",
    maxRanks: 3,
    position: { x: 3, y: 8 },
    requires: "sa_t6_rune_optimization",
    spell: {
      name: "Matrix Lattice",
      description: "While any Runic Matrix is active: gain +1 Durability Steps to equipped durability and 5% resistance to all damage per active matrix. When a matrix expires or is replaced, it detonates for 1d8 arcane damage to all enemies within its area.",
      flavorText: "The architecture defends its tenant. And evicts its guests.",
      source: "talent", class: "Arcanoneer", treeId: "sphere_architect",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["arcane"],
      primaryDamage: { dice: "1d8", flat: 0, procChance: 100 },
      visualTheme: "arcane", tags: ["passive", "capstone", "defense", "matrix", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "+2 Durability Steps to equipped durability and 10% resistance per active matrix. Expiring matrices detonate for 2d8 arcane to enemies within.", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 } },
      { description: "+3 Durability Steps to equipped durability and 15% resistance per active matrix. Expiring matrices detonate for 3d8. Crystal Bastion's shield absorbs 25% more damage.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "sa_t7_first_contracts_heir",
    name: "First Contract's Heir",
    icon: "spell_arcane_portal_dalaran",
    maxRanks: 3,
    position: { x: 4, y: 8 },
    requires: "sa_t5_crystal_bastion",
    spell: {
      name: "First Contract's Heir",
      description: "Elemental Convergence costs 1 fewer sphere (minimum 1) and its cooldown is reduced by 30 seconds.",
      flavorText: "Valerius left room in the will. For exactly you.",
      source: "talent", class: "Arcanoneer", treeId: "sphere_architect",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "capstone", "ultimate", "arcanoneer"]
    },
    rankUpgrades: [
      { description: "Elemental Convergence costs 2 fewer spheres, cooldown -60 seconds, and its cast time is halved." },
      { description: "Elemental Convergence costs 3 fewer spheres, cooldown -90 seconds, instant cast, and may be signed twice per combat." }
    ]
  }
];
