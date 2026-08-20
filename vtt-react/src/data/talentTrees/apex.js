// ============================================
// APEX TALENT TREES (v3: full v2/v3 active/passive spec identity overhaul)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50 pts per tree.
//
// SPECS:
//   1. SHADOWBLADE: The Stealth Glaive Assassin / Phantom Stalker.
//   2. BLADESTORM:   The Multi-Target Glaive Cyclone / Chain Ricochet Master.
//   3. BEASTMASTER:  The Bonded Apex Companion / Dual Hunter Coordinator.
// ============================================

// ============================================
// 1. APEX — SHADOWBLADE
// ============================================
export const APEX_SHADOWBLADE = [
  // ──────────────── TIER 1 (8 pts) ────────────────
  {
    id: "sb_t1_shadow_strike",
    name: "Shadow Strike",
    icon: "ability_rogue_shadowstrike",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Shadow Strike",
      description: "Strike from the gloom with an ironwood glaive: deals 2d8 physical/shadow damage and grants 2 Quarry Marks (QM). If cast from stealth, deals double damage and blinds the target for 1 round.",
      flavorText: "The ironwood glaive drinks deep from shadows before striking.",
      source: "talent", class: "Apex", treeId: "shadowblade",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "melee", range: 10,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 6, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 3 } },
      damageTypes: ["physical", "shadow"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["stealth", "burst", "qm-builder", "apex"]
    },
    rankUpgrades: [
      { description: "Deals 3d8 damage, grants 3 QM, and stealth strikes stun for 1 round.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } },
      { description: "Deals 4d8 damage, grants 4 QM, stealth strikes stun for 2 rounds and automatically re-enter stealth upon kill.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "sb_t1_dark_presence",
    name: "Shadow Camouflage",
    icon: "spell_shadow_nethercloak",
    maxRanks: 3,
    position: { x: 2.5, y: 0 },
    requires: null,
    spell: {
      name: "Shadow Camouflage",
      description: "You and your companion gain +4 to Stealth checks. Entering stealth grants +15ft movement speed for 2 rounds.",
      flavorText: "Frostwood nights teach even ironwood to vanish among the pines.",
      source: "talent", class: "Apex", treeId: "shadowblade",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "stealth", "speed", "apex"]
    },
    rankUpgrades: [
      { description: "+6 to Stealth checks; entering stealth grants +20ft speed and +2 Durability Steps to equipped durability." },
      { description: "+8 to Stealth checks; entering stealth grants +25ft speed, +4 Durability Steps to equipped durability, and invisibility for 1 round." }
    ]
  },
  {
    id: "sb_t1_glaive_finesse",
    name: "Quarry Tracker",
    icon: "ability_hunter_snipershot",
    maxRanks: 2,
    position: { x: 4, y: 0 },
    requires: null,
    spell: {
      name: "Quarry Tracker",
      description: "While at 3 or more Quarry Marks, your melee attacks score critical hits on 19-20 and deal +1d6 bonus shadow damage.",
      flavorText: "The apex hunter waits with glaive poised.",
      source: "talent", class: "Apex", treeId: "shadowblade",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["shadow"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["passive", "crit", "bonus-damage", "apex"]
    },
    rankUpgrades: [
      { description: "At 3+ QM: attacks crit on 18-20, deal +2d6 bonus shadow damage, and ignores 25 points of enemy durability." }
    ]
  },

  // ──────────────── TIER 2 (6 pts) ────────────────
  {
    id: "sb_t2_phantom_step",
    name: "Phantom Step",
    icon: "spell_shadow_shadowstep",
    maxRanks: 3,
    position: { x: 1, y: 1.5 },
    requires: "sb_t1_shadow_strike",
    spell: {
      name: "Phantom Step",
      description: "Spend 2 QM: dissolve into shadow and teleport up to 40 feet behind an enemy. You immediately enter stealth and your next attack within 1 round deals +3d8 bonus damage.",
      flavorText: "Ironwood hunters walk between the frost-kissed shadows.",
      source: "talent", class: "Apex", treeId: "shadowblade",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "single", rangeType: "ranged", range: 40,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 8, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { quarryMarks: { baseAmount: 2 } },
      buffs: ["phantom-ambush"], visualTheme: "shadow", tags: ["teleport", "stealth", "ambush", "apex"]
    },
    rankUpgrades: [
      { description: "Teleport up to 50 feet; next attack deals +5d8 bonus damage and cooldown drops to 6s.", cooldownValue: 6 },
      { description: "Teleport up to 60 feet; next attack deals +7d8 bonus damage and refunds the 2 QM on hit.", cooldownValue: 4 }
    ]
  },
  {
    id: "sb_t2_shadow_synergy",
    name: "Shared Shadow Bond",
    icon: "ability_druid_predatoryinstincts",
    maxRanks: 3,
    position: { x: 3, y: 1.5 },
    requires: "sb_t1_dark_presence",
    spell: {
      name: "Shared Shadow Bond",
      description: "Your companion enters stealth whenever you do. When you attack from stealth, your companion immediately makes a free coordinated strike dealing 2d8 damage.",
      flavorText: "Bonds forged in Frostwood run deeper than ironwood roots.",
      source: "talent", class: "Apex", treeId: "shadowblade",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["physical", "shadow"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["passive", "companion-strike", "stealth", "apex"]
    },
    rankUpgrades: [
      { description: "Companion strike deals 3d8 damage and generates +1 QM." },
      { description: "Companion strike deals 4d8 damage, generates +2 QM, and knocks target prone." }
    ]
  },

  // ──────────────── TIER 3 (6 pts) ────────────────
  {
    id: "sb_t3_shadow_eruption",
    name: "Shadow Eruption",
    icon: "spell_shadow_shadowfury",
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: "sb_t2_phantom_step",
    spell: {
      name: "Shadow Eruption",
      description: "Spend 3 QM: detonate stored shadow within a target struck by your glaive. Deals 5d10 shadow damage in a 20-foot radius and prevents all victims from taking reactions for 1 round.",
      flavorText: "Glaive strikes leave echoes that shatter the will of nearby foes.",
      source: "talent", class: "Apex", treeId: "shadowblade",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "ranged", range: 30, aoeShape: "circle", aoeSize: 20,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 14, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { quarryMarks: { baseAmount: 3 } },
      damageTypes: ["shadow"],
      primaryDamage: { dice: "5d10", flat: 0, procChance: 100 },
      debuffs: ["silence-reaction"], visualTheme: "shadow", tags: ["aoe", "nuke", "no-reaction", "apex"]
    },
    rankUpgrades: [
      { description: "25-foot radius deals 7d10 shadow damage, silences reactions, and blinds all victims for 1 round.", primaryDamage: { dice: "7d10", flat: 0, procChance: 100 }, aoeSize: 25 },
      { description: "30-foot radius deals 9d10 shadow damage, blinds for 2 rounds, and immediately places you back in stealth.", primaryDamage: { dice: "9d10", flat: 0, procChance: 100 }, aoeSize: 30 }
    ]
  },
  {
    id: "sb_t3_stalker_execute",
    name: "Lethal Execution",
    icon: "ability_hunter_assassinate",
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: "sb_t2_shadow_synergy",
    spell: {
      name: "Lethal Execution",
      description: "Your attacks against enemies below half maximum Hit Points deal +35 points bonus damage, and kills grant you maximum Quarry Marks.",
      flavorText: "The wounded animal has no defense against the apex.",
      source: "talent", class: "Apex", treeId: "shadowblade",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "execute", "qm-gain", "apex"]
    },
    rankUpgrades: [
      { description: "below half maximum Hit Points: deal +50 points bonus damage and kills grant max QM and 20ft speed." },
      { description: "below half maximum Hit Points: deal +75 points bonus damage, kills grant max QM, and your next attack is a guaranteed critical hit." }
    ]
  },

  // ──────────────── TIER 4 (5 pts) ────────────────
  {
    id: "sb_t4_smoke_screen",
    name: "Shadow Smoke Screen",
    icon: "spell_shadow_twilight",
    maxRanks: 3,
    position: { x: 1, y: 4.5 },
    requires: "sb_t3_shadow_eruption",
    spell: {
      name: "Shadow Smoke Screen",
      description: "Spend 2 QM: deploy a 25-foot cloud of choking shadow mist for 3 rounds. You and allies inside are invisible, while enemies inside are blinded and have -3 Durability Steps to target's durability.",
      flavorText: "A pocket of Frostwood night brought indoors.",
      source: "talent", class: "Apex", treeId: "shadowblade",
      spellType: "ACTIVE", category: "control",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 25,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 20, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { quarryMarks: { baseAmount: 2 } },
      buffs: ["invisibility"], visualTheme: "shadow", tags: ["stealth-zone", "blind", "peel", "apex"]
    },
    rankUpgrades: [
      { description: "30-foot mist lasts 4 rounds: allies gain +4 Durability Steps to equipped durability inside, enemies take 2d8 shadow per round.", aoeSize: 30, cooldownValue: 16 },
      { description: "35-foot mist lasts 5 rounds: enemies inside cannot cast spells or make ranged attacks.", aoeSize: 35, cooldownValue: 12 }
    ]
  },
  {
    id: "sb_t4_ambush_mastery",
    name: "Apex Ambush",
    icon: "ability_rogue_ambush",
    maxRanks: 2,
    position: { x: 3.5, y: 4.5 },
    requires: "sb_t3_stalker_execute",
    spell: {
      name: "Apex Ambush",
      description: "When attacking from stealth, your attacks ignores 50 points of enemy durability and shields, and you cannot miss.",
      flavorText: "Strikes planned in stillness cannot be parried.",
      source: "talent", class: "Apex", treeId: "shadowblade",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "penetration", "true-strike", "apex"]
    },
    rankUpgrades: [
      { description: "Stealth attacks ignores 100 points of enemy durability/shields, deal triple critical damage, and silence the target for 1 round." }
    ]
  },

  // ──────────────── TIER 5 (5 pts) ────────────────
  {
    id: "sb_t5_glaive_dance",
    name: "Shadow Glaive Dance",
    icon: "ability_warrior_weaponmastery",
    maxRanks: 2,
    position: { x: 1, y: 6 },
    requires: "sb_t4_smoke_screen",
    spell: {
      name: "Shadow Glaive Dance",
      description: "Spend 4 QM: execute a blinding sequence of 5 shadow strikes against up to 5 enemies within 25 feet. Deals 7d10 shadow/physical damage total and teleports you between each target.",
      flavorText: "One hunter in five places in the same second.",
      source: "talent", class: "Apex", treeId: "shadowblade",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "multi", rangeType: "ranged", range: 25,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 24, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { quarryMarks: { baseAmount: 4 } },
      damageTypes: ["shadow", "physical"],
      primaryDamage: { dice: "7d10", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["omni-slash", "multi-teleport", "nuke", "apex"]
    },
    rankUpgrades: [
      { description: "Deals 10d10 total damage across 6 strikes, stuns all hit targets for 1 round, and ends in stealth.", primaryDamage: { dice: "10d10", flat: 0, procChance: 100 }, cooldownValue: 18 }
    ]
  },
  {
    id: "sb_t5_shadow_vitality",
    name: "Gloom Leech",
    icon: "spell_shadow_lifedrain",
    maxRanks: 3,
    position: { x: 3, y: 6 },
    requires: "sb_t4_ambush_mastery",
    spell: {
      name: "Gloom Leech",
      description: "All shadow damage dealt by you and your companion heals you for 30 points of the damage dealt. Overheal becomes temporary health up to 40.",
      flavorText: "The darkness restores what the hunt takes.",
      source: "talent", class: "Apex", treeId: "shadowblade",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "lifesteal", "sustain", "apex"]
    },
    rankUpgrades: [
      { description: "Heal for 50 points of shadow damage; temp health caps at 70." },
      { description: "Heal for 75 points of shadow damage; temp health caps at 100, and you gain +2 Durability Steps to equipped durability while at max temp HP." }
    ]
  },

  // ──────────────── TIER 6 (5 pts) ────────────────
  {
    id: "sb_t6_shadow_assassin",
    name: "Shadow Entity",
    icon: "spell_shadow_demonicempathy",
    maxRanks: 1,
    position: { x: 1, y: 7.5 },
    requires: "sb_t5_glaive_dance",
    spell: {
      name: "Shadow Entity",
      description: "Spend 5 QM: merge into the ironwood night for 1 minute: all your attacks are completely silent, you phase through solid walls, gain 50 points movement speed, and all your glaive attacks deal maximum possible damage dice.",
      flavorText: "Frostwood legends tell of hunters who become the night itself.",
      source: "talent", class: "Apex", treeId: "shadowblade",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 90, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { quarryMarks: { baseAmount: 5 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      buffs: ["shadow-entity"], visualTheme: "shadow", tags: ["transform", "phase", "maximize", "apex"]
    },
    rankUpgrades: []
  },
  {
    id: "sb_t6_phantom_crits",
    name: "Severing Shadow",
    icon: "ability_rogue_eviscerate",
    maxRanks: 2,
    position: { x: 2.5, y: 7.5 },
    requires: "sb_t5_shadow_vitality",
    spell: {
      name: "Severing Shadow",
      description: "Your critical hits with glaive attacks inflict deep shadow severance: deals an extra 4d8 shadow bleed over 2 rounds and reduces target damage output by 30 points.",
      flavorText: "A cut that bleeds soul rather than blood.",
      source: "talent", class: "Apex", treeId: "shadowblade",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["shadow"],
      visualTheme: "shadow", tags: ["passive", "crit-bleed", "debuff", "apex"]
    },
    rankUpgrades: [
      { description: "Bleed deals 6d8 shadow damage, reduces enemy damage by 50 points, and target is slowed by 25ft." }
    ]
  },
  {
    id: "sb_t6_vanishing_act",
    name: "Slip the Grasp",
    icon: "ability_vanish",
    maxRanks: 2,
    position: { x: 4, y: 7.5 },
    requires: "sb_t5_shadow_vitality",
    spell: {
      name: "Slip the Grasp",
      description: "Whenever you take damage from an enemy, you have a 40 points chance to immediately vanish into stealth and gain a 30-damage shadow shield.",
      flavorText: "Hitting a shadow only bruises the fist.",
      source: "talent", class: "Apex", treeId: "shadowblade",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "auto-stealth", "defense", "apex"]
    },
    rankUpgrades: [
      { description: "75 points chance on damage to vanish into stealth, gain 60 shadow shield, and teleport 15ft away." }
    ]
  },

  // ──────────────── TIER 7 / CAPSTONE (15 pts) ────────────────
  {
    id: "sb_t7_avatar_of_the_phantom",
    name: "Avatar of the Phantom Hunt",
    icon: "spell_shadow_shadowwordpain",
    maxRanks: 1,
    position: { x: 0.5, y: 9.5 },
    requires: "sb_t6_shadow_assassin",
    spell: {
      name: "Avatar of the Phantom Hunt",
      description: "ULTIMATE: Spend 8 QM: summon the Great Frostwood Eclipse for 1 minute: the entire battlefield is blanketed in absolute pitch black darkness. You and your companion make all attacks with quadruple advantage, all your strikes crit unconditionally, and every kill resets all your cooldowns.",
      flavorText: "The hunt ends in the dark. It was always going to.",
      source: "talent", class: "Apex", treeId: "shadowblade",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 180, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { quarryMarks: { baseAmount: 8 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      buffs: ["phantom-hunt"], visualTheme: "shadow", tags: ["ultimate", "capstone", "eclipse", "apex"]
    },
    rankUpgrades: []
  },
  {
    id: "sb_t7_shadowblade_doctrine",
    name: "Shadowblade Doctrine",
    icon: "ability_rogue_shadowstrike",
    maxRanks: 5,
    position: { x: 1.5, y: 9.5 },
    requires: "sb_t6_shadow_assassin",
    spell: {
      name: "Shadowblade Doctrine",
      description: "All shadow and glaive damage you deal is increased by +1d6 damage.",
      flavorText: "The shadow blade cuts clean through iron and soul.",
      source: "talent", class: "Apex", treeId: "shadowblade",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["shadow", "physical"],
      visualTheme: "shadow", tags: ["passive", "capstone", "damage", "apex"]
    },
    rankUpgrades: [
      { description: "All shadow/glaive damage increased by +1d8 damage." },
      { description: "All shadow/glaive damage increased by +1d8 damage." },
      { description: "All shadow/glaive damage increased by +2d8 damage." },
      { description: "All shadow/glaive damage increased by +2d8 damage, and Shadow Strike costs 0 mana." }
    ]
  },
  {
    id: "sb_t7_infinite_qm",
    name: "Apex Quarry Reservoir",
    icon: "ability_hunter_snipershot",
    maxRanks: 3,
    position: { x: 2.5, y: 9.5 },
    requires: "sb_t6_phantom_crits",
    spell: {
      name: "Apex Quarry Reservoir",
      description: "Whenever you spend Quarry Marks, you have a chance on a d20 roll of 15+ to immediately regain 1 Quarry Marks. In combat, you generate 2 QM at the start of every turn.",
      flavorText: "A predator never loses the scent.",
      source: "talent", class: "Apex", treeId: "shadowblade",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "capstone", "qm-engine", "apex"]
    },
    rankUpgrades: [
      { description: "Maximum QM +8; generate 3 QM per turn and movement speed +15ft." },
      { description: "Maximum QM +12; generate 4 QM per turn and abilities cost 1 fewer QM (minimum 1)." }
    ]
  },
  {
    id: "sb_t7_instant_death",
    name: "Throat Cutter",
    icon: "ability_rogue_shadowdance",
    maxRanks: 3,
    position: { x: 3.5, y: 9.5 },
    requires: "sb_t6_phantom_crits",
    spell: {
      name: "Throat Cutter",
      description: "When attacking from stealth, your strikes have a 15 points chance to instantly execute non-boss targets regardless of health.",
      flavorText: "No sound. No struggle. Just an ending.",
      source: "talent", class: "Apex", treeId: "shadowblade",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "capstone", "instant-kill", "apex"]
    },
    rankUpgrades: [
      { description: "25 points chance to instantly execute from stealth; against bosses deals +10d10 bonus true damage." },
      { description: "40 points chance to execute from stealth; against bosses deals +20d10 true damage and refunds full QM." }
    ]
  },
  {
    id: "sb_t7_phantom_immortality",
    name: "Shadowform Rebirth",
    icon: "spell_shadow_nethercloak",
    maxRanks: 3,
    position: { x: 4.5, y: 9.5 },
    requires: "sb_t6_vanishing_act",
    spell: {
      name: "Shadowform Rebirth",
      description: "While at 3+ QM, lethal damage dissolves you into pure gloom instead: prevents death, restores 30 Hit Points, places you in stealth, and teleports you 30 feet away (cooldown: 120s).",
      flavorText: "You cannot execute a shadow.",
      source: "talent", class: "Apex", treeId: "shadowblade",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "capstone", "cheat-death", "apex"]
    },
    rankUpgrades: [
      { description: "Survive lethal damage, restores 45 Hit Points, gain max QM, and vanish with 50 temp HP (cooldown: 90s)." },
      { description: "Survive lethal damage, restores 60 Hit Points, max QM, and immediately cast Shadow Glaive Dance for free (cooldown: 60s)." }
    ]
  }
];

