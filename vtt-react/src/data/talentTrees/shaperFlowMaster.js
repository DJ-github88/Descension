// ============================================
// SHAPER — FLOW MASTER (v3: spec identity redesign)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50.
//
// SPEC IDENTITY: The Form-Shifting Fluidist / Kinetic Momentum Master.
// While Iron Dancer focuses on heavy stone stances and Primal Shadow on stealth ambush,
// Flow Master turns the Shaper into a mercurial kinetic dancer who seamlessly weaves
// between animal and elemental forms, accumulating massive Kinetic Flux, dodging blows
// in water-stance, chaining multi-form combos, and moving like a roaring river.
//
// SIGNATURE ACTIVES:
//   - Fluid Transition (t1):    Instant zero-friction stance shift that grants Kinetic Flux
//   - Water Dance (t1):         Active evasion dodge redirecting attacker momentum
//   - Cascading Current (t2):   Multi-hit form combo strike generating Flux
//   - Confluence Strike (t3):   Unleash combined features of 2 forms in a single attack
//   - Mist Slip (t4):           Teleport through enemy lines as vapor and sunder defenses
//   - Water Ascendant (t6):     Transform into an invulnerable kinetic water elemental
//   - Living Cataract (t7):     ULTIMATE — Become a torrential kinetic tsunami crushing the battlefield
// ============================================

