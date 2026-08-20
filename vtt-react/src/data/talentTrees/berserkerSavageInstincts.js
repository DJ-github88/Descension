// ============================================
// BERSERKER — SAVAGE INSTINCTS (v4: Rebalanced Tier Budgets, Normalized Grid Coordinates)
// Schema: see talentSystem.mjs.
// Grid coordinates: x (0..4), y (0..6 representing Tiers 1..7).
//
// FANTASY: The Pack Alpha / Tactical Predator / Flanking Ambush Master.
// ============================================

export const BERSERKER_SAVAGE_INSTINCTS = [
  // ──────────────── TIER 1 (Row 0) ────────────────
  {
    id: "svi_t1_mark_prey",
    name: "Designate Quarry",
    icon: "ability_hunter_snipershot",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Designate Quarry",
      description: "Spend 1 AP: Mark an enemy within 45 feet as Quarry for 2 rounds. You gain +1 to hit against the Quarry and your attacks deal +1d4 slicing damage.",
      flavorText: "The pack has decided. The target does not get a vote.",
      source: "talent", class: "Berserker", treeId: "savage_instincts",
      spellType: "ACTIVE", category: "debuff",
      actionPoints: 1,
      targetingMode: "single", rangeType: "ranged", range: 45,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 2, cooldownUnit: "rounds",
      primaryDamage: { dice: "1d4", flat: 0, procChance: 100 },
      damageTypes: ["slicing"],
      visualTheme: "primal", tags: ["mark", "debuff", "quarry", "berserker"]
    },
    rankUpgrades: [
      { description: "Allies also gain +1 to hit the Quarry, and bonus damage increases to +1d6 slicing.", primaryDamage: { dice: "1d6", flat: 0, procChance: 100 } },
      { description: "Allies gain +2 to hit the Quarry, bonus damage increases to +1d6, and the Quarry cannot benefit from partial cover." }
    ]
  },
  {
    id: "svi_t1_combat_instincts",
    name: "Predatory Senses",
    icon: "ability_warrior_weaponmastery",
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    spell: {
      name: "Predatory Senses",
      description: "Passive: You gain +2 to Initiative rolls, cannot be Surprised, and allies within 15 feet gain +5 feet movement speed on the first round of combat.",
      flavorText: "The hair on your neck stands up before the twig snaps.",
      source: "talent", class: "Berserker", treeId: "savage_instincts",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "initiative", "speed", "berserker"]
    },
    rankUpgrades: [
      { description: "Initiative bonus increases to +4 and movement speed bonus increases to +10 feet." },
      { description: "Initiative bonus increases to +4, and on the first turn of combat, your first attack gains Advantage." }
    ]
  },
  {
    id: "svi_t1_survival_instinct",
    name: "Flanking Instinct",
    icon: "ability_hunter_pet_wolf",
    maxRanks: 2,
    position: { x: 3, y: 0 },
    requires: null,
    spell: {
      name: "Flanking Instinct",
      description: "Passive: When you and an ally are adjacent to the same enemy, both of you deal +1d4 physical damage on melee attacks.",
      flavorText: "Two wolves at either side of the deer.",
      source: "talent", class: "Berserker", treeId: "savage_instincts",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["slicing"],
      primaryDamage: { dice: "1d4", flat: 0, procChance: 100 },
      visualTheme: "primal", tags: ["passive", "flank", "ally", "berserker"]
    },
    rankUpgrades: [
      { description: "Flanking bonus increases to +1d6 physical damage and +1 to hit." }
    ]
  },

  // ──────────────── TIER 2 (Row 1) ────────────────
  {
    id: "svi_t2_pack_howl",
    name: "Pack Howl",
    icon: "ability_druid_challangingroar",
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: "svi_t1_mark_prey",
    spell: {
      name: "Pack Howl",
      description: "Spend 1 AP: Howl to rally the pack. You and all allies within 30 feet gain +10 feet movement speed for 2 rounds and gain +1 to hit on their next attack.",
      flavorText: "The hunt begins in earnest.",
      source: "talent", class: "Berserker", treeId: "savage_instincts",
      spellType: "ACTIVE", category: "buff",
      actionPoints: 1,
      targetingMode: "aoe", aoeShape: "circle", aoeSize: 30, rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 2, cooldownUnit: "rounds",
      visualTheme: "primal", tags: ["shout", "rally", "speed", "berserker"]
    },
    rankUpgrades: [
      { description: "Allies gain +15 feet speed and +2 to hit on next attack." },
      { description: "Allies gain +15 feet speed, +2 to hit, and gain 5 temporary Hit Points." }
    ]
  },
  {
    id: "svi_t2_hamstring",
    name: "Hamstring Tendon",
    icon: "ability_shockwave",
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: "svi_t1_survival_instinct",
    spell: {
      name: "Hamstring Tendon",
      description: "Spend 1 AP: Strike a foe in melee for 1d8 slicing damage and reduce their movement speed by 15 feet for 2 rounds.",
      flavorText: "Cut the tendon. The prey stops running.",
      source: "talent", class: "Berserker", treeId: "savage_instincts",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 1,
      targetingMode: "single", rangeType: "melee", range: 5,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 1, cooldownUnit: "round",
      primaryDamage: { dice: "1d8", flat: 0, procChance: 100 },
      damageTypes: ["slicing"],
      visualTheme: "primal", tags: ["strike", "slow", "cripple", "berserker"]
    },
    rankUpgrades: [
      { description: "Deals 2d6 slicing damage and completely roots the target for 1 round.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } },
      { description: "Deals 2d8 slicing damage, roots the target, and exposes their flank (+2 to hit for all allies).", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 } }
    ]
  },

  // ──────────────── TIER 3 (Row 2) ────────────────
  {
    id: "svi_t3_ambush_strike",
    name: "Predatory Pounce",
    icon: "ability_druid_ravage",
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: "svi_t2_pack_howl",
    spell: {
      name: "Predatory Pounce",
      description: "Spend 1 AP: Leap up to 20 feet onto a target, dealing 2d6 slicing damage and knocking them Prone on a failed Reflex save.",
      flavorText: "Strike from the blind spot, drag them to the snow.",
      source: "talent", class: "Berserker", treeId: "savage_instincts",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 1,
      targetingMode: "single", rangeType: "ranged", range: 20,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 2, cooldownUnit: "rounds",
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      damageTypes: ["slicing"],
      visualTheme: "primal", tags: ["pounce", "knockdown", "berserker"]
    },
    rankUpgrades: [
      { description: "Deals 2d8 slicing damage; deals +1d8 bonus damage if attacking from stealth or flank.", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 } },
      { description: "Deals 3d6 slicing damage, Pins the target for 1 round, and allows an adjacent ally to make an immediate free attack.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "svi_t3_pack_coordination",
    name: "Pack Coordination",
    icon: "ability_warrior_battleshout",
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: "svi_t2_hamstring",
    spell: {
      name: "Pack Coordination",
      description: "Passive: Whenever an ally within 20 feet scores a critical hit, you immediately gain +1 AP on your next turn and 10 Blood-Heat.",
      flavorText: "Blood in the water ignites the whole frenzy.",
      source: "talent", class: "Berserker", treeId: "savage_instincts",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "ally-crit", "resource", "berserker"]
    },
    rankUpgrades: [
      { description: "Gain +1 AP, 15 Blood-Heat, and your next attack deals +1d6 damage." },
      { description: "Gain +1 AP, 20 Blood-Heat, your next attack deals +1d8 damage, and you heal for 4 Hit Points." }
    ]
  },

  // ──────────────── TIER 4 (Row 3) ────────────────
  {
    id: "svi_t4_call_spirit_pack",
    name: "Spirit Wolf Pack",
    icon: "ability_hunter_beastwithin",
    maxRanks: 1,
    position: { x: 2, y: 3 },
    requires: ["svi_t3_ambush_strike", "svi_t3_pack_coordination"],
    spell: {
      name: "Spirit Wolf Pack",
      description: "Spend 1 AP: Summon 2 spectral spirit wolves to flank enemies for 2 rounds. Each wolf has 15 HP, moves 40 feet, and bites for 1d6 piercing damage, granting flanking bonuses to all party members.",
      flavorText: "The ancestors run with the living alpha.",
      source: "talent", class: "Berserker", treeId: "savage_instincts",
      spellType: "ACTIVE", category: "utility",
      actionPoints: 1,
      targetingMode: "single", rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 3, cooldownUnit: "rounds",
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      damageTypes: ["piercing"],
      visualTheme: "primal", tags: ["summon", "wolves", "flank", "berserker"]
    }
  },

  // ──────────────── TIER 5 (Row 4) ────────────────
  {
    id: "svi_t5_opportunist_bite",
    name: "Alpha's Opportunity",
    icon: "ability_ghoulfrenzy",
    maxRanks: 3,
    position: { x: 1, y: 4 },
    requires: "svi_t4_call_spirit_pack",
    spell: {
      name: "Alpha's Opportunity",
      description: "Passive: Whenever an enemy within your melee reach attempts to move or Disengage, make an Opportunity Attack dealing +1d6 bonus damage.",
      flavorText: "You do not leave the circle until the alpha dismisses you.",
      source: "talent", class: "Berserker", treeId: "savage_instincts",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["slicing"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "primal", tags: ["passive", "opportunity-attack", "berserker"]
    },
    rankUpgrades: [
      { description: "Opportunity attacks deal +1d8 bonus damage and stop enemy movement." },
      { description: "Opportunity attacks deal +2d6 bonus damage, stop movement, and knock target Prone." }
    ]
  },
  {
    id: "svi_t5_pack_frenzy",
    name: "Shared Predation",
    icon: "spell_nature_spiritwolf",
    maxRanks: 2,
    position: { x: 3, y: 4 },
    requires: "svi_t4_call_spirit_pack",
    spell: {
      name: "Shared Predation",
      description: "Passive: You and allies within 20 feet gain +1 to all saving throws and +1 Armor while at least 2 party members are adjacent.",
      flavorText: "Shield to shield, shoulder to shoulder.",
      source: "talent", class: "Berserker", treeId: "savage_instincts",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "aura", "defense", "berserker"]
    },
    rankUpgrades: [
      { description: "Gain +2 to saving throws and +2 Armor while adjacent to an ally." }
    ]
  },

  // ──────────────── TIER 6 (Row 5) ────────────────
  {
    id: "svi_t6_alpha_command",
    name: "Alpha's Coordinated Strike",
    icon: "ability_warrior_rallyingcry",
    maxRanks: 3,
    position: { x: 2, y: 5 },
    requires: ["svi_t5_opportunist_bite", "svi_t5_pack_frenzy"],
    spell: {
      name: "Alpha's Coordinated Strike",
      description: "Spend 2 AP: Command the pack to strike in unison. You strike a foe for 3d8 piercing damage, and up to 2 allies within 30 feet can immediately make a free weapon attack against the same target.",
      flavorText: "One gesture. Three blades.",
      source: "talent", class: "Berserker", treeId: "savage_instincts",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 2,
      targetingMode: "single", rangeType: "melee", range: 5,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 3, cooldownUnit: "rounds",
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      damageTypes: ["piercing"],
      visualTheme: "primal", tags: ["strike", "ally-command", "combo", "berserker"]
    },
    rankUpgrades: [
      { description: "Deals 3d10 damage and ally attacks deal +1d6 bonus damage.", primaryDamage: { dice: "3d10", flat: 0, procChance: 100 } },
      { description: "Deals 4d8 damage, ally attacks deal +1d8 bonus damage, and stuns target for 1 round if all attacks hit.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 } }
    ]
  },

  // ──────────────── TIER 7 (Row 6 - Capstones) ────────────────
  {
    id: "svi_t7_apex_predator",
    name: "Avatar of the Apex Wolf",
    icon: "ability_druid_ferociousbite",
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: "svi_t6_alpha_command",
    spell: {
      name: "Avatar of the Apex Wolf",
      description: "ULTIMATE: Spend 2 AP: For 2 rounds, you and all party members within 40 feet gain Advantage on all attack rolls, deal +1d8 physical damage on every hit, and gain +15 feet movement speed.",
      flavorText: "The whole pack transcends. Every tooth is razor, every eye is locked on prey.",
      source: "talent", class: "Berserker", treeId: "savage_instincts",
      spellType: "ACTIVE", category: "buff",
      actionPoints: 2,
      targetingMode: "self",
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 5, cooldownUnit: "rounds",
      visualTheme: "primal", tags: ["ultimate", "party-buff", "berserker"]
    }
  },
  {
    id: "svi_t7_stalkers_shadow",
    name: "Relentless Tracker",
    icon: "ability_stealth",
    maxRanks: 2,
    position: { x: 1, y: 6 },
    requires: "svi_t6_alpha_command",
    spell: {
      name: "Relentless Tracker",
      description: "Passive: You can take the Hide action as a free reaction at the end of your turn if in dim light or cover, and your attacks from stealth deal +2d8 bonus damage.",
      flavorText: "Vanishing into the snowstorm between heartbeats.",
      source: "talent", class: "Berserker", treeId: "savage_instincts",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["slicing"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      visualTheme: "primal", tags: ["passive", "stealth", "ambush", "berserker"]
    },
    rankUpgrades: [
      { description: "Attacks from stealth deal +3d8 bonus damage and automatically inflict Stagger." }
    ]
  },
  {
    id: "svi_t7_wolf_pack_alpha",
    name: "Alpha's Call",
    icon: "spell_nature_spiritwolf",
    maxRanks: 2,
    position: { x: 3, y: 6 },
    requires: "svi_t6_alpha_command",
    spell: {
      name: "Alpha's Call",
      description: "Passive: When you reduce an enemy to 0 Hit Points, you and all allies within 30 feet immediately restore 8 Hit Points and gain +10 feet speed on their next turn.",
      flavorText: "Victory feeds the pack's hunger.",
      source: "talent", class: "Berserker", treeId: "savage_instincts",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "on-kill", "heal", "berserker"]
    },
    rankUpgrades: [
      { description: "Restores 14 Hit Points on enemy defeat and grants +1 AP to the nearest ally." }
    ]
  }
];