// ============================================
// 2. APEX — BLADESTORM
// ============================================
export const APEX_BLADESTORM = [
  // ──────────────── TIER 1 (8 pts) ────────────────
  {
    id: "bs_t1_ricochet_glaive",
    name: "Ricochet Glaive",
    icon: "ability_warrior_weaponmastery",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Ricochet Glaive",
      description: "Hurl a spinning ironwood glaive: strikes primary target for 2d8 physical damage and bounces to up to 3 additional enemies within 20 feet, granting 1 QM per enemy struck.",
      flavorText: "Ironwood glaives carve spiraling paths through the Frostwood air.",
      source: "talent", class: "Apex", treeId: "bladestorm",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "multi", rangeType: "ranged", range: 45,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 6, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 4 } },
      damageTypes: ["physical"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      visualTheme: "physical", tags: ["chain", "ricochet", "multi-target", "apex"]
    },
    rankUpgrades: [
      { description: "Bounces to up to 4 enemies for 3d8 damage each and ignores 20 points of enemy durability.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } },
      { description: "Bounces to up to 6 enemies for 4d8 damage each, ignores 40 points of enemy durability, and causes bleed for 1d6 per round.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "bs_t1_momentum",
    name: "Blade Momentum",
    icon: "spell_shadow_shadowstep",
    maxRanks: 3,
    position: { x: 2.5, y: 0 },
    requires: null,
    spell: {
      name: "Blade Momentum",
      description: "Each time your glaive bounces to a new target, your movement speed increases by +5ft (stacks up to +25ft) and your next attack deals +1d4 damage.",
      flavorText: "Momentum builds like winter storms across the peaks.",
      source: "talent", class: "Apex", treeId: "bladestorm",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "physical", tags: ["passive", "momentum", "speed", "apex"]
    },
    rankUpgrades: [
      { description: "Speed stacks up to +35ft; bonus damage increases to +2d4 per bounce." },
      { description: "Speed stacks up to +50ft; bonus damage is +3d4 per bounce and attacks cannot be parried." }
    ]
  },
  {
    id: "bs_t1_extended_reach",
    name: "Aerodynamic Edges",
    icon: "ability_hunter_aimedshot",
    maxRanks: 2,
    position: { x: 4, y: 0 },
    requires: null,
    spell: {
      name: "Aerodynamic Edges",
      description: "Glaive bounce distance is increased by +15 feet and glaive attack range is increased by +20 feet.",
      flavorText: "An ironwood glaive thrown seeks its mark across any gap.",
      source: "talent", class: "Apex", treeId: "bladestorm",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "physical", tags: ["passive", "range", "apex"]
    },
    rankUpgrades: [
      { description: "Bounce distance +25 feet, attack range +30 feet, and glaive attacks ignores up to 4 points of enemy Armor." }
    ]
  },

  // ──────────────── TIER 2 (6 pts) ────────────────
  {
    id: "bs_t2_whirling_cyclone",
    name: "Whirling Cyclone",
    icon: "ability_whirlwind",
    maxRanks: 3,
    position: { x: 1, y: 1.5 },
    requires: "bs_t1_ricochet_glaive",
    spell: {
      name: "Whirling Cyclone",
      description: "Spend 2 QM: spin in a lethal 15-foot blade cyclone. Deals 4d8 physical/slashing damage to all enemies around you, knocks them back 10 feet, and deflects all incoming ranged projectiles for 1 round.",
      flavorText: "A sphere of spinning razor steel.",
      source: "talent", class: "Apex", treeId: "bladestorm",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 15,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 8, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { quarryMarks: { baseAmount: 2 } },
      damageTypes: ["physical"],
      primaryDamage: { dice: "4d8", flat: 0, procChance: 100 },
      buffs: ["projectile-deflect"], visualTheme: "physical", tags: ["aoe", "deflect", "knockback", "apex"]
    },
    rankUpgrades: [
      { description: "20-foot cyclone deals 6d8 damage, deflects projectiles, and bleeds all victims for 2d6 per round.", primaryDamage: { dice: "6d8", flat: 0, procChance: 100 }, aoeSize: 20 },
      { description: "25-foot cyclone deals 8d8 damage, deflects projectiles, and stuns enemies hit for 1 round.", primaryDamage: { dice: "8d8", flat: 0, procChance: 100 }, aoeSize: 25 }
    ]
  },
  {
    id: "bs_t2_chain_reaction",
    name: "Chain Reaction",
    icon: "spell_shadow_shadowfury",
    maxRanks: 3,
    position: { x: 3, y: 1.5 },
    requires: "bs_t1_momentum",
    spell: {
      name: "Chain Reaction",
      description: "When your glaive bounces to 3 or more enemies in one attack, your next Ricochet Glaive within 2 rounds bounces to 2 additional targets and costs 0 mana.",
      flavorText: "Chain strikes through packs like lightning through ironwood.",
      source: "talent", class: "Apex", treeId: "bladestorm",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "physical", tags: ["passive", "chain-amp", "free-cast", "apex"]
    },
    rankUpgrades: [
      { description: "Bouncing to 3+ foes makes next cast free, adds +3 bounces, and deals +30 points damage." },
      { description: "Bouncing to 3+ foes makes next cast free, adds +4 bounces, deals +50 points damage, and refunds 2 QM." }
    ]
  },

  // ──────────────── TIER 3 (6 pts) ────────────────
  {
    id: "bs_t3_glaive_storm",
    name: "Glaive Storm",
    icon: "spell_nature_cyclone",
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: "bs_t2_whirling_cyclone",
    spell: {
      name: "Glaive Storm",
      description: "Spend 3 QM: throw two twin glaives into a 25-foot target area for 3 rounds. The spinning blades deal 4d8 physical damage per round, slow enemies by 20ft, and sunders 2 Durability Steps per round.",
      flavorText: "Twin blades hovering in autonomous slaughter.",
      source: "talent", class: "Apex", treeId: "bladestorm",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "ranged", range: 45, aoeShape: "circle", aoeSize: 25,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 16, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { quarryMarks: { baseAmount: 3 } },
      damageTypes: ["physical"],
      primaryDamage: { dice: "4d8", flat: 0, procChance: 100 },
      isDot: true, dotDuration: 3, dotTick: "4d8",
      visualTheme: "physical", tags: ["zone", "hazard", "sunder", "apex"]
    },
    rankUpgrades: [
      { description: "30-foot storm deals 6d8 per round, slows by 25ft, sunders 3 Durability Steps per round.", dotTick: "6d8", aoeSize: 30 },
      { description: "35-foot storm deals 8d8 per round, prevents enemy dash/jump, and crits on 18+.", dotTick: "8d8", aoeSize: 35 }
    ]
  },
  {
    id: "bs_t3_shredding_blades",
    name: "Sunder Ricochet",
    icon: "ability_warrior_sunder",
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: "bs_t2_chain_reaction",
    spell: {
      name: "Sunder Ricochet",
      description: "Every bounce of your glaive reduces the target's durability by -2 (stacks up to -8) and causes them to take 10% more damage from all sources.",
      flavorText: "Each pass removes another layer of defense.",
      source: "talent", class: "Apex", treeId: "bladestorm",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", visualTheme: "physical", tags: ["passive", "sunder", "durability-sunder", "apex"]
    },
    rankUpgrades: [
      { description: "Bounces reduce durability by -3 (stacks up to -12) and +20 points damage taken." },
      { description: "Bounces reduce durability by -4 (stacks up to -16), +30 points damage taken, and shatter physical shields completely." }
    ]
  },

  // ──────────────── TIER 4 (5 pts) ────────────────
  {
    id: "bs_t4_blade_barrage",
    name: "Apex Blade Barrage",
    icon: "ability_hunter_barrage",
    maxRanks: 3,
    position: { x: 1, y: 4.5 },
    requires: "bs_t3_glaive_storm",
    spell: {
      name: "Apex Blade Barrage",
      description: "Spend 4 QM: launch a 40-foot cone of 8 ricocheting glaives. Deals 6d10 physical damage to all enemies in the cone, with each glaive bouncing once to a secondary target.",
      flavorText: "A thousand blades filling the sky.",
      source: "talent", class: "Apex", treeId: "bladestorm",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 40, aoeShape: "cone", aoeSize: 40,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 20, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { quarryMarks: { baseAmount: 4 } },
      damageTypes: ["physical"],
      primaryDamage: { dice: "6d10", flat: 0, procChance: 100 },
      visualTheme: "physical", tags: ["cone", "barrage", "ricochet", "apex"]
    },
    rankUpgrades: [
      { description: "45-foot cone deals 8d10 damage, glaives bounce twice, and cooldown drops to 16s.", primaryDamage: { dice: "8d10", flat: 0, procChance: 100 }, cooldownValue: 16 },
      { description: "50-foot cone deals 10d10 damage, glaives bounce 3 times, and knocks all enemies prone.", primaryDamage: { dice: "10d10", flat: 0, procChance: 100 }, cooldownValue: 12 }
    ]
  },
  {
    id: "bs_t4_endless_ricochet",
    name: "Infinite Bounce",
    icon: "ability_rogue_quickrecovery",
    maxRanks: 2,
    position: { x: 3.5, y: 4.5 },
    requires: "bs_t3_shredding_blades",
    spell: {
      name: "Infinite Bounce",
      description: "If only 2 enemies are present, your glaives can bounce back and forth between them up to 4 times.",
      flavorText: "Two targets make the best mirror.",
      source: "talent", class: "Apex", treeId: "bladestorm",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", visualTheme: "physical", tags: ["passive", "dual-target", "bounce-loop", "apex"]
    },
    rankUpgrades: [
      { description: "Glaives can bounce between 2 targets up to 8 times, with each consecutive bounce dealing ++1d6 bonus damage." }
    ]
  },

  // ──────────────── TIER 5 (5 pts) ────────────────
  {
    id: "bs_t5_shredder_orbit",
    name: "Orbiting Glaive Shield",
    icon: "spell_holy_powerwordbarrier",
    maxRanks: 2,
    position: { x: 1, y: 6 },
    requires: "bs_t4_blade_barrage",
    spell: {
      name: "Orbiting Glaive Shield",
      description: "Spend 3 QM: summon 3 spinning glaives to orbit you for 1 minute: gain +4 Durability Steps to equipped durability, parry all melee attacks automatically (taking 0 damage and retaliating for 3d8 damage), and absorb up to 50 damage.",
      flavorText: "A defensive perimeter forged in razor ironwood.",
      source: "talent", class: "Apex", treeId: "bladestorm",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 30, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { quarryMarks: { baseAmount: 3 } },
      buffs: ["glaive-shield"], visualTheme: "physical", tags: ["shield", "parry", "retaliation", "apex"]
    },
    rankUpgrades: [
      { description: "Gain +6 Durability Steps to equipped durability, retaliate for 5d8 damage, and absorb up to 100 damage.", cooldownValue: 24 }
    ]
  },
  {
    id: "bs_t5_cyclone_surge",
    name: "Cyclone Momentum",
    icon: "ability_warrior_bloodfrenzy",
    maxRanks: 3,
    position: { x: 3, y: 6 },
    requires: "bs_t4_endless_ricochet",
    spell: {
      name: "Cyclone Momentum",
      description: "Whenever your glaive deals damage to 4 or more enemies in a single round, gain 2 Action Points and 3 Quarry Marks immediately.",
      flavorText: "Speed that feeds on crowded ranks.",
      source: "talent", class: "Apex", treeId: "bladestorm",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "physical", tags: ["passive", "action-economy", "qm-gain", "apex"]
    },
    rankUpgrades: [
      { description: "Gain 2 AP, 4 QM, and all glaive cooldowns reduce by 3 seconds on 4+ hits." },
      { description: "Gain 3 AP, max QM, and all glaive cooldowns reduce by 6 seconds on 4+ hits." }
    ]
  },

  // ──────────────── TIER 6 (5 pts) ────────────────
  {
    id: "bs_t6_the_grand_bladestorm",
    name: "The Grand Bladestorm",
    icon: "ability_warrior_bladestorm",
    maxRanks: 1,
    position: { x: 1, y: 7.5 },
    requires: "bs_t5_shredder_orbit",
    spell: {
      name: "The Grand Bladestorm",
      description: "Spend 5 QM: become an unstoppable vortex of spinning glaives for 2 rounds: move at double speed, become immune to all crowd control, and deal 8d10 physical damage per round to ALL enemies within 25 feet.",
      flavorText: "A walking hurricane of ironwood teeth.",
      source: "talent", class: "Apex", treeId: "bladestorm",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 25,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 60, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { quarryMarks: { baseAmount: 5 } },
      durationRounds: 2, durationRealTime: 12, durationUnit: "seconds",
      damageTypes: ["physical"],
      primaryDamage: { dice: "8d10", flat: 0, procChance: 100 },
      buffs: ["bladestorm"], visualTheme: "physical", tags: ["vortex", "immune", "aoe-nuke", "apex"]
    },
    rankUpgrades: []
  },
  {
    id: "bs_t6_severing_ricochet",
    name: "Severing Ricochets",
    icon: "ability_rogue_eviscerate",
    maxRanks: 2,
    position: { x: 2.5, y: 7.5 },
    requires: "bs_t5_cyclone_surge",
    spell: {
      name: "Severing Ricochets",
      description: "All glaive bounces score critical hits on 18+ and critical bounces refund 1 Quarry Mark.",
      flavorText: "Every bounce finds an exposed throat.",
      source: "talent", class: "Apex", treeId: "bladestorm",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", visualTheme: "physical", tags: ["passive", "crit", "refund", "apex"]
    },
    rankUpgrades: [
      { description: "Bounces crit on 17+, deal triple critical damage, and refund 2 QM." }
    ]
  },
  {
    id: "bs_t6_steel_tempest",
    name: "Steel Tempest Defense",
    icon: "ability_warrior_defensivestance",
    maxRanks: 2,
    position: { x: 4, y: 7.5 },
    requires: "bs_t5_cyclone_surge",
    spell: {
      name: "Steel Tempest Defense",
      description: "While in combat, you gain +1 Durability Steps to equipped durability for each enemy within 20 feet of you (up to +8 Durability Steps to equipped durability).",
      flavorText: "Surrounded only means more blades to spin.",
      source: "talent", class: "Apex", treeId: "bladestorm",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "physical", tags: ["passive", "crowd-durability", "defense", "apex"]
    },
    rankUpgrades: [
      { description: "Gain +2 Durability Steps to equipped durability per nearby enemy (up to +14 Durability Steps to equipped durability) and 6 Damage Reduction against all-damage." }
    ]
  },

  // ──────────────── TIER 7 / CAPSTONE (15 pts) ────────────────
  {
    id: "bs_t7_cataclysmic_typhoon",
    name: "Typhoon of Thousand Glaives",
    icon: "spell_nature_unrelentingstorm",
    maxRanks: 1,
    position: { x: 0.5, y: 9.5 },
    requires: "bs_t6_the_grand_bladestorm",
    spell: {
      name: "Typhoon of Thousand Glaives",
      description: "ULTIMATE: Spend 8 QM: summon a permanent orbiting storm of 100 ironwood glaives for 1 minute: automatically attacks all enemies within 50 feet for 10d10 physical damage every round, completely destroys enemy durability, and parries 100 points of all incoming attacks.",
      flavorText: "The sky belongs to the spinning wood.",
      source: "talent", class: "Apex", treeId: "bladestorm",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 50,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 180, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { quarryMarks: { baseAmount: 8 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      damageTypes: ["physical"],
      primaryDamage: { dice: "10d10", flat: 0, procChance: 100 },
      buffs: ["typhoon-glaives"], visualTheme: "physical", tags: ["ultimate", "capstone", "typhoon", "apex"]
    },
    rankUpgrades: []
  },
  {
    id: "bs_t7_bladestorm_doctrine",
    name: "Bladestorm Doctrine",
    icon: "ability_warrior_weaponmastery",
    maxRanks: 5,
    position: { x: 1.5, y: 9.5 },
    requires: "bs_t6_the_grand_bladestorm",
    spell: {
      name: "Bladestorm Doctrine",
      description: "All physical and multi-target glaive damage you deal is increased by +1d6 damage.",
      flavorText: "The blade that never stops cutting.",
      source: "talent", class: "Apex", treeId: "bladestorm",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["physical"],
      visualTheme: "physical", tags: ["passive", "capstone", "damage", "apex"]
    },
    rankUpgrades: [
      { description: "All multi-target glaive damage increased by +1d8 damage." },
      { description: "All multi-target glaive damage increased by +1d8 damage." },
      { description: "All multi-target glaive damage increased by +2d8 damage." },
      { description: "All multi-target glaive damage increased by +2d8 damage, and Ricochet Glaive costs 0 mana." }
    ]
  },
  {
    id: "bs_t7_infinite_ricochet_cap",
    name: "Autonomous Glaive Forge",
    icon: "ability_hunter_aimedshot",
    maxRanks: 3,
    position: { x: 2.5, y: 9.5 },
    requires: "bs_t6_severing_ricochet",
    spell: {
      name: "Autonomous Glaive Forge",
      description: "All your glaives bounce 3 additional times unconditionally, and bounced attacks never lose damage on subsequent hits.",
      flavorText: "Perpetual motion applied to blades.",
      source: "talent", class: "Apex", treeId: "bladestorm",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", visualTheme: "physical", tags: ["passive", "capstone", "bounce-boost", "apex"]
    },
    rankUpgrades: [
      { description: "Bounces +5 additional times; each bounce increases damage by +10 points over the previous hit." },
      { description: "Bounces +8 additional times; each bounce increases damage by +20 points and applies bleed." }
    ]
  },
  {
    id: "bs_t7_storm_cyclone_crit",
    name: "Cyclone Criticality",
    icon: "ability_whirlwind",
    maxRanks: 3,
    position: { x: 3.5, y: 9.5 },
    requires: "bs_t6_steel_tempest",
    spell: {
      name: "Cyclone Criticality",
      description: "Whirling Cyclone and Glaive Storm score critical hits on 18+ and critical hits knock enemies down.",
      flavorText: "A strike that levels the forest floor.",
      source: "talent", class: "Apex", treeId: "bladestorm",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", visualTheme: "physical", tags: ["passive", "capstone", "crit", "knockdown", "apex"]
    },
    rankUpgrades: [
      { description: "AoE crits on 17+ and deals double damage." },
      { description: "AoE crits on 16+, deals triple damage, and immediately resets Whirling Cyclone cooldown." }
    ]
  },
  {
    id: "bs_t7_immortal_whirlwind",
    name: "Ironwood Reflex Rebirth",
    icon: "ability_warrior_defensivestance",
    maxRanks: 3,
    position: { x: 4.5, y: 9.5 },
    requires: "bs_t6_steel_tempest",
    spell: {
      name: "Ironwood Reflex Rebirth",
      description: "While in combat, lethal damage deflects off your spinning blades instead: restores 30 Hit Points, grants 40 temporary health, and automatically activates Whirling Cyclone for free (cooldown: 120s).",
      flavorText: "You cannot touch the center of a whirlwind.",
      source: "talent", class: "Apex", treeId: "bladestorm",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "physical", tags: ["passive", "capstone", "cheat-death", "apex"]
    },
    rankUpgrades: [
      { description: "Survive lethal damage, restores 45 Hit Points, 60 temp HP, and gain full QM (cooldown: 90s)." },
      { description: "Survive lethal damage, restores 60 Hit Points, and immediately activate The Grand Bladestorm for free (cooldown: 60s)." }
    ]
  }
];

// ============================================
// 3. APEX — BEASTMASTER
// ============================================
export const APEX_BEASTMASTER = [
  // ──────────────── TIER 1 (8 pts) ────────────────
  {
    id: "bm_t1_coordinated_command",
    name: "Pack Command Strike",
    icon: "ability_hunter_pet_attack",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Pack Command Strike",
      description: "Strike a target within 10 feet for 2d8 physical damage while commanding your companion to pounce: companion deals 2d8 slashing damage, knocks the target prone, and grants 2 QM.",
      flavorText: "Two bodies moving with a single predatory heartbeat.",
      source: "talent", class: "Apex", treeId: "beastmaster",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "melee", range: 10,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 6, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 3 } },
      damageTypes: ["physical"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      debuffs: ["prone"], visualTheme: "physical", tags: ["dual-strike", "knockdown", "companion", "apex"]
    },
    rankUpgrades: [
      { description: "You and companion deal 3d8 damage each, knock prone, and grant 3 QM.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } },
      { description: "You and companion deal 4d8 damage each, stun for 1 round, and grant 4 QM.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "bm_t1_primal_vigor",
    name: "Bonded Vigor",
    icon: "ability_druid_healinginstincts",
    maxRanks: 3,
    position: { x: 2.5, y: 0 },
    requires: null,
    spell: {
      name: "Bonded Vigor",
      description: "You and your companion gain +20 points maximum health, +2 Durability Steps to equipped durability, and regenerate 1d4 health per round in combat.",
      flavorText: "Shared vitality forged in the frozen woods.",
      source: "talent", class: "Apex", treeId: "beastmaster",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "physical", tags: ["passive", "health", "durability", "sustain", "apex"]
    },
    rankUpgrades: [
      { description: "+35 points maximum health, +4 Durability Steps to equipped durability, and regenerate 2d4 health per round." },
      { description: "+50 points maximum health, +6 Durability Steps to equipped durability, regenerate 3d4 health, and companion revives automatically 1 round after falling." }
    ]
  },
  {
    id: "bm_t1_pack_instincts",
    name: "Alpha Coordination",
    icon: "ability_hunter_pet_aggressive",
    maxRanks: 2,
    position: { x: 4, y: 0 },
    requires: null,
    spell: {
      name: "Alpha Coordination",
      description: "Whenever you or your companion hit a marked target, the other gains advantage on their next attack and deals +1d6 bonus damage.",
      flavorText: "One opens the wound; the other deepens it.",
      source: "talent", class: "Apex", treeId: "beastmaster",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["physical"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "physical", tags: ["passive", "flank", "bonus-damage", "apex"]
    },
    rankUpgrades: [
      { description: "Advantage on next attack, +2d6 bonus damage, and attacks score critical hits on 18+." }
    ]
  },

  // ──────────────── TIER 2 (6 pts) ────────────────
  {
    id: "bm_t2_beast_roar",
    name: "Apex Beast Roar",
    icon: "ability_warrior_battleshout",
    maxRanks: 3,
    position: { x: 1, y: 1.5 },
    requires: "bm_t1_coordinated_command",
    spell: {
      name: "Apex Beast Roar",
      description: "Spend 2 QM: your companion unleashes a terrifying 25-foot roar. Deals 3d8 sonic damage, disorients enemies for 1 round, and forces all enemies to attack the companion instead of you for 2 rounds.",
      flavorText: "The roar that commands respect from every creature in the valley.",
      source: "talent", class: "Apex", treeId: "beastmaster",
      spellType: "ACTIVE", category: "control",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 25,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 10, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { quarryMarks: { baseAmount: 2 } },
      damageTypes: ["storm"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      debuffs: ["taunt"], visualTheme: "physical", tags: ["taunt", "aoe", "crowd-control", "apex"]
    },
    rankUpgrades: [
      { description: "30-foot roar deals 5d8 damage, taunts for 3 rounds, and grants companion 30 temporary health.", primaryDamage: { dice: "5d8", flat: 0, procChance: 100 }, aoeSize: 30, cooldownValue: 8 },
      { description: "35-foot roar deals 7d8 damage, stuns all enemies for 1 round, taunts for 3 rounds, and grants 60 temp HP.", primaryDamage: { dice: "7d8", flat: 0, procChance: 100 }, aoeSize: 35, cooldownValue: 6 }
    ]
  },
  {
    id: "bm_t2_thick_hide",
    name: "Symbiotic Armor",
    icon: "spell_nature_skinofearth",
    maxRanks: 3,
    position: { x: 3, y: 1.5 },
    requires: "bm_t1_primal_vigor",
    spell: {
      name: "Symbiotic Armor",
      description: "You and your companion gain 4 Damage Reduction from all sources, and 30 points of all damage you take is redirected to your companion.",
      flavorText: "Two bodies, one defensive shell.",
      source: "talent", class: "Apex", treeId: "beastmaster",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "physical", tags: ["passive", "dr", "damage-transfer", "apex"]
    },
    rankUpgrades: [
      { description: "gain 6 Damage Reduction; companion takes 50 points less AoE damage." },
      { description: "gain 8 Damage Reduction; companion is immune to all crowd control and critical hits." }
    ]
  },

  // ──────────────── TIER 3 (6 pts) ────────────────
  {
    id: "bm_t3_savage_pounce",
    name: "Savage Pounce & Pin",
    icon: "ability_hunter_pet_cat",
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: "bm_t2_beast_roar",
    spell: {
      name: "Savage Pounce & Pin",
      description: "Spend 3 QM: companion leaps up to 40 feet onto a target, pinning them to the ground for 2 rounds. Deals 5d10 slashing damage and prevents the target from taking any actions.",
      flavorText: "Held under claws that can crack ironwood.",
      source: "talent", class: "Apex", treeId: "beastmaster",
      spellType: "ACTIVE", category: "control",
      targetingMode: "single", rangeType: "ranged", range: 40,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 14, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { quarryMarks: { baseAmount: 3 } },
      damageTypes: ["physical"],
      primaryDamage: { dice: "5d10", flat: 0, procChance: 100 },
      debuffs: ["pinned"], visualTheme: "physical", tags: ["pin", "nuke", "cc", "apex"]
    },
    rankUpgrades: [
      { description: "Deals 7d10 damage, pin lasts 3 rounds, and all ally attacks against pinned target are automatic critical hits.", primaryDamage: { dice: "7d10", flat: 0, procChance: 100 } },
      { description: "Deals 9d10 damage, automatic crits for allies, and resets cooldown on target death.", primaryDamage: { dice: "9d10", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "bm_t3_feral_frenzy",
    name: "Feral Excitement",
    icon: "ability_druid_ferociousbite",
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: "bm_t2_thick_hide",
    spell: {
      name: "Feral Excitement",
      description: "Whenever your companion lands an attack, you gain 1 QM and your next attack deals +2d8 bonus damage.",
      flavorText: "The kill drive spreads across the leash.",
      source: "talent", class: "Apex", treeId: "beastmaster",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["physical"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      visualTheme: "physical", tags: ["passive", "qm-gain", "bonus-damage", "apex"]
    },
    rankUpgrades: [
      { description: "Companion hits grant 2 QM and +3d8 bonus damage." },
      { description: "Companion hits grant 2 QM, +4d8 bonus damage, and refund 1 Action Point." }
    ]
  },

  // ──────────────── TIER 4 (5 pts) ────────────────
  {
    id: "bm_t4_pack_rally",
    name: "Alpha Pack Call",
    icon: "ability_hunter_beastwithin",
    maxRanks: 3,
    position: { x: 1, y: 4.5 },
    requires: "bm_t3_savage_pounce",
    spell: {
      name: "Alpha Pack Call",
      description: "Spend 4 QM: summon 3 secondary hunting beasts to join your primary companion for 3 rounds. All beasts attack the primary target for 6d8 damage each round and grant the entire party +20 points movement speed.",
      flavorText: "The pack answers the true alpha.",
      source: "talent", class: "Apex", treeId: "beastmaster",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "ranged", range: 45,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 20, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { quarryMarks: { baseAmount: 4 } },
      damageTypes: ["physical"],
      primaryDamage: { dice: "6d8", flat: 0, procChance: 100 },
      visualTheme: "physical", tags: ["summon", "pack", "party-buff", "apex"]
    },
    rankUpgrades: [
      { description: "Summons 4 beasts dealing 8d8 damage per round and party deals +15 points damage.", cooldownValue: 16 },
      { description: "Summons 5 beasts dealing 10d8 damage per round, party deals +25 points damage, and beasts take attacks meant for allies.", cooldownValue: 12 }
    ]
  },
  {
    id: "bm_t4_beast_cleave",
    name: "Wide Swipe",
    icon: "ability_warrior_cleave",
    maxRanks: 2,
    position: { x: 3.5, y: 4.5 },
    requires: "bm_t3_feral_frenzy",
    spell: {
      name: "Wide Swipe",
      description: "All companion melee attacks cleave in a 15-foot arc, dealing 100 points full damage to all adjacent enemies.",
      flavorText: "Claws broad enough to strike three at once.",
      source: "talent", class: "Apex", treeId: "beastmaster",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", visualTheme: "physical", tags: ["passive", "cleave", "companion", "apex"]
    },
    rankUpgrades: [
      { description: "Cleave radius 20 feet, deals 100 points damage, and knocks all hit enemies back 10 feet." }
    ]
  },

  // ──────────────── TIER 5 (5 pts) ────────────────
  {
    id: "bm_t5_beast_ascension",
    name: "Bestial Overdrive",
    icon: "ability_druid_enrage",
    maxRanks: 2,
    position: { x: 1, y: 6 },
    requires: "bm_t4_pack_rally",
    spell: {
      name: "Bestial Overdrive",
      description: "Spend 4 QM: enrage your companion for 3 rounds: companion grows to giant size, gains +6 Durability Steps to equipped durability, double attack speed, 50 points damage reduction, and its attacks deal double damage.",
      flavorText: "The bloodline of the apex awakened in full fury.",
      source: "talent", class: "Apex", treeId: "beastmaster",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "single", rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 30, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { quarryMarks: { baseAmount: 4 } },
      buffs: ["bestial-overdrive"], visualTheme: "physical", tags: ["companion-buff", "giant", "haste", "apex"]
    },
    rankUpgrades: [
      { description: "Bestial Overdrive lasts 4 rounds: companion deals triple damage and radiates an aura dealing 3d8 damage per round to adjacent foes.", cooldownValue: 24 }
    ]
  },
  {
    id: "bm_t5_pack_bloodlust",
    name: "Pack Bloodlust",
    icon: "spell_nature_bloodlust",
    maxRanks: 3,
    position: { x: 3, y: 6 },
    requires: "bm_t4_beast_cleave",
    spell: {
      name: "Pack Bloodlust",
      description: "Whenever your companion kills an enemy, you and all allies gain +25 points attack speed and +2d6 damage for 2 rounds.",
      flavorText: "A successful kill elevates the whole pack.",
      source: "talent", class: "Apex", treeId: "beastmaster",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "physical", tags: ["passive", "haste", "party-buff", "apex"]
    },
    rankUpgrades: [
      { description: "Kills grant +40 points speed and +3d6 damage for 3 rounds." },
      { description: "Kills grant +60 points speed, +4d6 damage, and refund 1 Action Point to all party members." }
    ]
  },

  // ──────────────── TIER 6 (5 pts) ────────────────
  {
    id: "bm_t6_dual_apex_fury",
    name: "Dual Apex Assault",
    icon: "ability_hunter_pet_cat",
    maxRanks: 1,
    position: { x: 1, y: 7.5 },
    requires: "bm_t5_beast_ascension",
    spell: {
      name: "Dual Apex Assault",
      description: "Spend 5 QM: you and your companion charge a target simultaneously from opposite flanks. Deals 10d10 physical damage, stuns the target for 2 rounds, and knocks all other enemies within 20 feet prone.",
      flavorText: "The pincer closing with absolute finality.",
      source: "talent", class: "Apex", treeId: "beastmaster",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "ranged", range: 45,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 60, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { quarryMarks: { baseAmount: 5 } },
      damageTypes: ["physical"],
      primaryDamage: { dice: "10d10", flat: 0, procChance: 100 },
      debuffs: ["stun"], visualTheme: "physical", tags: ["dual-nuke", "stun", "knockdown", "apex"]
    },
    rankUpgrades: []
  },
  {
    id: "bm_t6_telepathic_link",
    name: "Telepathic Sync",
    icon: "spell_nature_spiritlinktotem",
    maxRanks: 2,
    position: { x: 2.5, y: 7.5 },
    requires: "bm_t5_pack_bloodlust",
    spell: {
      name: "Telepathic Sync",
      description: "You can see through your companion's eyes, communicate telepathically across any distance, and command it without spending actions.",
      flavorText: "No words needed. Two minds in perfect alignment.",
      source: "talent", class: "Apex", treeId: "beastmaster",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "physical", tags: ["passive", "telepathy", "free-command", "apex"]
    },
    rankUpgrades: [
      { description: "Companion attacks independently on its own initiative in addition to coordinated commands." }
    ]
  },
  {
    id: "bm_t6_primal_roar_defense",
    name: "Intimidating Alpha",
    icon: "ability_warrior_intimidatingshout",
    maxRanks: 2,
    position: { x: 4, y: 7.5 },
    requires: "bm_t5_pack_bloodlust",
    spell: {
      name: "Intimidating Alpha",
      description: "Enemies within 20 feet of you or your companion have disadvantage on all attack rolls and saving throws.",
      flavorText: "Prey shrinks from the sovereign predators.",
      source: "talent", class: "Apex", treeId: "beastmaster",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", visualTheme: "physical", tags: ["passive", "aura-debuff", "fear", "apex"]
    },
    rankUpgrades: [
      { description: "Aura radius 30 feet; enemies have disadvantage on rolls and take -4 to durability." }
    ]
  },

  // ──────────────── TIER 7 / CAPSTONE (15 pts) ────────────────
  {
    id: "bm_t7_avatar_of_the_beastlord",
    name: "Avatar of the Beast Sovereign",
    icon: "ability_druid_primalprecision",
    maxRanks: 1,
    position: { x: 0.5, y: 9.5 },
    requires: "bm_t6_dual_apex_fury",
    spell: {
      name: "Avatar of the Beast Sovereign",
      description: "ULTIMATE: Spend 8 QM: fuse with the spirit of the Ancient Apex for 1 minute: you and your companion gain 100 temporary health, become completely immune to all damage and CC for 2 rounds, and all attacks deal TRIPLE damage and summon a permanent spirit wolf on hit.",
      flavorText: "Man and beast unified into the prime sovereign of the wild.",
      source: "talent", class: "Apex", treeId: "beastmaster",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 180, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { quarryMarks: { baseAmount: 8 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      buffs: ["beast-sovereign"], visualTheme: "physical", tags: ["ultimate", "capstone", "god-mode", "apex"]
    },
    rankUpgrades: []
  },
  {
    id: "bm_t7_beastmaster_doctrine",
    name: "Beastmaster Doctrine",
    icon: "ability_hunter_pet_attack",
    maxRanks: 5,
    position: { x: 1.5, y: 9.5 },
    requires: "bm_t6_dual_apex_fury",
    spell: {
      name: "Beastmaster Doctrine",
      description: "All physical, companion, and coordinated strike damage you deal is increased by +1d6 damage.",
      flavorText: "Two hearts beating as one weapon.",
      source: "talent", class: "Apex", treeId: "beastmaster",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["physical"],
      visualTheme: "physical", tags: ["passive", "capstone", "damage", "apex"]
    },
    rankUpgrades: [
      { description: "All companion damage increased by +1d8 damage." },
      { description: "All companion damage increased by +1d8 damage." },
      { description: "All companion damage increased by +2d8 damage." },
      { description: "All companion damage increased by +2d8 damage, and Pack Command Strike costs 0 mana." }
    ]
  },
  {
    id: "bm_t7_infinite_bond",
    name: "Unbreakable Pack Bond",
    icon: "ability_druid_healinginstincts",
    maxRanks: 3,
    position: { x: 2.5, y: 9.5 },
    requires: "bm_t6_telepathic_link",
    spell: {
      name: "Unbreakable Pack Bond",
      description: "Your companion cannot be permanently killed. When reduced to 0 HP, it enters spectral form for 1 round and regenerates to 50 points HP automatically.",
      flavorText: "A bond that defies mortality.",
      source: "talent", class: "Apex", treeId: "beastmaster",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "physical", tags: ["passive", "capstone", "undying-pet", "apex"]
    },
    rankUpgrades: [
      { description: "Companion regenerates to 75 points HP and grants you 30 temporary health upon revival." },
      { description: "Companion regenerates to 100 points HP instantly with 0 delay and triggers Apex Beast Roar automatically for free." }
    ]
  },
  {
    id: "bm_t7_coordinated_crits",
    name: "Synchronized Criticals",
    icon: "ability_hunter_pet_cat",
    maxRanks: 3,
    position: { x: 3.5, y: 9.5 },
    requires: "bm_t6_primal_roar_defense",
    spell: {
      name: "Synchronized Criticals",
      description: "When you or your companion land a critical hit, the other's next attack within 1 round is a guaranteed critical hit.",
      flavorText: "One strike opens the gate; the other claims the prize.",
      source: "talent", class: "Apex", treeId: "beastmaster",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", visualTheme: "physical", tags: ["passive", "capstone", "crit-chain", "apex"]
    },
    rankUpgrades: [
      { description: "Guaranteed critical hits deal +50 points bonus critical damage and refund 1 QM." },
      { description: "Guaranteed critical hits deal double damage, refund 2 QM, and reset Savage Pounce cooldown." }
    ]
  },
  {
    id: "bm_t7_immortal_beastlord",
    name: "Bonded Sacrifice Rebirth",
    icon: "ability_hunter_beastwithin",
    maxRanks: 3,
    position: { x: 4.5, y: 9.5 },
    requires: "bm_t6_primal_roar_defense",
    spell: {
      name: "Bonded Sacrifice Rebirth",
      description: "While companion is alive, lethal damage is absorbed by companion instead: restores 30 Hit Points, grants 50 temp HP, and activates Bestial Overdrive for free (cooldown: 120s).",
      flavorText: "The beast holds the door against the final dark.",
      source: "talent", class: "Apex", treeId: "beastmaster",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "physical", tags: ["passive", "capstone", "cheat-death", "apex"]
    },
    rankUpgrades: [
      { description: "Survive lethal damage, restores 45 Hit Points, 75 temp HP, and gain max QM (cooldown: 90s)." },
      { description: "Survive lethal damage, restores 60 Hit Points, gain max QM, and immediately trigger Avatar of the Beast Sovereign for free (cooldown: 60s)." }
    ]
  }
];
