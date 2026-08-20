// ============================================
// PLAGUEBRINGER — VIRULENT SPREADER (v3: spec identity redesign)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50.
//
// SPEC IDENTITY: The Wide Epidemic Vector / Swarm Infector.
// While Decay Harbinger focuses all rot into a single catastrophic host,
// Virulent Spreader is about exponential contagion: seeding entire enemy lines,
// detonating contagion crossfire, laying persistent toxic fields, and reaping
// massive AoE harvest payoffs.
//
// SIGNATURE ACTIVES:
//   - Spore Volley (t1):         Launch contagious spores hitting 3 separated targets
//   - Vector Detonation (t2):    Force an infected target to explode in a cloud of seeds
//   - Plague Zone (t4):          Create persistent pathogen ground hazard
//   - Epidemic Surge (t5):       Advance all afflictions across ALL enemies on the field
//   - Global Pandemic (t6):      Duplicate all active plagues to all unaffected foes
//   - Patient Zero (t7):         ULTIMATE — Turn an enemy into a super-spreader bomb
// ============================================

export const PLAGUEBRINGER_VIRULENT_SPREADER = [
  // ──────────────── TIER 1 (8 pts) ────────────────
  {
    id: "vs_t1_spore_volley",
    name: "Spore Volley",
    icon: "ability_creature_poison_06",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Spore Volley",
      description: "Launch a cluster of volatile spores: strikes up to 3 targets within 45 feet, dealing 2d6 blight damage and applying a Stage 1 Seed to each.",
      flavorText: "One row at a time. The whole field, eventually.",
      source: "talent", class: "Plaguebringer", treeId: "virulent_spreader",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "multi", rangeType: "ranged", range: 45,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 6, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 4 } },
      damageTypes: ["blight"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      visualTheme: "poison", tags: ["aoe", "seeds", "spores", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "Strikes up to 4 targets for 2d6 blight damage each and applies Stage 1 Seeds.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } },
      { description: "Strikes up to 5 targets for 2d6 blight damage each, applies Stage 1 Seeds, and generates 2 Virulence.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "vs_t1_rapid_contagion",
    name: "Rapid Contagion",
    icon: "spell_shadow_contagion",
    maxRanks: 3,
    position: { x: 2.5, y: 0 },
    requires: null,
    spell: {
      name: "Rapid Contagion",
      description: "Whenever an affliction spreads to an adjacent target, it deals 1d6 blight damage upon spreading and increases your Virulence by 1.",
      flavorText: "Distance is no cure. Neither is anything else.",
      source: "talent", class: "Plaguebringer", treeId: "virulent_spreader",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["blight"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "poison", tags: ["passive", "spread", "virulence", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "Contagion spreads deal 2d6 blight damage and grant 2 Virulence.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } },
      { description: "Contagion spreads deal 3d6 blight damage, grant 2 Virulence, and have a 30% chance to immediately bounce a second time.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "vs_t1_virulence_surge",
    name: "Airborne Proliferation",
    icon: "ability_creature_disease_05",
    maxRanks: 2,
    position: { x: 4, y: 0 },
    requires: null,
    spell: {
      name: "Airborne Proliferation",
      description: "All your affliction and contagion spread radii are increased by +10 feet. Maximum Virulence increased by 2.",
      flavorText: "Every new host is a dividend.",
      source: "talent", class: "Plaguebringer", treeId: "virulent_spreader",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "poison", tags: ["passive", "radius", "virulence", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "Spread radii increased by +20 feet. Maximum Virulence increased by 4 and you begin combat with 2 Virulence." }
    ]
  },

  // ──────────────── TIER 2 (6 pts) ────────────────
  {
    id: "vs_t2_vector_detonation",
    name: "Vector Detonation",
    icon: "spell_shadow_plaguecloud",
    maxRanks: 3,
    position: { x: 1, y: 1.5 },
    requires: "vs_t1_spore_volley",
    spell: {
      name: "Vector Detonation",
      description: "Spend 2 Virulence: detonate the spores inside an infected target within 45 feet. Deals 3d8 blight damage in a 20-foot radius and forces all victims to gain Stage 1 Seeds.",
      flavorText: "Maturity, in the Peat-Wastes, means leaving home violently.",
      source: "talent", class: "Plaguebringer", treeId: "virulent_spreader",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "ranged", range: 45, aoeShape: "circle", aoeSize: 20,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 10, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { virulence: { baseAmount: 2 } },
      damageTypes: ["blight"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      visualTheme: "poison", tags: ["burst", "aoe", "spread", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "Deals 3d8 blight damage in a 25-foot radius and applies Stage 2 Seeds to all enemies caught in the blast.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 }, aoeSize: 25 },
      { description: "Deals 3d8 blight damage in a 30-foot radius, applies Stage 2 Seeds, and disorients all victims for 1 round.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 }, aoeSize: 30 }
    ]
  },
  {
    id: "vs_t2_chain_infection",
    name: "Chain Contagion",
    icon: "spell_nature_corrosivebreath",
    maxRanks: 3,
    position: { x: 3, y: 1.5 },
    requires: "vs_t1_rapid_contagion",
    spell: {
      name: "Chain Contagion",
      description: "When an infected target takes damage from any source, there is a 35% chance they emit a toxic cough dealing 1d6 blight to all adjacent enemies.",
      flavorText: "The guest list grows itself.",
      source: "talent", class: "Plaguebringer", treeId: "virulent_spreader",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["blight"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 35 },
      visualTheme: "poison", tags: ["passive", "chain", "crossfire", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "50% chance on damaged infected target to emit toxic cough for 2d6 blight damage.", primaryDamage: { dice: "2d6", flat: 0, procChance: 50 } },
      { description: "65% chance on damaged infected target to emit toxic cough for 3d6 blight damage, and each cough restores 1 Virulence to you.", primaryDamage: { dice: "3d6", flat: 0, procChance: 65 } }
    ]
  },

  // ──────────────── TIER 3 (6 pts) ────────────────
  {
    id: "vs_t3_pandemic_wave",
    name: "Pandemic Gale",
    icon: "spell_shadow_contagion",
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: "vs_t2_vector_detonation",
    spell: {
      name: "Pandemic Gale",
      description: "Spend 3 Virulence: summon a 35-foot gust of toxic wind in a cone. Deals 3d8 blight damage and pushes all active afflictions from the closest targets onto every enemy behind them.",
      flavorText: "The wave does not check passports.",
      source: "talent", class: "Plaguebringer", treeId: "virulent_spreader",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 35, aoeShape: "cone", aoeSize: 35,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 16, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { virulence: { baseAmount: 3 } },
      damageTypes: ["blight"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      visualTheme: "poison", tags: ["cone", "spread", "push", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "40-foot cone deals 4d8 blight damage and knocks all affected enemies 10 feet back.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 }, range: 40, aoeSize: 40 },
      { description: "45-foot cone deals 5d8 blight damage, knocks enemies back, and seeds every victim at Stage 2.", primaryDamage: { dice: "5d8", flat: 0, procChance: 100 }, range: 45, aoeSize: 45 }
    ]
  },
  {
    id: "vs_t3_infectious_aura",
    name: "Infectious Miasma",
    icon: "spell_shadow_plaguecloud",
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: "vs_t2_chain_infection",
    spell: {
      name: "Infectious Miasma",
      description: "Enemies within 15 feet of any target carrying an affliction take 1d8 blight damage per turn and cannot regain health above 75%.",
      flavorText: "Proximity is a preexisting condition.",
      source: "talent", class: "Plaguebringer", treeId: "virulent_spreader",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", damageTypes: ["blight"],
      primaryDamage: { dice: "1d8", flat: 0, procChance: 100 },
      visualTheme: "poison", tags: ["passive", "aura", "anti-heal", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "Aura deals 2d8 blight per turn within 20 feet and caps enemy health at 50%.", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 } },
      { description: "Aura deals 3d8 blight per turn within 25 feet, caps enemy health at 50%, and automatically seeds uninfected foes entering the aura.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } }
    ]
  },

  // ──────────────── TIER 4 (5 pts) ────────────────
  {
    id: "vs_t4_plague_zone",
    name: "Plague Zone",
    icon: "spell_shadow_contagion",
    maxRanks: 3,
    position: { x: 1, y: 4.5 },
    requires: "vs_t3_pandemic_wave",
    spell: {
      name: "Plague Zone",
      description: "Spend 3 Virulence: seed a 25-foot radius on the ground for 1 minute. Enemies inside take 2d8 blight damage per round, are slowed by 15 feet, and gain a new Stage 1 Seed every round.",
      flavorText: "Real estate with a pathogen problem.",
      source: "talent", class: "Plaguebringer", treeId: "virulent_spreader",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "aoe", rangeType: "ranged", range: 60, aoeShape: "circle", aoeSize: 25,
      castTimeType: "short", castTimeValue: 1,
      cooldownCategory: "medium", cooldownValue: 24, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: true,
      resourceCosts: { virulence: { baseAmount: 3 }, mana: { baseAmount: 6 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      damageTypes: ["blight"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      debuffs: ["slowed", "seeded"], visualTheme: "poison", tags: ["zone", "terrain", "hazard", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "30-foot zone deals 3d8 blight per round, slows by 20 feet, and reduces enemy durability by -3 while inside.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 }, aoeSize: 30 },
      { description: "35-foot zone deals 4d8 blight per round, prevents enemy dash/teleport, and kills inside grant you 3 Virulence.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 }, aoeSize: 35 }
    ]
  },
  {
    id: "vs_t4_viral_burst",
    name: "Spore Multiplication",
    icon: "spell_fire_selfdestruct",
    maxRanks: 2,
    position: { x: 3.5, y: 4.5 },
    requires: "vs_t3_infectious_aura",
    spell: {
      name: "Spore Multiplication",
      description: "Whenever an afflicted enemy dies, they burst: all enemies within 20 feet take 2d8 blight damage and receive all afflictions the dead host had.",
      flavorText: "Blooming is not an ending. It is a distribution event.",
      source: "talent", class: "Plaguebringer", treeId: "virulent_spreader",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["blight"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      visualTheme: "poison", tags: ["passive", "death-burst", "spread", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "Death burst deals 4d8 blight damage within 25 feet and heals you for 2d8 per enemy struck.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 } }
    ]
  },

  // ──────────────── TIER 5 (5 pts) ────────────────
  {
    id: "vs_t5_epidemic_surge",
    name: "Epidemic Surge",
    icon: "ability_creature_disease_01",
    maxRanks: 2,
    position: { x: 1, y: 6 },
    requires: "vs_t4_plague_zone",
    spell: {
      name: "Epidemic Surge",
      description: "Spend 4 Virulence: instantly advance every active affliction on ALL enemies within 60 feet by 1 full stage, and trigger their stage damage immediately.",
      flavorText: "Reap wide. The field barely noticed the scythe.",
      source: "talent", class: "Plaguebringer", treeId: "virulent_spreader",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 30, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { virulence: { baseAmount: 4 } },
      damageTypes: ["blight"],
      visualTheme: "poison", tags: ["mass-advance", "burst", "aoe", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "Advances all afflictions by 2 stages immediately and staggers all infected targets (they lose 1 action point next turn).", cooldownValue: 24 }
    ]
  },
  {
    id: "vs_t5_strain_banking",
    name: "Pathogen Reservoir",
    icon: "inv_misc_slime_01",
    maxRanks: 3,
    position: { x: 3, y: 6 },
    requires: "vs_t4_viral_burst",
    spell: {
      name: "Pathogen Reservoir",
      description: "Your maximum Virulence increases by 4. Whenever you have 5 or more Virulence, your movement speed is increased by 15 feet and all blight damage you deal is increased by 15%.",
      flavorText: "The vats never sleep. Neither does the accountant.",
      source: "talent", class: "Plaguebringer", treeId: "virulent_spreader",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "poison", tags: ["passive", "virulence", "buff", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "Maximum Virulence +6; +20ft speed and +25% blight damage while at 5+ Virulence." },
      { description: "Maximum Virulence +8; +25ft speed, +35% blight damage, and at 8+ Virulence all your spell cooldowns recharge 50% faster." }
    ]
  },

  // ──────────────── TIER 6 (5 pts) ────────────────
  {
    id: "vs_t6_global_pandemic",
    name: "Global Pandemic",
    icon: "spell_shadow_plaguecloud",
    maxRanks: 1,
    position: { x: 1, y: 7.5 },
    requires: "vs_t5_epidemic_surge",
    spell: {
      name: "Global Pandemic",
      description: "Spend 5 Virulence: copy every active affliction on every infected enemy to ALL uninfected enemies within 80 feet, maintaining their highest active stage.",
      flavorText: "The Peat-Wastes have a word for this. The word is 'Tuesday'.",
      source: "talent", class: "Plaguebringer", treeId: "virulent_spreader",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 80,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 60, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { virulence: { baseAmount: 5 } },
      visualTheme: "poison", tags: ["spread-all", "pandemic", "aoe", "plaguebringer"]
    },
    rankUpgrades: []
  },
  {
    id: "vs_t6_cross_infection",
    name: "Vector Cascade",
    icon: "ability_creature_poison_03",
    maxRanks: 2,
    position: { x: 2.5, y: 7.5 },
    requires: "vs_t5_strain_banking",
    spell: {
      name: "Vector Cascade",
      description: "Whenever an enemy takes damage from an affliction while within 10 feet of another infected enemy, both take an additional 2d6 blight crossfire damage.",
      flavorText: "Crowded rooms make the best laboratories.",
      source: "talent", class: "Plaguebringer", treeId: "virulent_spreader",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["blight"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      visualTheme: "poison", tags: ["passive", "crossfire", "aoe", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "Crossfire radius increases to 15 feet, deals 3d6 blight damage, and each crossfire proc restores 1 Virulence (up to 3 per turn).", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "vs_t6_superbug_mutation",
    name: "Superbug Mutation",
    icon: "spell_shadow_contagion",
    maxRanks: 2,
    position: { x: 4, y: 7.5 },
    requires: "vs_t5_strain_banking",
    spell: {
      name: "Superbug Mutation",
      description: "Your spread afflictions mutate: they reduce enemy movement speed by 25% and reduce all outgoing enemy damage by 15%.",
      flavorText: "The strain has learned to resist therapy.",
      source: "talent", class: "Plaguebringer", treeId: "virulent_spreader",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", visualTheme: "poison", tags: ["passive", "mutation", "debuff", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "Mutated afflictions reduce enemy speed by 40%, reduce enemy damage by 25%, and make targets vulnerable (+20% damage taken) to blight." }
    ]
  },

  // ──────────────── TIER 7 / CAPSTONE (15 pts) ────────────────
  {
    id: "vs_t7_patient_zero",
    name: "Patient Zero",
    icon: "spell_shadow_deathanddecay",
    maxRanks: 1,
    position: { x: 0.5, y: 8 },
    requires: "vs_t6_global_pandemic",
    spell: {
      name: "Patient Zero",
      description: "ULTIMATE: Designate one enemy as Patient Zero for 1 minute: all afflictions on the battlefield constantly pulse out from Patient Zero in a 40-foot aura every round, dealing 4d8 blight damage to all nearby enemies and seeding all victims at Stage 3. If Patient Zero dies, the aura detonates for 10d8 blight across 50 feet.",
      flavorText: "It began with one. It ends with everyone.",
      source: "talent", class: "Plaguebringer", treeId: "virulent_spreader",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "ranged", range: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 180, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { virulence: { baseAmount: 6 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      damageTypes: ["blight"],
      primaryDamage: { dice: "4d8", flat: 0, procChance: 100 },
      debuffs: ["patient-zero"], visualTheme: "poison", tags: ["ultimate", "capstone", "epidemic", "plaguebringer"]
    },
    rankUpgrades: []
  },
  {
    id: "vs_t7_waste_spore_doctrine",
    name: "Waste Spore Doctrine",
    icon: "spell_shadow_darkritual",
    maxRanks: 5,
    position: { x: 1.5, y: 8 },
    requires: "vs_t6_global_pandemic",
    spell: {
      name: "Waste Spore Doctrine",
      description: "The Peat-Wastes bloom without boundary. All blight AoE damage and contagion damage you deal is increased by 10%.",
      flavorText: "The garden has no fence.",
      source: "talent", class: "Plaguebringer", treeId: "virulent_spreader",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["blight"],
      visualTheme: "poison", tags: ["passive", "capstone", "damage", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "All blight AoE and contagion damage increased by 20%." },
      { description: "All blight AoE and contagion damage increased by 35%." },
      { description: "All blight AoE and contagion damage increased by 50%." },
      { description: "All blight AoE and contagion damage increased by 70%, and Spore Volley costs 0 mana." }
    ]
  },
  {
    id: "vs_t7_continuous_blooming",
    name: "Continuous Blooming",
    icon: "ability_creature_poison_06",
    maxRanks: 3,
    position: { x: 2.5, y: 8 },
    requires: "vs_t6_cross_infection",
    spell: {
      name: "Continuous Blooming",
      description: "Whenever 3 or more enemies are infected simultaneously, you generate 2 Virulence at the start of your turn.",
      flavorText: "The garden feeds the gardener constantly.",
      source: "talent", class: "Plaguebringer", treeId: "virulent_spreader",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "poison", tags: ["passive", "capstone", "virulence", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "Generate 4 Virulence at the start of your turn while 3+ enemies are infected, and your movement speed increases by +15ft." },
      { description: "Generate 6 Virulence per turn while 3+ enemies are infected. Plague Zone duration is doubled." }
    ]
  },
  {
    id: "vs_t7_plague_wind",
    name: "Pandemic Overdrive",
    icon: "spell_nature_cyclone",
    maxRanks: 3,
    position: { x: 3.5, y: 8 },
    requires: "vs_t6_cross_infection",
    spell: {
      name: "Pandemic Overdrive",
      description: "All contagion spread procs have their ranges doubled, and contagion spread damage crits on 18+.",
      flavorText: "A wind that leaves nothing untouched.",
      source: "talent", class: "Plaguebringer", treeId: "virulent_spreader",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", visualTheme: "poison", tags: ["passive", "capstone", "range", "crit", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "Spread ranges doubled, crits on 17+, and contagion crits knock enemies back 5 feet." },
      { description: "Spread ranges tripled, crits on 16+, and each contagion crit refunds 1 Virulence." }
    ]
  },
  {
    id: "vs_t7_spore_carrier",
    name: "Living Pathogen",
    icon: "ability_creature_disease_02",
    maxRanks: 3,
    position: { x: 4.5, y: 8 },
    requires: "vs_t6_superbug_mutation",
    spell: {
      name: "Living Pathogen",
      description: "You emit a 15-foot passive pathogen aura: all enemies inside take 2d6 blight damage per round and you heal for all damage dealt by the aura.",
      flavorText: "You are the epidemic now.",
      source: "talent", class: "Plaguebringer", treeId: "virulent_spreader",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["blight"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      visualTheme: "poison", tags: ["passive", "capstone", "aura", "sustain", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "Aura radius 20 feet, deals 3d6 blight damage per round, and heals you for 100% of damage dealt.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } },
      { description: "Aura radius 25 feet, deals 4d6 blight damage per round, heals you for 100%, and enemies inside have their damage reduced by 25%.", primaryDamage: { dice: "4d6", flat: 0, procChance: 100 } }
    ]
  }
];