export const SHAPER_FLOW_MASTER = [
  // ──────────────── TIER 1 (8 pts) ────────────────
  {
    id: "fm_t1_fluid_transition",
    name: "Fluid Transition",
    icon: "spell_nature_riptide",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Fluid Transition",
      description: "Instantly transition into any unlocked shapeshift form without paying Body Toll: gain 2 Kinetic Flux and +10ft movement speed for 1 round.",
      flavorText: "The current does not ask which way. It knows.",
      source: "talent", class: "Shaper", treeId: "flow_master",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 4, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { kineticFlux: { baseAmount: 0 } },
      buffs: ["fluid-haste"], visualTheme: "primal", tags: ["shift", "flux", "mobility", "shaper"]
    },
    rankUpgrades: [
      { description: "Gain 3 Kinetic Flux, +15ft movement speed, and your next form attack deals +2d6 bonus physical damage.", cooldownValue: 3 },
      { description: "Gain 4 Kinetic Flux, +20ft speed, next attack deals +3d6 damage and can be used twice per round.", cooldownValue: 2 }
    ]
  },
  {
    id: "fm_t1_water_dance",
    name: "Water Dance Dodge",
    icon: "spell_nature_resistnature",
    maxRanks: 3,
    position: { x: 2.5, y: 0 },
    requires: null,
    spell: {
      name: "Water Dance Dodge",
      description: "Reaction (spend 1 Flux): when targeted by an attack or spell, become liquid and automatically dodge the attack, moving up to 10 feet in any direction without provoking opportunity attacks.",
      flavorText: "You are already elsewhere. You were always already elsewhere.",
      source: "talent", class: "Shaper", treeId: "flow_master",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 8, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { kineticFlux: { baseAmount: 1 } },
      buffs: ["dodge"], visualTheme: "primal", tags: ["reaction", "evasion", "mobility", "shaper"]
    },
    rankUpgrades: [
      { description: "Dodge moves up to 15 feet, grants you 2 Flux, and cooldown drops to 6s.", cooldownValue: 6 },
      { description: "Dodge moves up to 20 feet, grants 3 Flux, resets Fluid Transition cooldown, and can be used on area effects.", cooldownValue: 4 }
    ]
  },
  {
    id: "fm_t1_momentum_flow",
    name: "Momentum Reserve",
    icon: "spell_nature_swiftness",
    maxRanks: 2,
    position: { x: 4, y: 0 },
    requires: null,
    spell: {
      name: "Momentum Reserve",
      description: "Your Kinetic Flux decays 50% slower, and you gain +1 Durability Steps to equipped durability for every 3 Flux you currently maintain.",
      flavorText: "The bridge remembers every crossing.",
      source: "talent", class: "Shaper", treeId: "flow_master",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "flux", "durability", "shaper"]
    },
    rankUpgrades: [
      { description: "Flux does not decay outside of combat; gain +1 Durability Steps to equipped durability and +5% all-damage resistance for every 2 Flux maintained." }
    ]
  },

  // ──────────────── TIER 2 (6 pts) ────────────────
  {
    id: "fm_t2_cascading_current",
    name: "Cascading Current",
    icon: "spell_nature_chainlightning",
    maxRanks: 3,
    position: { x: 1, y: 1.5 },
    requires: "fm_t1_fluid_transition",
    spell: {
      name: "Cascading Current",
      description: "Spend 2 Flux: unleash a rapid 3-strike form combination against a target within 10 feet. Deals 2d8 slicing damage, generates 2 Flux, and transitions you into a complementary form automatically.",
      flavorText: "Two moves, one breath.",
      source: "talent", class: "Shaper", treeId: "flow_master",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "melee", range: 10,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 8, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { kineticFlux: { baseAmount: 2 } },
      damageTypes: ["slicing"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      visualTheme: "primal", tags: ["combo", "melee", "flux-builder", "shaper"]
    },
    rankUpgrades: [
      { description: "Deals 3d8 slicing damage, generates 3 Flux, and pierces 20% of enemy durability.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } },
      { description: "Deals 4d8 slicing damage, generates 3 Flux, pierces 40% of enemy durability, and knocks target prone.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "fm_t2_combo_weaving",
    name: "Combo Weaving",
    icon: "ability_rogue_combatreadiness",
    maxRanks: 3,
    position: { x: 3, y: 1.5 },
    requires: "fm_t1_water_dance",
    spell: {
      name: "Combo Weaving",
      description: "Whenever you transition forms in combat, your next attack within 1 round deals +2d6 bonus damage and refunds 1 Action Point (once per turn).",
      flavorText: "One sentence, three forms, no punctuation.",
      source: "talent", class: "Shaper", treeId: "flow_master",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "combo", "action-economy", "shaper"]
    },
    rankUpgrades: [
      { description: "Form transitions give +3d6 bonus damage, refund 1 AP, and increase critical chance by 10%." },
      { description: "Form transitions give +4d6 bonus damage, refund 1 AP twice per turn, and increase critical chance by 15%." }
    ]
  },

  // ──────────────── TIER 3 (6 pts) ────────────────
  {
    id: "fm_t3_confluence_strike",
    name: "Confluence Strike",
    icon: "spell_nature_riptide",
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: "fm_t2_cascading_current",
    spell: {
      name: "Confluence Strike",
      description: "Spend 4 Flux: blend two active forms into a single devastating hybrid attack. Deals 2d8 smashing and rime damage in a 15-foot line, knocking all enemies back 15 feet.",
      flavorText: "The rivers meet. Something pours out.",
      source: "talent", class: "Shaper", treeId: "flow_master",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "line", aoeSize: 15,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 10, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { kineticFlux: { baseAmount: 4 } },
      damageTypes: ["smashing", "rime"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      visualTheme: "primal", tags: ["hybrid", "aoe-line", "knockback", "shaper"]
    },
    rankUpgrades: [
      { description: "25-foot line deals 3d8 smashing/rime damage, knocks enemies 20ft back, and freezes them for 1 round.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 }, aoeSize: 25 },
      { description: "35-foot line deals 4d8 smashing/rime damage, knocks enemies 20ft back, freezes for 1 round, and can be recast immediately for 0 Flux if it hits 2+ enemies.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 }, aoeSize: 35 }
    ]
  },
  {
    id: "fm_t3_liquid_motion",
    name: "Liquid Motion",
    icon: "spell_nature_giftofthewaterspirit",
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: "fm_t2_combo_weaving",
    spell: {
      name: "Liquid Motion",
      description: "While at 4 or more Flux, your movement speed increases by +15 feet, you can move freely through enemy spaces, and difficult terrain does not hinder you.",
      flavorText: "Crowds are just slow water.",
      source: "talent", class: "Shaper", treeId: "flow_master",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "mobility", "shaper"]
    },
    rankUpgrades: [
      { description: "+20ft movement at 4+ Flux; passing through an enemy space deals 2d6 cold damage to them." },
      { description: "+25ft movement at 3+ Flux; passing through enemies deals 3d6 cold damage, slows them by 15ft, and grants you 1 Flux per enemy passed." }
    ]
  },

  // ──────────────── TIER 4 (5 pts) ────────────────
  {
    id: "fm_t4_mist_slip",
    name: "Mist Slip",
    icon: "spell_nature_astralrecal",
    maxRanks: 3,
    position: { x: 1, y: 4.5 },
    requires: "fm_t3_confluence_strike",
    spell: {
      name: "Mist Slip",
      description: "Spend 3 Flux: dissolve into mist and teleport up to 35 feet to an unoccupied space. Reforming behind an enemy grants advantage on attacks and sunders their durability by -3 for 2 rounds.",
      flavorText: "The apex of fluidity is being several places at once.",
      source: "talent", class: "Shaper", treeId: "flow_master",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "single", rangeType: "ranged", range: 35,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 14, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { kineticFlux: { baseAmount: 3 } },
      buffs: ["mist-ambush"], visualTheme: "primal", tags: ["teleport", "sunder", "mobility", "shaper"]
    },
    rankUpgrades: [
      { description: "Teleport up to 45 feet, sunder durability by -5, and deals 3d8 cold damage to all enemies around your arrival point.", cooldownValue: 10 },
      { description: "Teleport up to 60 feet, sunder durability by -6, deals 4d8 cold damage, and leaves behind a decoy mist that explodes for 4d8 cold when struck.", cooldownValue: 8 }
    ]
  },
  {
    id: "fm_t4_toll_dancer",
    name: "Toll Absorption",
    icon: "spell_nature_skinofearth",
    maxRanks: 2,
    position: { x: 3.5, y: 4.5 },
    requires: "fm_t3_liquid_motion",
    spell: {
      name: "Toll Absorption",
      description: "Your body thrives on transformation: every form transition heals you for 2d6 health and restores 1 Action Point.",
      flavorText: "The bridge holds. The bridge has practice.",
      source: "talent", class: "Shaper", treeId: "flow_master",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "self",
      healing: { dice: "2d6", flat: 0 },
      visualTheme: "primal", tags: ["passive", "sustain", "action-economy", "shaper"]
    },
    rankUpgrades: [
      { description: "Form transitions heal for 4d6 health, restore 1 AP, and grant +2 Durability Steps to equipped durability (stacks up to +6).", healing: { dice: "4d6", flat: 0 } }
    ]
  },

  // ──────────────── TIER 5 (5 pts) ────────────────
  {
    id: "fm_t5_torrential_barrage",
    name: "Torrential Barrage",
    icon: "spell_nature_riptide",
    maxRanks: 2,
    position: { x: 1, y: 6 },
    requires: "fm_t4_mist_slip",
    spell: {
      name: "Torrential Barrage",
      description: "Spend 5 Flux: unleash a torrential flurry of 5 kinetic strikes against enemies within 15 feet. Deals 6d10 smashing/rime damage total, split among targets or focused on one, and knocks all targets prone.",
      flavorText: "Standing water is just a river that lost an argument.",
      source: "talent", class: "Shaper", treeId: "flow_master",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "multi", rangeType: "melee", range: 15,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 24, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { kineticFlux: { baseAmount: 5 } },
      damageTypes: ["smashing", "rime"],
      primaryDamage: { dice: "6d10", flat: 0, procChance: 100 },
      debuffs: ["knockdown"], visualTheme: "primal", tags: ["flurry", "burst", "multi-hit", "shaper"]
    },
    rankUpgrades: [
      { description: "Deals 8d10 total damage across 6 strikes, stuns all hit targets for 1 round, and refunds 2 Flux.", primaryDamage: { dice: "8d10", flat: 0, procChance: 100 }, cooldownValue: 18 }
    ]
  },
  {
    id: "fm_t5_eternal_current",
    name: "Eternal Momentum",
    icon: "spell_nature_giftofthewaterspirit",
    maxRanks: 3,
    position: { x: 3, y: 6 },
    requires: "fm_t4_toll_dancer",
    spell: {
      name: "Eternal Momentum",
      description: "Your Kinetic Flux cannot decay below 4 in combat. While at 6 or more Flux, all your physical damage is increased by 25% and you gain 15% lifesteal.",
      flavorText: "Every wave adds to the permanent tide.",
      source: "talent", class: "Shaper", treeId: "flow_master",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "flux-floor", "lifesteal", "shaper"]
    },
    rankUpgrades: [
      { description: "Flux cannot decay below 6; +35% physical damage and 25% lifesteal at 6+ Flux." },
      { description: "Flux cannot decay below 8; +50% physical damage, 35% lifesteal, and you take 20% less damage from all sources." }
    ]
  },

  // ──────────────── TIER 6 (5 pts) ────────────────
  {
    id: "fm_t6_water_ascendant",
    name: "Water Ascendant",
    icon: "spell_nature_acid_01",
    maxRanks: 1,
    position: { x: 1, y: 7.5 },
    requires: "fm_t5_torrential_barrage",
    spell: {
      name: "Water Ascendant",
      description: "Spend 6 Flux: transform into a living kinetic elemental for 1 minute: you take 40% less physical and magical damage, and you can teleport 30 feet as a free action once per turn.",
      flavorText: "Try to grasp a river. The river files a complaint.",
      source: "talent", class: "Shaper", treeId: "flow_master",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 90, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { kineticFlux: { baseAmount: 6 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      buffs: ["water-ascendant"], visualTheme: "primal", tags: ["transform", "invulnerability", "teleport", "shaper"]
    },
    rankUpgrades: []
  },
  {
    id: "fm_t6_fluvial_mastery",
    name: "Fluvial Reflexes",
    icon: "ability_rogue_quickrecovery",
    maxRanks: 2,
    position: { x: 2.5, y: 7.5 },
    requires: "fm_t5_eternal_current",
    spell: {
      name: "Fluvial Reflexes",
      description: "You gain 1 additional reaction per round. Water Dance Dodge can be used without spending Flux.",
      flavorText: "Reflexes that flow faster than conscious thought.",
      source: "talent", class: "Shaper", treeId: "flow_master",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "reaction", "evasion", "shaper"]
    },
    rankUpgrades: [
      { description: "Gain 2 additional reactions per round; dodging an attack immediately triggers a free retaliation strike." }
    ]
  },
  {
    id: "fm_t6_chimeric_perfection",
    name: "Chimeric Flow",
    icon: "spell_nature_astralrecal",
    maxRanks: 2,
    position: { x: 4, y: 7.5 },
    requires: "fm_t5_eternal_current",
    spell: {
      name: "Chimeric Flow",
      description: "You may blend up to THREE forms simultaneously without penalty, gaining all passive bonuses and features of all 3 forms.",
      flavorText: "Three bodies, one sovereign consciousness.",
      source: "talent", class: "Shaper", treeId: "flow_master",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "triple-form", "shaper"]
    },
    rankUpgrades: [
      { description: "Blend 3 forms freely; all form abilities deal +30% damage and cost 1 less Flux." }
    ]
  },

  // ──────────────── TIER 7 / CAPSTONE (15 pts) ────────────────
  {
    id: "fm_t7_living_cataract",
    name: "The Living Cataract",
    icon: "spell_nature_unrelentingstorm",
    maxRanks: 1,
    position: { x: 0.5, y: 8 },
    requires: "fm_t6_water_ascendant",
    spell: {
      name: "The Living Cataract",
      description: "ULTIMATE: Spend 8 Flux: summon the torrential fury of the primordial flood for 1 minute: a 40-foot kinetic tsunami surrounds you. Deals 5d10 rime/smashing damage per round to all enemies, knocks all enemies prone each round, and whenever you transition forms, a shockwave deals 4d10 damage to all foes.",
      flavorText: "The river does not stop for mountains. It erodes them.",
      source: "talent", class: "Shaper", treeId: "flow_master",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 40,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 180, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { kineticFlux: { baseAmount: 8 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      damageTypes: ["rime", "smashing"],
      primaryDamage: { dice: "5d10", flat: 0, procChance: 100 },
      buffs: ["living-cataract"], visualTheme: "primal", tags: ["ultimate", "capstone", "tsunami", "shaper"]
    },
    rankUpgrades: []
  },
  {
    id: "fm_t7_flow_doctrine",
    name: "Flow Master Doctrine",
    icon: "spell_nature_riptide",
    maxRanks: 5,
    position: { x: 1.5, y: 8 },
    requires: "fm_t6_water_ascendant",
    spell: {
      name: "Flow Master Doctrine",
      description: "The current cannot be halted. All physical, cold, and form ability damage you deal is increased by 10%.",
      flavorText: "Water shaped by will is sharper than steel.",
      source: "talent", class: "Shaper", treeId: "flow_master",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["physical", "frost"],
      visualTheme: "primal", tags: ["passive", "capstone", "damage", "shaper"]
    },
    rankUpgrades: [
      { description: "All form and physical damage increased by 20%." },
      { description: "All form and physical damage increased by 35%." },
      { description: "All form and physical damage increased by 50%." },
      { description: "All form and physical damage increased by 70%, and Fluid Transition grants 6 Flux." }
    ]
  },
  {
    id: "fm_t7_infinite_flux",
    name: "Infinite Flux Reservoir",
    icon: "spell_nature_chainlightning",
    maxRanks: 3,
    position: { x: 2.5, y: 8 },
    requires: "fm_t6_fluvial_mastery",
    spell: {
      name: "Infinite Flux Reservoir",
      description: "Your maximum Kinetic Flux increases by 5. At the start of every combat turn, you generate 3 Kinetic Flux.",
      flavorText: "An ocean in a teacup, constantly spilling over.",
      source: "talent", class: "Shaper", treeId: "flow_master",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "capstone", "flux-engine", "shaper"]
    },
    rankUpgrades: [
      { description: "Maximum Flux +8; generate 5 Flux per turn and movement speed +15ft." },
      { description: "Maximum Flux +12; generate 7 Flux per turn and your form ability cooldowns recover twice as fast." }
    ]
  },
  {
    id: "fm_t7_tidal_crit",
    name: "Hydrokinetic Crits",
    icon: "spell_nature_swiftness",
    maxRanks: 3,
    position: { x: 3.5, y: 8 },
    requires: "fm_t6_fluvial_mastery",
    spell: {
      name: "Hydrokinetic Crits",
      description: "All your attacks in animal and elemental forms score critical hits on 18+ and critical hits refund 2 Flux.",
      flavorText: "Striking where the water finds the flaw.",
      source: "talent", class: "Shaper", treeId: "flow_master",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "capstone", "crit", "shaper"]
    },
    rankUpgrades: [
      { description: "Crits on 17+; crits refund 3 Flux and deal +50% critical bonus damage." },
      { description: "Crits on 16+; crits refund 4 Flux, deal double crit damage, and immediately reset Mist Slip cooldown." }
    ]
  },
  {
    id: "fm_t7_undying_tide",
    name: "Undying Fluidity",
    icon: "spell_nature_resistnature",
    maxRanks: 3,
    position: { x: 4.5, y: 8 },
    requires: "fm_t6_chimeric_perfection",
    spell: {
      name: "Undying Fluidity",
      description: "While at 5+ Flux, lethal damage dissolves you into vapor instead, preventing death, restoring 50% health, and teleporting you 30 feet away (cooldown: 120s).",
      flavorText: "You cannot kill what has no fixed shape.",
      source: "talent", class: "Shaper", treeId: "flow_master",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "capstone", "cheat-death", "shaper"]
    },
    rankUpgrades: [
      { description: "Survive lethal damage, restore 75% health, teleport 45 feet, and immediately gain full Flux (cooldown: 90s)." },
      { description: "Survive lethal damage, restore 100% health, teleport 60 feet, gain full Flux, and trigger Torrential Barrage automatically for free (cooldown: 60s)." }
    ]
  }
];
