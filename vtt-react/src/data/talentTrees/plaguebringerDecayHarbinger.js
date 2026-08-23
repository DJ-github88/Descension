// ============================================
// PLAGUEBRINGER — DECAY HARBINGER (v3: spec identity redesign)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50.
//
// SPEC IDENTITY: The Deep Single-Target Stacker / Necrotic Cultivator.
// While Virulent Spreader blankets entire armies in shallow contagion, and
// Torment Weaver links psychic misery across foes, Decay Harbinger chooses ONE
// priority target and cultivates catastrophic, permanent necrotic stacks into them.
// Your afflictions never end — they only deepen until the host collapses into soil.
//
// SIGNATURE ACTIVES:
//   - Cultivate Rot (t1):        Actively inject and accelerate permanent decay stacks
//   - Withering Siphon (t2):     Channel vitality directly out of stacked target
//   - Rupture Cyst (t3):         Detonate stacked decay for targeted execute damage
//   - Organ Collapse (t4):       Force all permanent stacks to tick instantly at triple speed
//   - Miasmic Shroud (t5):       Defensive rot barrier powered by target's decay stacks
//   - Apocalyptic Decay (t6):    Erupt target's deep stacks onto all nearby enemies
//   - The Deep Garden (t7):      ULTIMATE — Turn priority enemy into an infinite-stack heartwood
// ============================================

export const PLAGUEBRINGER_DECAY_HARBINGER = [
  // ──────────────── TIER 1 (8 pts) ────────────────
  {
    id: "dh_t1_cultivate_rot",
    name: "Cultivate Rot",
    icon: "spell_shadow_contagion",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Cultivate Rot",
      description: "Inject concentrated peat-rot into a target within 40 feet: deals 2d6 blight damage and applies 2 permanent Decay Stacks (max 10). Permanent stacks deal 1d4 blight damage per round and do not expire.",
      flavorText: "Other gardens harvest. This one only deepens.",
      source: "talent", class: "Plaguebringer", treeId: "decay_harbinger",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "ranged", range: 40,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 6, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 4 } },
      damageTypes: ["blight"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      isDot: true, dotDuration: 99, dotTick: "1d4",
      visualTheme: "poison", tags: ["decay", "dot", "stacks", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "Deals 3d6 blight damage, applies 3 permanent Decay Stacks (max 15), and stacks tick for 1d6 blight each.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 }, dotTick: "1d6" },
      { description: "Deals 3d6 blight damage, applies 4 permanent Decay Stacks (max 20), and ticks heal you for 10 points of damage dealt.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 }, dotTick: "1d8" }
    ]
  },
  {
    id: "dh_t1_infinite_growth",
    name: "Infinite Rooting",
    icon: "spell_shadow_deathanddecay",
    maxRanks: 3,
    position: { x: 2.5, y: 0 },
    requires: null,
    spell: {
      name: "Infinite Rooting",
      description: "Whenever an enemy with Decay Stacks takes blight damage from any spell, apply +1 permanent Decay Stack (up to stack cap).",
      flavorText: "Time is on the rot's side. It always was.",
      source: "talent", class: "Plaguebringer", treeId: "decay_harbinger",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", visualTheme: "poison", tags: ["passive", "stacks", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "Blight spells apply +2 permanent Decay Stacks. When an enemy reaches 5 stacks, you gain 2 Virulence." },
      { description: "Blight spells apply +2 stacks. At 5, 10, and 15 stacks, you gain 3 Virulence and the target's movement speed drops by 10ft." }
    ]
  },
  {
    id: "dh_t1_dark_rejuvenation",
    name: "Dark Rejuvenation",
    icon: "spell_shadow_darkritual",
    maxRanks: 2,
    position: { x: 4, y: 0 },
    requires: null,
    spell: {
      name: "Dark Rejuvenation",
      description: "Whenever you apply a Decay Stack, heal for 1d4 health, and the target's healing received is reduced by 10% for 2 rounds (stacks up to 50%).",
      flavorText: "Their ending is your continuing.",
      source: "talent", class: "Plaguebringer", treeId: "decay_harbinger",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "self",
      healing: { dice: "1d4", flat: 0 },
      visualTheme: "poison", tags: ["passive", "lifesteal", "anti-heal", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "Applying stacks heals for 2d4 health. Target healing reduction stacks up to 80 points and reduces their durability by -2.", healing: { dice: "2d4", flat: 0 } }
    ]
  },

  // ──────────────── TIER 2 (6 pts) ────────────────
  {
    id: "dh_t2_withering_siphon",
    name: "Withering Siphon",
    icon: "spell_shadow_soulleech",
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: "dh_t1_cultivate_rot",
    spell: {
      name: "Withering Siphon",
      description: "Spend 2 Virulence: channel necrotic threads into a target with Decay Stacks for 3 rounds. Deals 1d8 blight damage per 2 Decay Stacks on the target each round, healing you for the full amount.",
      flavorText: "The vine learns the healer's knot and unties it.",
      source: "talent", class: "Plaguebringer", treeId: "decay_harbinger",
      spellType: "ACTIVE", category: "healing",
      targetingMode: "single", rangeType: "ranged", range: 45,
      castTimeType: "channeled", castTimeValue: 3,
      cooldownCategory: "short", cooldownValue: 12, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: true,
      resourceCosts: { virulence: { baseAmount: 2 } },
      damageTypes: ["blight"],
      primaryDamage: { dice: "1d8", flat: 0, procChance: 100 },
      visualTheme: "poison", tags: ["channel", "lifesteal", "execute", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "Deals 1d10 blight per 2 Decay Stacks each round, heals you for 100 points, and slows the target by 50 points while channeling.", primaryDamage: { dice: "1d10", flat: 0, procChance: 100 } },
      { description: "Deals 1d12 blight per 2 Decay Stacks each round. Can be channeled while moving, and target is immobilized while channeling.", primaryDamage: { dice: "1d12", flat: 0, procChance: 100 }, usableWhileMoving: true }
    ]
  },
  {
    id: "dh_t2_necrotic_burst",
    name: "Necrotic Cyst",
    icon: "spell_shadow_deathanddecay",
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: "dh_t1_infinite_growth",
    spell: {
      name: "Necrotic Cyst",
      description: "When a target reaches 5 permanent Decay Stacks, a necrotic cyst bursts: deals 3d8 blight damage in a 15-foot radius and applies 2 Decay Stacks to all enemies hit.",
      flavorText: "Pressure builds. The vessel disagrees.",
      source: "talent", class: "Plaguebringer", treeId: "decay_harbinger",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["blight"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      visualTheme: "poison", tags: ["passive", "burst", "aoe", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "Cyst bursts at 5 and 10 stacks for 3d8 blight damage in 20 feet, and burst heals you for 2d8.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } },
      { description: "Cyst bursts at 5, 10, and 15 stacks for 3d8 blight damage, stuns adjacent foes for 1 round, and restores 3 Virulence.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } }
    ]
  },

  // ──────────────── TIER 3 (6 pts) ────────────────
  {
    id: "dh_t3_rupture_cyst",
    name: "Rupture Cyst",
    icon: "spell_shadow_corpseexplode",
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: "dh_t2_withering_siphon",
    spell: {
      name: "Rupture Cyst",
      description: "Spend 3 Virulence: detonate the decay inside your target. Deals 1d10 blight damage PER permanent Decay Stack on the target (does not consume the stacks).",
      flavorText: "Everything you planted flowers at once.",
      source: "talent", class: "Plaguebringer", treeId: "decay_harbinger",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "ranged", range: 45,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 10, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { virulence: { baseAmount: 3 } },
      damageTypes: ["blight"],
      primaryDamage: { dice: "1d10", flat: 0, procChance: 100 },
      visualTheme: "poison", tags: ["burst", "nuke", "single-target", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "Deals 1d12 blight damage per stack. If the target has 8+ stacks, Rupture Cyst scores a critical hit automatically.", primaryDamage: { dice: "1d12", flat: 0, procChance: 100 } },
      { description: "Deals 2d8 blight damage per stack. Automatically crits at 6+ stacks and resets Cultivate Rot's cooldown.", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "dh_t3_withering_aura",
    name: "Withering Atmosphere",
    icon: "spell_shadow_plaguecloud",
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: "dh_t2_necrotic_burst",
    spell: {
      name: "Withering Atmosphere",
      description: "Targets with 5+ Decay Stacks emit a 20-foot rotting mire: enemies inside take 1d6 blight damage per turn and have their saving throws reduced by -2.",
      flavorText: "Heavy carriers glow with it. Badly.",
      source: "talent", class: "Plaguebringer", treeId: "decay_harbinger",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", damageTypes: ["blight"],
      visualTheme: "poison", tags: ["passive", "aura", "debuff", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "Rotting mire deals 2d6 blight per turn, reduces saves by -3, and prevents affected enemies from receiving outside healing." },
      { description: "Rotting mire deals 3d6 blight per turn, -4 to saves, prevents healing, and enemies inside accumulate 1 Decay Stack every 2 rounds." }
    ]
  },

  // ──────────────── TIER 4 (5 pts) ────────────────
  {
    id: "dh_t4_organ_collapse",
    name: "Organ Collapse",
    icon: "spell_shadow_curseofsargeras",
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: "dh_t3_rupture_cyst",
    spell: {
      name: "Organ Collapse",
      description: "Spend 4 Virulence: force all Decay Stacks on the target to instantly tick 2 times in rapid succession. The target is crippled (disadvantage on all rolls) for 2 rounds.",
      flavorText: "A year of decomposition in a heartbeat.",
      source: "talent", class: "Plaguebringer", treeId: "decay_harbinger",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "ranged", range: 45,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 20, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { virulence: { baseAmount: 4 } },
      debuffs: ["crippled"], damageTypes: ["blight"],
      visualTheme: "poison", tags: ["burst", "tick-acceleration", "debuff", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "Forces Decay Stacks to tick 3 times instantly, and target is incapacitated for 1 round." },
      { description: "Forces Decay Stacks to tick 3 times instantly, target is incapacitated for 1 round, and you heals for for 3d8 Hit Points." }
    ]
  },
  {
    id: "dh_t4_vampiric_decay",
    name: "Symbiotic Rot",
    icon: "spell_shadow_lifedrain02",
    maxRanks: 2,
    position: { x: 3.5, y: 3 },
    requires: "dh_t3_withering_aura",
    spell: {
      name: "Symbiotic Rot",
      description: "Whenever your target takes damage from Decay Stacks, you gain 3 temporary health per stack on them (up to 30 temp HP).",
      flavorText: "The rot gives back. Reluctantly, but fully.",
      source: "talent", class: "Plaguebringer", treeId: "decay_harbinger",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "poison", tags: ["passive", "shield", "sustain", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "Gain 5 temporary health per stack (up to 60 temp HP), and your durability increases by +1 per 5 stacks on your target." }
    ]
  },

  // ──────────────── TIER 5 (5 pts) ────────────────
  {
    id: "dh_t5_miasmic_shroud",
    name: "Miasmic Shroud",
    icon: "spell_shadow_nethercloak",
    maxRanks: 2,
    position: { x: 1, y: 4 },
    requires: "dh_t4_organ_collapse",
    spell: {
      name: "Miasmic Shroud",
      description: "Spend 3 Virulence: shroud yourself in vaporized rot for 1 minute. You gain +3 Durability Steps to equipped durability and 4 Damage Reduction against all-damage. Attackers who strike you in melee immediately gain 2 permanent Decay Stacks.",
      flavorText: "Court is held in the rot. All rise. Most cannot.",
      source: "talent", class: "Plaguebringer", treeId: "decay_harbinger",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 30, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { virulence: { baseAmount: 3 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      buffs: ["miasmic-shroud"], visualTheme: "poison", tags: ["defense", "retaliation", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "Gain +4 Durability Steps to equipped durability, 6 Damage Reduction, and attackers in melee gain 3 Decay Stacks and take 2d8 blight damage.", cooldownValue: 24 }
    ]
  },
  {
    id: "dh_t5_total_collapse",
    name: "Corpse Bloom",
    icon: "spell_shadow_deathanddecay",
    maxRanks: 3,
    position: { x: 3, y: 4 },
    requires: "dh_t4_vampiric_decay",
    spell: {
      name: "Corpse Bloom",
      description: "When an enemy with 5+ Decay Stacks dies, they erupt in a corpse bloom: deals 4d8 blight damage to all enemies within 20 feet and transfers all their Decay Stacks divided among the survivors.",
      flavorText: "The tower falls outward.",
      source: "talent", class: "Plaguebringer", treeId: "decay_harbinger",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["blight"],
      primaryDamage: { dice: "4d8", flat: 0, procChance: 100 },
      visualTheme: "poison", tags: ["passive", "death-spread", "burst", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "Corpse bloom deals 5d8 blight damage in 25 feet, grants you 5 Virulence, and heals you 3d8.", primaryDamage: { dice: "5d8", flat: 0, procChance: 100 } },
      { description: "Corpse bloom deals 6d8 blight damage in 30 feet, fully restores your Virulence, and survivors are stunned for 1 round.", primaryDamage: { dice: "6d8", flat: 0, procChance: 100 } }
    ]
  },

  // ──────────────── TIER 6 (5 pts) ────────────────
  {
    id: "dh_t6_apocalyptic_decay",
    name: "Apocalyptic Decay",
    icon: "spell_shadow_deathanddecay",
    maxRanks: 1,
    position: { x: 1, y: 5 },
    requires: "dh_t5_miasmic_shroud",
    spell: {
      name: "Apocalyptic Decay",
      description: "Spend 5 Virulence: copy all Decay Stacks currently on your primary target onto ALL enemies within 30 feet of it. For 3 rounds, all your single-target decay spells hit every stacked enemy simultaneously.",
      flavorText: "Deep is a direction. Wide is also available, apparently.",
      source: "talent", class: "Plaguebringer", treeId: "decay_harbinger",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 60, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { virulence: { baseAmount: 5 } },
      durationRounds: 3, durationRealTime: 18, durationUnit: "seconds",
      buffs: ["apocalyptic-decay"], visualTheme: "poison", tags: ["empower", "aoe-stacks", "plaguebringer"]
    },
    rankUpgrades: []
  },
  {
    id: "dh_t6_deep_rooted",
    name: "Deep-Rooted Weeds",
    icon: "spell_nature_corrosivebreath",
    maxRanks: 2,
    position: { x: 2.5, y: 5 },
    requires: "dh_t5_total_collapse",
    spell: {
      name: "Deep-Rooted Weeds",
      description: "Your Decay Stacks cannot be cleansed, dispelled, or transferred by any magic short of divine intervention. Any dispel attempt deals 3d8 blight damage to the caster.",
      flavorText: "Weeds, professionally installed.",
      source: "talent", class: "Plaguebringer", treeId: "decay_harbinger",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["blight"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      visualTheme: "poison", tags: ["passive", "dispel-punish", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "Dispel attempts deal 5d8 blight damage, add +3 permanent stacks to the target, and silence the caster for 1 round.", primaryDamage: { dice: "5d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "dh_t6_rot_memory",
    name: "Rot Memory",
    icon: "spell_shadow_grimward",
    maxRanks: 2,
    position: { x: 4, y: 5 },
    requires: "dh_t5_total_collapse",
    spell: {
      name: "Rot Memory",
      description: "Enemies who have ever carried 5+ Decay Stacks permanently suffer +1d6 bonus damage from all your spells for the remainder of the encounter.",
      flavorText: "Survival is a record. The garden keeps records.",
      source: "talent", class: "Plaguebringer", treeId: "decay_harbinger",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", visualTheme: "poison", tags: ["passive", "mark", "vulnerability", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "Rot Memory increases all damage taken by 30 points and reduces target movement speed by 15ft permanently." }
    ]
  },

  // ──────────────── TIER 7 / CAPSTONE (15 pts) ────────────────
  {
    id: "dh_t7_the_deep_garden",
    name: "The Deep Garden",
    icon: "spell_shadow_deathanddecay",
    maxRanks: 1,
    position: { x: 0.5, y: 6 },
    requires: "dh_t6_apocalyptic_decay",
    spell: {
      name: "The Deep Garden",
      description: "ULTIMATE: Designate one target as the Garden's Heartwood for 1 minute: its Decay Stack cap becomes UNLIMITED. All your attacks add +2 stacks. At the end of the duration or upon death, the Heartwood implodes: deals 2d10 blight damage PER STACK on it to itself and seeds all enemies within 60 feet with half its total stacks.",
      flavorText: "They asked how deep the garden goes. This is the answer, and it is a place.",
      source: "talent", class: "Plaguebringer", treeId: "decay_harbinger",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "ranged", range: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 180, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { virulence: { baseAmount: 6 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      damageTypes: ["blight"],
      primaryDamage: { dice: "2d10", flat: 0, procChance: 100 },
      debuffs: ["heartwood"], visualTheme: "poison", tags: ["ultimate", "capstone", "nuke", "plaguebringer"]
    },
    rankUpgrades: []
  },
  {
    id: "dh_t7_peat_heart",
    name: "Peat-Heart Doctrine",
    icon: "spell_shadow_darkritual",
    maxRanks: 5,
    position: { x: 1.5, y: 6 },
    requires: "dh_t6_apocalyptic_decay",
    spell: {
      name: "Peat-Heart Doctrine",
      description: "The Wastes beat slowly in your chest. All blight damage you deal is increased by +1d6 damage.",
      flavorText: "Slow pulse. Long memory.",
      source: "talent", class: "Plaguebringer", treeId: "decay_harbinger",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["blight"],
      visualTheme: "poison", tags: ["passive", "capstone", "damage", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "All blight damage you deal is increased by +1d8 damage." },
      { description: "All blight damage you deal is increased by +1d8 damage." },
      { description: "All blight damage you deal is increased by +2d8 damage." },
      { description: "All blight damage you deal is increased by +2d8 damage, and Rupture Cyst costs 0 Virulence." }
    ]
  },
  {
    id: "dh_t7_slow_gardener",
    name: "Rot Acceleration",
    icon: "inv_misc_slime_01",
    maxRanks: 3,
    position: { x: 2.5, y: 6 },
    requires: "dh_t6_deep_rooted",
    spell: {
      name: "Rot Acceleration",
      description: "Permanent Decay Stacks tick twice per round instead of once (at start and end of turn).",
      flavorText: "Waiting is also cultivation.",
      source: "talent", class: "Plaguebringer", treeId: "decay_harbinger",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", visualTheme: "poison", tags: ["passive", "capstone", "dot", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "Decay Stacks tick twice per round, and each tick deals +25 points bonus damage." },
      { description: "Decay Stacks tick twice per round at +50 points damage, and each tick restores 1 mana and 1 Virulence." }
    ]
  },
  {
    id: "dh_t7_compost_engine",
    name: "Compost Engine",
    icon: "spell_shadow_corpseexplode",
    maxRanks: 3,
    position: { x: 3.5, y: 6 },
    requires: "dh_t6_deep_rooted",
    spell: {
      name: "Compost Engine",
      description: "Whenever an enemy dies while carrying Decay Stacks, you gain 4 Virulence and heal for 3d8 health.",
      flavorText: "Nothing is wasted. Especially not the endings.",
      source: "talent", class: "Plaguebringer", treeId: "decay_harbinger",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self",
      healing: { dice: "3d8", flat: 0 },
      visualTheme: "poison", tags: ["passive", "capstone", "engine", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "Stacked kills grant 6 Virulence, heal 4d8 health, and reduce Organ Collapse cooldown by 10s.", healing: { dice: "4d8", flat: 0 } },
      { description: "Stacked kills grant maximum Virulence, heal 6d8 health, and reset ALL decay ability cooldowns.", healing: { dice: "6d8", flat: 0 } }
    ]
  },
  {
    id: "dh_t7_eternal_gardener",
    name: "Eternal Gardener",
    icon: "spell_shadow_deathanddecay",
    maxRanks: 3,
    position: { x: 4.5, y: 6 },
    requires: "dh_t6_rot_memory",
    spell: {
      name: "Eternal Gardener",
      description: "While any enemy holds 5+ Decay Stacks, lethal damage reduces you to 1 health instead and immediately draws 50 health from the stacked enemy (once per combat).",
      flavorText: "You have cultivated your own continuation.",
      source: "talent", class: "Plaguebringer", treeId: "decay_harbinger",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "poison", tags: ["passive", "capstone", "cheat-death", "plaguebringer"]
    },
    rankUpgrades: [
      { description: "Survive lethal damage at 1 health, drain 75 health from stacked target, and reset Miasmic Shroud cooldown." },
      { description: "Survive lethal damage at 1 health, drain 100 health from all stacked targets, and instantly trigger Rupture Cyst on all of them for free." }
    ]
  }
];
