// ============================================
// REVENANT TALENT TREES (v3: full v2/v3 active/passive spec identity overhaul)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50 pts per tree.
//
// SPECS:
//   1. SANGUINE HARVEST:   The Life Drain / Blood Sacrificer / Undead Gore Vanguard.
//   2. FROST SOVEREIGN:    The Permafrost Freeze-Shatter / Glacial Lockdown Lich.
//   3. PHYLACTERY ANCHOR:  The Undying Soul Battery / Phylactery Aegis Tank.
// ============================================

// ============================================
// 1. REVENANT — SANGUINE HARVEST
// ============================================
export const REVENANT_SANGUINE_HARVEST = [
  // ──────────────── TIER 1 (8 pts) ────────────────
  {
    id: "sh_t1_sanguine_strike",
    name: "Sanguine Syphon Strike",
    icon: "spell_shadow_lifedrain02",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Sanguine Syphon Strike",
      description: "Strike a target within 10 feet: deals 2d8 blight damage, heals you for half of the damage dealt, and generates 1 Death Toll (DT).",
      flavorText: "Paid in crimson, the power of the Frozen Archive endures.",
      source: "talent", class: "Revenant", treeId: "sanguine_harvest",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "melee", range: 10,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 6, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 3 } },
      damageTypes: ["blight"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      healing: { dice: "1d8", flat: 0 },
      visualTheme: "blood", tags: ["melee", "lifesteal", "dt-builder", "revenant"]
    },
    rankUpgrades: [
      { description: "Deals 3d8 damage, heals for 1d8, grants 2 DT, and causes bleed for 1d6 per round.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 }, healing: { dice: "1d8", flat: 0 } },
      { description: "Deals 3d8 damage, heals for 2d8, grants 2 DT, bleeds for 1d6, and increases movement speed by +10ft.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 }, healing: { dice: "2d8", flat: 0 } }
    ]
  },
  {
    id: "sh_t1_sanguine_mastery",
    name: "Blood-Scribe Mastery",
    icon: "spell_shadow_bloodboil",
    maxRanks: 3,
    position: { x: 2.5, y: 0 },
    requires: null,
    spell: {
      name: "Blood-Scribe Mastery",
      description: "Your maximum Death Toll capacity increases by 4. All life drain effects restore 20% more health.",
      flavorText: "The blood-scribes write life into stolen flesh.",
      source: "talent", class: "Revenant", treeId: "sanguine_harvest",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "self", visualTheme: "blood", tags: ["passive", "dt-cap", "heal-amp", "revenant"]
    },
    rankUpgrades: [
      { description: "Max DT +6; life drain restores 30% more health and your attacks deal +1d6 blood damage." },
      { description: "Max DT +8; life drain restores 35% more health, deals +1d6 blight damage, and +2 Durability Steps to equipped durability." }
    ]
  },
  {
    id: "sh_t1_blood_rush",
    name: "Crimson Adrenaline",
    icon: "spell_nature_bloodlust",
    maxRanks: 2,
    position: { x: 4, y: 0 },
    requires: null,
    spell: {
      name: "Crimson Adrenaline",
      description: "After casting a life drain spell, gain +20ft movement speed and 15% physical damage resistance for 2 rounds.",
      flavorText: "Necrotic frost quickens the veins of those who drain the living.",
      source: "talent", class: "Revenant", treeId: "sanguine_harvest",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "blood", tags: ["passive", "speed", "dr", "revenant"]
    },
    rankUpgrades: [
      { description: "Gain +30ft speed, 25% resistance, and +2 to attack rolls after draining life." }
    ]
  },

  // ──────────────── TIER 2 (6 pts) ────────────────
  {
    id: "sh_t2_sanguine_burst",
    name: "Sanguine Gore Burst",
    icon: "spell_shadow_bloodboil",
    maxRanks: 3,
    position: { x: 1, y: 1.5 },
    requires: "sh_t1_sanguine_strike",
    spell: {
      name: "Sanguine Gore Burst",
      description: "Spend 2 DT: detonate boiling blood within an enemy within 35 feet. Deals 3d8 blight damage in a 20-foot radius, heals you for 1d6, and blinds enemies for 1 round.",
      flavorText: "Life essence erupts in a burst of frozen gore.",
      source: "talent", class: "Revenant", treeId: "sanguine_harvest",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "ranged", range: 35, aoeShape: "circle", aoeSize: 20,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 8, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { deathToll: { baseAmount: 2 } },
      damageTypes: ["blight"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      debuffs: ["blind"], visualTheme: "blood", tags: ["aoe", "burst", "lifesteal", "blind", "revenant"]
    },
    rankUpgrades: [
      { description: "25-foot radius deals 3d8 damage, heals for 2d6, and bleeds victims for 1d6 per round.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 }, aoeSize: 25 },
      { description: "30-foot radius deals 4d8 damage, heals for 2d6, bleeds for 2d6, and knocks enemies prone.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 }, aoeSize: 30 }
    ]
  },
  {
    id: "sh_t2_rush_of_blood",
    name: "Desperate Siphon",
    icon: "spell_shadow_lifedrain",
    maxRanks: 3,
    position: { x: 3, y: 1.5 },
    requires: "sh_t1_sanguine_mastery",
    spell: {
      name: "Desperate Siphon",
      description: "While below 50% health, your life drain abilities deal +10% increased damage and cost 1 fewer Action Point.",
      flavorText: "Desperation awakens the chill blood-magic buried in your veins.",
      source: "talent", class: "Revenant", treeId: "sanguine_harvest",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", visualTheme: "blood", tags: ["passive", "low-hp-amp", "ap-reduction", "revenant"]
    },
    rankUpgrades: [
      { description: "Below 50% HP: deal +15% damage, cost 1 fewer AP, and heal for +25% more." },
      { description: "Below 50% HP: deal +20% damage, cost 1 fewer AP, heal for +35% more, and gain +2 Durability Steps to equipped durability." }
    ]
  },

  // ──────────────── TIER 3 (6 pts) ────────────────
  {
    id: "sh_t3_exsanguinate",
    name: "Exsanguinating Grasp",
    icon: "spell_shadow_lifedrain02",
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: "sh_t2_sanguine_burst",
    spell: {
      name: "Exsanguinating Grasp",
      description: "Spend 3 DT: channel a continuous beam of blood siphon onto a target within 45 feet for 2 rounds. Deals 4d8 blight damage per round, slows the target by 15 feet, and transfers 50% of damage dealt into your HP.",
      flavorText: "Draining the living dry in a ceaseless crimson thread.",
      source: "talent", class: "Revenant", treeId: "sanguine_harvest",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "ranged", range: 45,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 16, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: true,
      resourceCosts: { deathToll: { baseAmount: 3 } },
      damageTypes: ["blight"],
      primaryDamage: { dice: "4d8", flat: 0, procChance: 100 },
      isDot: true, dotDuration: 2, dotTick: "4d8",
      debuffs: ["slow"], visualTheme: "blood", tags: ["channel", "single-nuke", "lifesteal", "revenant"]
    },
    rankUpgrades: [
      { description: "Deals 5d8 per round and grants 15 temporary health.", dotTick: "5d8" },
      { description: "Deals 5d8 per round, grants 20 temp HP, and refunds 2 DT on target death.", dotTick: "5d8" }
    ]
  },
  {
    id: "sh_t3_vampiric_empowerment",
    name: "Vampiric Feast",
    icon: "spell_shadow_soulleech_3",
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: "sh_t2_rush_of_blood",
    spell: {
      name: "Vampiric Feast",
      description: "Whenever an enemy dies from your life drain spells, gain 3 Death Toll, heal for 25% of max HP, and all your abilities deal +10% damage for 2 rounds.",
      flavorText: "The Archive rewards draining the weak with sovereign vitality.",
      source: "talent", class: "Revenant", treeId: "sanguine_harvest",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "blood", tags: ["passive", "heal-on-kill", "damage-buff", "revenant"]
    },
    rankUpgrades: [
      { description: "Kills grant 4 DT, heal for 30%, +15% damage, and +10ft movement speed." },
      { description: "Kills grant 5 DT, heal for 35%, +20% damage, +15ft speed, and 20 temporary health." }
    ]
  },

  // ──────────────── TIER 4 (5 pts) ────────────────
  {
    id: "sh_t4_blood_storm",
    name: "Maelstrom of Frozen Blood",
    icon: "spell_shadow_bloodrain",
    maxRanks: 3,
    position: { x: 1, y: 4.5 },
    requires: "sh_t3_exsanguinate",
    spell: {
      name: "Maelstrom of Frozen Blood",
      description: "Spend 4 DT: summon a 30-foot vortex of razor frozen blood within 50 feet for 3 rounds. Deals 2d6 blight/rime damage per round, slows all enemies by 15ft, and heals you and allies inside for 20% of damage dealt.",
      flavorText: "A blizzard of crimson ice flensing flesh from bone.",
      source: "talent", class: "Revenant", treeId: "sanguine_harvest",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "ranged", range: 50, aoeShape: "circle", aoeSize: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 20, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { deathToll: { baseAmount: 4 } },
      damageTypes: ["blight", "rime"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      isDot: true, dotDuration: 3, dotTick: "2d6",
      visualTheme: "blood", tags: ["aoe-vortex", "party-heal", "slow", "revenant"]
    },
    rankUpgrades: [
      { description: "35-foot vortex deals 3d6 per round, heals party for 25%, and cooldown drops to 16s.", dotTick: "3d6", aoeSize: 35, cooldownValue: 16 },
      { description: "40-foot vortex deals 3d6 per round, heals for 30%, silences enemies, and grants allies +2 Durability Steps to equipped durability.", dotTick: "3d6", aoeSize: 40, cooldownValue: 14 }
    ]
  },
  {
    id: "sh_t4_blood_barrier",
    name: "Coagulated Blood Shield",
    icon: "spell_holy_powerwordbarrier",
    maxRanks: 2,
    position: { x: 3.5, y: 4.5 },
    requires: "sh_t3_vampiric_empowerment",
    spell: {
      name: "Coagulated Blood Shield",
      description: "Overhealing from your life drain spells converts directly into a permanent blood shield (up to 50 temporary health).",
      flavorText: "Hardened crimson crust that turns aside blades.",
      source: "talent", class: "Revenant", treeId: "sanguine_harvest",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "blood", tags: ["passive", "overheal-shield", "defense", "revenant"]
    },
    rankUpgrades: [
      { description: "Shield caps at 100 temp HP and reflects 30% of absorbed damage back as blood damage." }
    ]
  },

  // ──────────────── TIER 5 (5 pts) ────────────────
  {
    id: "sh_t5_crimson_cataclysm",
    name: "Heart-Burst Cataclysm",
    icon: "spell_shadow_bloodboil",
    maxRanks: 2,
    position: { x: 1, y: 6 },
    requires: "sh_t4_blood_storm",
    spell: {
      name: "Heart-Burst Cataclysm",
      description: "Spend 5 DT: detonate the blood supply of all enemies within 40 feet. Deals 5d8 blight damage, stuns all enemies for 1 round, and heals you and all allies for 30% of max health.",
      flavorText: "Forcing every heart in the room to rupture simultaneously.",
      source: "talent", class: "Revenant", treeId: "sanguine_harvest",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 40,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 30, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { deathToll: { baseAmount: 5 } },
      damageTypes: ["blight"],
      primaryDamage: { dice: "5d8", flat: 0, procChance: 100 },
      healing: { dice: "5d8", flat: 0 },
      debuffs: ["stun"], visualTheme: "blood", tags: ["mass-nuke", "mass-stun", "party-heal", "revenant"]
    },
    rankUpgrades: [
      { description: "50-foot radius deals 6d8 damage, stuns for 1 round, and cooldown drops to 24s.", primaryDamage: { dice: "6d8", flat: 0, procChance: 100 }, aoeSize: 50, cooldownValue: 24 }
    ]
  },
  {
    id: "sh_t5_sanguine_avatar_passive",
    name: "Blood Sovereign Form",
    icon: "spell_shadow_lifedrain02",
    maxRanks: 3,
    position: { x: 3, y: 6 },
    requires: "sh_t4_blood_barrier",
    spell: {
      name: "Blood Sovereign Form",
      description: "While at 5+ Death Toll, you gain +2 Durability Steps to equipped durability, 20% all-damage resistance, and all your attacks deal +1d8 bonus blight damage.",
      flavorText: "Clothed in the living blood of a thousand fallen foes.",
      source: "talent", class: "Revenant", treeId: "sanguine_harvest",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["blight"],
      primaryDamage: { dice: "1d8", flat: 0, procChance: 100 },
      visualTheme: "blood", tags: ["passive", "dt-threshold", "durability", "dr", "revenant"]
    },
    rankUpgrades: [
      { description: "At 5+ DT: gain +3 Durability Steps to equipped durability, 25% resistance, and +2d8 bonus damage." },
      { description: "At 4+ DT: gain +4 Durability Steps to equipped durability, 30% resistance, +2d8 bonus damage, and attacks score crits on 18+." }
    ]
  },

  // ──────────────── TIER 6 (5 pts) ────────────────
  {
    id: "sh_t6_the_blood_gods_harvest",
    name: "Avatar of the Sanguine Lord",
    icon: "spell_shadow_unholyfrenzy",
    maxRanks: 1,
    position: { x: 1, y: 7.5 },
    requires: "sh_t5_crimson_cataclysm",
    spell: {
      name: "Avatar of the Sanguine Lord",
      description: "Spend 6 DT: transform into the Colossal Blood Sovereign for 1 minute: continuous blood storms strike all enemies within 50 feet for 6d10 damage each round, all your attacks have 50% lifesteal, and you gain +2 Durability Steps to equipped durability.",
      flavorText: "The Frozen Archive's bloodline made incarnate.",
      source: "talent", class: "Revenant", treeId: "sanguine_harvest",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 90, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { deathToll: { baseAmount: 6 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      buffs: ["sanguine-lord"], visualTheme: "blood", tags: ["blood-avatar", "lifesteal", "revenant"]
    },
    rankUpgrades: []
  },
  {
    id: "sh_t6_blood_criticality",
    name: "Severing Arteries",
    icon: "ability_rogue_eviscerate",
    maxRanks: 2,
    position: { x: 2.5, y: 7.5 },
    requires: "sh_t5_sanguine_avatar_passive",
    spell: {
      name: "Severing Arteries",
      description: "All blood and blight spells score critical hits on 18+ and critical hits cause the target to bleed for 3d8 blight damage over 2 rounds.",
      flavorText: "Arteries torn open with surgical brutality.",
      source: "talent", class: "Revenant", treeId: "sanguine_harvest",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["blight"],
      visualTheme: "blood", tags: ["passive", "crit", "artery-bleed", "revenant"]
    },
    rankUpgrades: [
      { description: "Crits on 17+; bleed deals 4d8 blight damage and shreds 25% of enemy durability." }
    ]
  },
  {
    id: "sh_t6_undying_bloodline",
    name: "Crimson Immortality Shroud",
    icon: "spell_holy_powerwordbarrier",
    maxRanks: 2,
    position: { x: 4, y: 7.5 },
    requires: "sh_t5_sanguine_avatar_passive",
    spell: {
      name: "Crimson Immortality Shroud",
      description: "You take 35% less damage from damage-over-time effects and bleeds, and you gain +2 Durability Steps to equipped durability.",
      flavorText: "Your blood is already dead; it cannot be poisoned.",
      source: "talent", class: "Revenant", treeId: "sanguine_harvest",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "blood", tags: ["passive", "dot-resist", "durability", "revenant"]
    },
    rankUpgrades: [
      { description: "Take 35% less DoT damage; gain +4 Durability Steps to equipped durability and 15% resistance to all magical damage." }
    ]
  },

  // ──────────────── TIER 7 / CAPSTONE (15 pts) ────────────────
  {
    id: "sh_t7_grand_blood_reap",
    name: "Cataclysmic Blood Ocean",
    icon: "spell_shadow_bloodrain",
    maxRanks: 1,
    position: { x: 0.5, y: 8 },
    requires: "sh_t6_the_blood_gods_harvest",
    spell: {
      name: "Cataclysmic Blood Ocean",
      description: "ULTIMATE: Spend 8 DT: drown the entire 60-foot battlefield in an ocean of boiling necrotic blood for 1 minute: all enemies take 8d10 blight damage each round, lose 25% durability, and all party members gain +60 temporary health and 50% lifesteal.",
      flavorText: "The earth drinks, the archive rises, the living drown.",
      source: "talent", class: "Revenant", treeId: "sanguine_harvest",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 180, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { deathToll: { baseAmount: 8 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      damageTypes: ["blight"],
      primaryDamage: { dice: "8d10", flat: 0, procChance: 100 },
      buffs: ["blood-ocean"], visualTheme: "blood", tags: ["ultimate", "capstone", "blood-ocean", "revenant"]
    },
    rankUpgrades: []
  },
  {
    id: "sh_t7_sanguine_doctrine",
    name: "Sanguine Harvest Doctrine",
    icon: "spell_shadow_lifedrain02",
    maxRanks: 5,
    position: { x: 1.5, y: 8 },
    requires: "sh_t6_the_blood_gods_harvest",
    spell: {
      name: "Sanguine Harvest Doctrine",
      description: "All blight, blood, and life drain damage you deal is increased by 10%.",
      flavorText: "Crimson power that outlasts the stars.",
      source: "talent", class: "Revenant", treeId: "sanguine_harvest",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["blight"],
      visualTheme: "blood", tags: ["passive", "capstone", "damage", "revenant"]
    },
    rankUpgrades: [
      { description: "All blight/blood damage increased by 15%." },
      { description: "All blight/blood damage increased by 20%." },
      { description: "All blight/blood damage increased by 25%." },
      { description: "All blight/blood damage increased by 30%, and Sanguine Syphon Strike costs 0 mana." }
    ]
  },
  {
    id: "sh_t7_infinite_toll_engine",
    name: "Endless Death Toll Reservoir",
    icon: "spell_shadow_soulleech_3",
    maxRanks: 3,
    position: { x: 2.5, y: 8 },
    requires: "sh_t6_blood_criticality",
    spell: {
      name: "Endless Death Toll Reservoir",
      description: "Your maximum Death Toll increases by 8. Whenever you deal blight damage, generate 1 Death Toll.",
      flavorText: "Every cut registers a toll in the ledger.",
      source: "talent", class: "Revenant", treeId: "sanguine_harvest",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "blood", tags: ["passive", "capstone", "dt-engine", "revenant"]
    },
    rankUpgrades: [
      { description: "Max DT +10; generate 2 DT per hit and movement speed +10ft." },
      { description: "Max DT +12; generate 3 DT per hit and abilities cost 1 fewer DT." }
    ]
  },
  {
    id: "sh_t7_blood_execution",
    name: "Arterial Decapitation",
    icon: "ability_rogue_shadowdance",
    maxRanks: 3,
    position: { x: 3.5, y: 8 },
    requires: "sh_t6_blood_criticality",
    spell: {
      name: "Arterial Decapitation",
      description: "When an enemy below 20% health takes blood damage from you, they have a 15% chance to be executed instantly.",
      flavorText: "The blood leaves the body all at once.",
      source: "talent", class: "Revenant", treeId: "sanguine_harvest",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", visualTheme: "blood", tags: ["passive", "capstone", "instant-kill", "revenant"]
    },
    rankUpgrades: [
      { description: "20% chance to execute below 25% HP; deals +5d8 blight damage against bosses." },
      { description: "25% chance to execute below 30% HP; deals +10d8 blight damage against bosses." }
    ]
  },
  {
    id: "sh_t7_sanguine_rebirth",
    name: "Bloodpool Rebirth",
    icon: "spell_shadow_lifedrain02",
    maxRanks: 3,
    position: { x: 4.5, y: 8 },
    requires: "sh_t6_undying_bloodline",
    spell: {
      name: "Bloodpool Rebirth",
      description: "While at 3+ Death Toll, lethal damage dissolves you into a pool of blood: prevents death, restores 40% health, 30 temp HP, and sets DT to 5 (cooldown: 180s).",
      flavorText: "You cannot bleed to death when you are made of blood.",
      source: "talent", class: "Revenant", treeId: "sanguine_harvest",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "blood", tags: ["passive", "capstone", "cheat-death", "revenant"]
    },
    rankUpgrades: [
      { description: "Survive lethal damage, restore 60% health, 40 temp HP, full DT (cooldown: 120s)." },
      { description: "Survive lethal damage, restore 75% health, 50 temp HP, full DT (cooldown: 90s)." }
    ]
  }
];

// ============================================
// 2. REVENANT — FROST SOVEREIGN
// ============================================
export const REVENANT_FROST_SOVEREIGN = [
  // ──────────────── TIER 1 (8 pts) ────────────────
  {
    id: "fs_t1_frost_lance_shatter",
    name: "Glacial Shatter Lance",
    icon: "spell_frost_frostbolt",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Glacial Shatter Lance",
      description: "Hurl a spear of black necrotic ice within 50 feet: deals 3d8 frost damage, freezes the target for 1 round, and generates 2 Death Toll.",
      flavorText: "The Frozen Archive's chill focuses into deadly precision.",
      source: "talent", class: "Revenant", treeId: "frost_sovereign",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "ranged", range: 50,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 6, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 4 } },
      damageTypes: ["rime"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      debuffs: ["frozen"], visualTheme: "rime", tags: ["single-nuke", "freeze", "dt-builder", "revenant"]
    },
    rankUpgrades: [
      { description: "Deals 5d8 frost damage, freeze lasts 2 rounds, and pierces 30% resistance.", primaryDamage: { dice: "5d8", flat: 0, procChance: 100 } },
      { description: "Deals 7d8 frost damage, freeze lasts 2 rounds, pierces 50% resistance, and shatters for 3d8 AoE frost on target hit.", primaryDamage: { dice: "7d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "fs_t1_eternal_focus",
    name: "Black Ice Mastery",
    icon: "spell_frost_frostarmor02",
    maxRanks: 3,
    position: { x: 2.5, y: 0 },
    requires: null,
    spell: {
      name: "Black Ice Mastery",
      description: "All your frost spells deal +20% damage to frozen targets and your freeze save DC increases by +2.",
      flavorText: "The Archive's ancient frost guides every spell.",
      source: "talent", class: "Revenant", treeId: "frost_sovereign",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["rime"],
      visualTheme: "rime", tags: ["passive", "freeze-amp", "dc-boost", "revenant"]
    },
    rankUpgrades: [
      { description: "Deal +35% damage to frozen targets and save DC +3." },
      { description: "Deal +50% damage to frozen targets, save DC +4, and +2 Durability Steps to equipped durability." }
    ]
  },
  {
    id: "fs_t1_chilling_presence",
    name: "Sub-Zero Shroud",
    icon: "spell_frost_frostshock",
    maxRanks: 2,
    position: { x: 4, y: 0 },
    requires: null,
    spell: {
      name: "Sub-Zero Shroud",
      description: "You emit a 15-foot aura of biting frost: enemies inside are slowed by 15ft and take 1d6 frost damage per round.",
      flavorText: "Undead cold radiates from the frozen sovereign.",
      source: "talent", class: "Revenant", treeId: "frost_sovereign",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["rime"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "rime", tags: ["passive", "slow-aura", "dot", "revenant"]
    },
    rankUpgrades: [
      { description: "Aura radius 25 feet: enemies slowed by 25ft and take 2d6 frost per round." }
    ]
  },

  // ──────────────── TIER 2 (6 pts) ────────────────
  {
    id: "fs_t2_glacial_cascade",
    name: "Glacial Chain Shatter",
    icon: "spell_frost_icestorm",
    maxRanks: 3,
    position: { x: 1, y: 1.5 },
    requires: "fs_t1_frost_lance_shatter",
    spell: {
      name: "Glacial Chain Shatter",
      description: "Spend 2 DT: cause all frozen enemies within 50 feet to shatter violently. Deals 5d8 frost damage to each target and 3d8 frost damage to all adjacent enemies, chaining the freeze effect.",
      flavorText: "Necrotic ice shatters, seeking fresh warmth to extinguish.",
      source: "talent", class: "Revenant", treeId: "frost_sovereign",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 50,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 8, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { deathToll: { baseAmount: 2 } },
      damageTypes: ["rime"],
      primaryDamage: { dice: "5d8", flat: 0, procChance: 100 },
      visualTheme: "rime", tags: ["mass-shatter", "aoe", "chain-freeze", "revenant"]
    },
    rankUpgrades: [
      { description: "Deals 7d8 frost damage + 5d8 splash, and pierces 40% resistance.", primaryDamage: { dice: "7d8", flat: 0, procChance: 100 } },
      { description: "Deals 9d8 frost damage + 7d8 splash, stuns all hit targets for 1 round, and refunds 2 DT.", primaryDamage: { dice: "9d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "fs_t2_ice_bond",
    name: "Glacial Synapse Bond",
    icon: "spell_frost_frozencore",
    maxRanks: 3,
    position: { x: 3, y: 1.5 },
    requires: "fs_t1_eternal_focus",
    spell: {
      name: "Glacial Synapse Bond",
      description: "All frozen enemies share 50% of all damage taken with other frozen enemies within 30 feet.",
      flavorText: "The Archive links its frozen children in shared suffering.",
      source: "talent", class: "Revenant", treeId: "frost_sovereign",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", visualTheme: "rime", tags: ["passive", "damage-share", "frozen-network", "revenant"]
    },
    rankUpgrades: [
      { description: "Frozen enemies share 75% of damage taken." },
      { description: "Frozen enemies share 100% full damage taken and have vulnerability to physical damage." }
    ]
  },

  // ──────────────── TIER 3 (6 pts) ────────────────
  {
    id: "fs_t3_permafrost_prison",
    name: "Permafrost Dominion Sphere",
    icon: "spell_frost_wisp",
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: "fs_t2_glacial_cascade",
    spell: {
      name: "Permafrost Dominion Sphere",
      description: "Spend 3 DT: encase a 25-foot area within 50 feet in absolute permafrost for 3 rounds. All enemies inside are frozen solid, cannot be healed, and take 4d8 frost damage per round.",
      flavorText: "The everlasting cold denies all warmth and restoration.",
      source: "talent", class: "Revenant", treeId: "frost_sovereign",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "aoe", rangeType: "ranged", range: 50, aoeShape: "circle", aoeSize: 25,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 16, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { deathToll: { baseAmount: 3 } },
      damageTypes: ["rime"],
      primaryDamage: { dice: "4d8", flat: 0, procChance: 100 },
      isDot: true, dotDuration: 3, dotTick: "4d8",
      debuffs: ["frozen", "heal-block"], visualTheme: "rime", tags: ["zone", "heal-block", "mass-freeze", "revenant"]
    },
    rankUpgrades: [
      { description: "30-foot sphere deals 6d8 frost per round, heal-blocked, cooldown drops to 12s.", dotTick: "6d8", aoeSize: 30, cooldownValue: 12 },
      { description: "35-foot sphere deals 8d8 frost per round, heal-blocked, and all damage against frozen targets crits on 17+.", dotTick: "8d8", aoeSize: 35, cooldownValue: 10 }
    ]
  },
  {
    id: "fs_t3_absolute_zero",
    name: "Absolute Zero Vulnerability",
    icon: "spell_frost_arcticwinds",
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: "fs_t2_ice_bond",
    spell: {
      name: "Absolute Zero Vulnerability",
      description: "Frozen enemies have vulnerability to ALL damage sources (+50% bonus damage taken) and their durability is reduced to 0.",
      flavorText: "At the Archive's heart, all things are brittle and breakable.",
      source: "talent", class: "Revenant", treeId: "frost_sovereign",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", visualTheme: "rime", tags: ["passive", "vulnerability", "zero-durability", "revenant"]
    },
    rankUpgrades: [
      { description: "Frozen enemies take +75% bonus damage from all sources." },
      { description: "Frozen enemies take double damage (+100%) from all sources and cannot use reactions." }
    ]
  },

  // ──────────────── TIER 4 (5 pts) ────────────────
  {
    id: "fs_t4_ice_comet",
    name: "Glacial Extinction Comet",
    icon: "spell_frost_frostnova",
    maxRanks: 3,
    position: { x: 1, y: 4.5 },
    requires: "fs_t3_permafrost_prison",
    spell: {
      name: "Glacial Extinction Comet",
      description: "Spend 4 DT: call down a colossal black ice comet within 60 feet. Deals 8d10 frost/bludgeoning damage in a 30-foot radius, freezes all survivors for 2 rounds, and covers the ground in razor ice for 1 minute.",
      flavorText: "A chunk of the frozen archive falling from the blackened heavens.",
      source: "talent", class: "Revenant", treeId: "frost_sovereign",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "ranged", range: 60, aoeShape: "circle", aoeSize: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 20, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { deathToll: { baseAmount: 4 } },
      damageTypes: ["rime", "smashing"],
      primaryDamage: { dice: "8d10", flat: 0, procChance: 100 },
      debuffs: ["frozen"], visualTheme: "rime", tags: ["aoe-nuke", "mass-freeze", "terrain", "revenant"]
    },
    rankUpgrades: [
      { description: "35-foot comet deals 11d10 damage, freezes for 2 rounds, cooldown drops to 16s.", primaryDamage: { dice: "11d10", flat: 0, procChance: 100 }, aoeSize: 35, cooldownValue: 16 },
      { description: "40-foot comet deals 14d10 damage, shatters all existing frozen targets for double damage, and refunds 2 DT.", primaryDamage: { dice: "14d10", flat: 0, procChance: 100 }, aoeSize: 40, cooldownValue: 12 }
    ]
  },
  {
    id: "fs_t4_frost_shield",
    name: "Glacial Armor Shell",
    icon: "spell_frost_frostarmor",
    maxRanks: 2,
    position: { x: 3.5, y: 4.5 },
    requires: "fs_t3_absolute_zero",
    spell: {
      name: "Glacial Armor Shell",
      description: "Whenever an enemy is frozen, gain +2 Durability Steps to equipped durability (stacks up to +10 Durability Steps to equipped durability) and a 20-damage ice barrier.",
      flavorText: "Surrounding cold forged into defensive plates.",
      source: "talent", class: "Revenant", treeId: "frost_sovereign",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "rime", tags: ["passive", "stacking-durability", "ice-barrier", "revenant"]
    },
    rankUpgrades: [
      { description: "Gain +3 Durability Steps to equipped durability per frozen enemy (up to +18 Durability Steps to equipped durability) and 40-damage barrier that reflects frost damage." }
    ]
  },

  // ──────────────── TIER 5 (5 pts) ────────────────
  {
    id: "fs_t5_shatter_protocol",
    name: "Universal Shatter Protocol",
    icon: "spell_frost_frostnova",
    maxRanks: 2,
    position: { x: 1, y: 6 },
    requires: "fs_t4_ice_comet",
    spell: {
      name: "Universal Shatter Protocol",
      description: "Spend 5 DT: detonate every frozen entity across the entire battlefield. Deals 12d10 frost true damage to all frozen targets, instakills all non-boss frozen foes below 40% HP, and grants 50 temporary health.",
      flavorText: "The command that splinters the army of ice into nothingness.",
      source: "talent", class: "Revenant", treeId: "frost_sovereign",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 30, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { deathToll: { baseAmount: 5 } },
      damageTypes: ["rime"],
      primaryDamage: { dice: "12d10", flat: 0, procChance: 100 },
      visualTheme: "rime", tags: ["mass-execute", "mass-shatter", "nuke", "revenant"]
    },
    rankUpgrades: [
      { description: "Deals 16d10 frost true damage, instakills non-bosses below 50% HP, and cooldown drops to 24s.", primaryDamage: { dice: "16d10", flat: 0, procChance: 100 }, cooldownValue: 24 }
    ]
  },
  {
    id: "fs_t5_endless_winter",
    name: "Endless Winter Engine",
    icon: "spell_frost_wisp",
    maxRanks: 3,
    position: { x: 3, y: 6 },
    requires: "fs_t4_frost_shield",
    spell: {
      name: "Endless Winter Engine",
      description: "Your maximum Death Toll increases by 6. At 5+ Death Toll, all your frost spells freeze enemies unconditionally on hit for 1 round.",
      flavorText: "Winter with no end and no spring.",
      source: "talent", class: "Revenant", treeId: "frost_sovereign",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "rime", tags: ["passive", "auto-freeze", "dt-engine", "revenant"]
    },
    rankUpgrades: [
      { description: "Max DT +10; auto-freeze lasts 2 rounds and frost damage increases by +30%." },
      { description: "Max DT +15; auto-freeze lasts 2 rounds, frost damage +50%, and spells cost 1 fewer DT." }
    ]
  },

  // ──────────────── TIER 6 (5 pts) ────────────────
  {
    id: "fs_t6_the_frost_sovereign",
    name: "Avatar of the Glacial Lich",
    icon: "spell_frost_wisp",
    maxRanks: 1,
    position: { x: 1, y: 7.5 },
    requires: "fs_t5_shatter_protocol",
    spell: {
      name: "Avatar of the Glacial Lich",
      description: "Spend 6 DT: ascend into the Glacial Lich Sovereign for 1 minute: continuous blizzards freeze all enemies within 50 feet automatically every round, all frost spells deal maximum dice damage, and you take 50% less damage.",
      flavorText: "The crown of ice rests upon the rightful monarch of the dead.",
      source: "talent", class: "Revenant", treeId: "frost_sovereign",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 90, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { deathToll: { baseAmount: 6 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      buffs: ["glacial-lich"], visualTheme: "rime", tags: ["god-mode", "perma-freeze", "maximize", "revenant"]
    },
    rankUpgrades: []
  },
  {
    id: "fs_t6_shatter_criticality",
    name: "Glacial Splinter Crits",
    icon: "spell_frost_frostnova",
    maxRanks: 2,
    position: { x: 2.5, y: 7.5 },
    requires: "fs_t5_endless_winter",
    spell: {
      name: "Glacial Splinter Crits",
      description: "All frost damage against frozen targets scores critical hits on 17+ and deals triple critical damage.",
      flavorText: "Brittle ice shattered with catastrophic momentum.",
      source: "talent", class: "Revenant", treeId: "frost_sovereign",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", visualTheme: "rime", tags: ["passive", "crit", "triple-damage", "revenant"]
    },
    rankUpgrades: [
      { description: "Crits on 16+; deals quadruple damage and critical hits refund 2 Death Toll." }
    ]
  },
  {
    id: "fs_t6_absolute_permafrost_wall",
    name: "Permafrost Bastion",
    icon: "spell_holy_powerwordbarrier",
    maxRanks: 2,
    position: { x: 4, y: 7.5 },
    requires: "fs_t5_endless_winter",
    spell: {
      name: "Permafrost Bastion",
      description: "While at least one enemy is frozen, you cannot take more than 25 damage from any single attack.",
      flavorText: "The enemy's momentum is frozen before it reaches you.",
      source: "talent", class: "Revenant", treeId: "frost_sovereign",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "rime", tags: ["passive", "damage-clamp", "defense", "revenant"]
    },
    rankUpgrades: [
      { description: "Single attack damage capped at 15 damage, and attackers are frozen for 1 round on hit." }
    ]
  },

  // ──────────────── TIER 7 / CAPSTONE (15 pts) ────────────────
  {
    id: "fs_t7_universal_extinction_ice",
    name: "The Final Glaciation Cataclysm",
    icon: "spell_frost_icestorm",
    maxRanks: 1,
    position: { x: 0.5, y: 8 },
    requires: "fs_t6_the_frost_sovereign",
    spell: {
      name: "The Final Glaciation Cataclysm",
      description: "ULTIMATE: Spend 8 DT: freeze the entire battlefield in an unbreakable epoch of black ice for 1 minute: all enemies take 12d10 frost true damage every round, cannot move or act, and any frozen enemy that drops below 50% HP shatters into dust.",
      flavorText: "An ice age condensed into sixty seconds of absolute stillness.",
      source: "talent", class: "Revenant", treeId: "frost_sovereign",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 180, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { deathToll: { baseAmount: 8 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      damageTypes: ["rime"],
      primaryDamage: { dice: "12d10", flat: 0, procChance: 100 },
      buffs: ["final-glaciation"], visualTheme: "rime", tags: ["ultimate", "capstone", "perma-freeze", "revenant"]
    },
    rankUpgrades: []
  },
  {
    id: "fs_t7_frost_sovereign_doctrine",
    name: "Frost Sovereign Doctrine",
    icon: "spell_frost_frostbolt",
    maxRanks: 5,
    position: { x: 1.5, y: 8 },
    requires: "fs_t6_the_frost_sovereign",
    spell: {
      name: "Frost Sovereign Doctrine",
      description: "All frost and shatter damage you deal is increased by 10%.",
      flavorText: "The black frost knows only obedience.",
      source: "talent", class: "Revenant", treeId: "frost_sovereign",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["rime"],
      visualTheme: "rime", tags: ["passive", "capstone", "damage", "revenant"]
    },
    rankUpgrades: [
      { description: "All frost and shatter damage increased by 20%." },
      { description: "All frost and shatter damage increased by 35%." },
      { description: "All frost and shatter damage increased by 50%." },
      { description: "All frost and shatter damage increased by 70%, and Glacial Shatter Lance costs 0 mana." }
    ]
  },
  {
    id: "fs_t7_infinite_ice_battery",
    name: "Glacial Core Reservoir",
    icon: "spell_frost_frozencore",
    maxRanks: 3,
    position: { x: 2.5, y: 8 },
    requires: "fs_t6_shatter_criticality",
    spell: {
      name: "Glacial Core Reservoir",
      description: "Your maximum Death Toll increases by 10. Whenever an enemy is frozen, generate 2 Death Toll.",
      flavorText: "A battery cooled to absolute zero.",
      source: "talent", class: "Revenant", treeId: "frost_sovereign",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "rime", tags: ["passive", "capstone", "dt-engine", "revenant"]
    },
    rankUpgrades: [
      { description: "Max DT +15; generate 3 DT per freeze and movement speed +15ft." },
      { description: "Max DT +20; generate 4 DT per freeze and all frost spells cast instantly." }
    ]
  },
  {
    id: "fs_t7_cataclysmic_shatters",
    name: "Chain Reaction Shatters",
    icon: "spell_frost_frostnova",
    maxRanks: 3,
    position: { x: 3.5, y: 8 },
    requires: "fs_t6_shatter_criticality",
    spell: {
      name: "Chain Reaction Shatters",
      description: "When a frozen target shatters, adjacent enemies are automatically frozen and shattered 1 round later for free.",
      flavorText: "The frost avalanche that cannot be halted.",
      source: "talent", class: "Revenant", treeId: "frost_sovereign",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", visualTheme: "rime", tags: ["passive", "capstone", "chain-shatter", "revenant"]
    },
    rankUpgrades: [
      { description: "Chain shatter deals +50% bonus frost damage." },
      { description: "Chain shatter deals double damage and refunds all DT spent." }
    ]
  },
  {
    id: "fs_t7_glacial_rebirth",
    name: "Ice Tomb Rebirth",
    icon: "spell_frost_frostarmor02",
    maxRanks: 3,
    position: { x: 4.5, y: 8 },
    requires: "fs_t6_absolute_permafrost_wall",
    spell: {
      name: "Ice Tomb Rebirth",
      description: "While at 3+ DT, lethal damage encases you in an impenetrable ice tomb: prevents death, restores 50% health, 50 temp HP, sets DT to max, and freezes all enemies within 40 feet for 2 rounds (cooldown: 120s).",
      flavorText: "The tomb shatters to release the undying monarch.",
      source: "talent", class: "Revenant", treeId: "frost_sovereign",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "rime", tags: ["passive", "capstone", "cheat-death", "revenant"]
    },
    rankUpgrades: [
      { description: "Survive lethal damage, restore 75% health, 75 temp HP, full DT (cooldown: 90s)." },
      { description: "Survive lethal damage, restore 100% health, and immediately activate The Final Glaciation Cataclysm for free (cooldown: 60s)." }
    ]
  }
];

// ============================================
// 3. REVENANT — PHYLACTERY ANCHOR
// ============================================
export const REVENANT_PHYLACTERY_ANCHOR = [
  // ──────────────── TIER 1 (8 pts) ────────────────
  {
    id: "pa_t1_phylactery_ward",
    name: "Phylactery Soul Shield",
    icon: "spell_frost_frozencore",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Phylactery Soul Shield",
      description: "Channel necrotic frost into your soul phylactery: gain a 30-damage soul shield for 1 minute, +2 Durability Steps to equipped durability, and generate 2 Death Toll.",
      flavorText: "The Archive's necrotic frost anchors souls beyond the veil.",
      source: "talent", class: "Revenant", treeId: "phylactery_anchor",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 6, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { mana: { baseAmount: 3 } },
      buffs: ["soul-shield"], visualTheme: "wyrd", tags: ["shield", "durability", "dt-builder", "revenant"]
    },
    rankUpgrades: [
      { description: "Gain 50-damage shield, +4 Durability Steps to equipped durability, and generate 3 DT.", cooldownValue: 5 },
      { description: "Gain 75-damage shield, +6 Durability Steps to equipped durability, generate 4 DT, and reflects 30% absorbed damage as frost.", cooldownValue: 4 }
    ]
  },
  {
    id: "pa_t1_vital_reserve",
    name: "Soul Battery Capacity",
    icon: "spell_shadow_lifedrain",
    maxRanks: 3,
    position: { x: 2.5, y: 0 },
    requires: null,
    spell: {
      name: "Soul Battery Capacity",
      description: "Your maximum Phylactery HP increases by 30 and you gain +20% maximum health.",
      flavorText: "Stolen life essence crystallizes within the cold phylactery.",
      source: "talent", class: "Revenant", treeId: "phylactery_anchor",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "phylactery-cap", "health", "revenant"]
    },
    rankUpgrades: [
      { description: "Phylactery HP +50, max health +35%, and gain +2 Durability Steps to equipped durability." },
      { description: "Phylactery HP +80, max health +50%, +4 Durability Steps to equipped durability, and regenerate 2d6 HP per round in combat." }
    ]
  },
  {
    id: "pa_t1_deathly_resilience",
    name: "Undying Fortitude",
    icon: "spell_shadow_antishadow",
    maxRanks: 2,
    position: { x: 4, y: 0 },
    requires: null,
    spell: {
      name: "Undying Fortitude",
      description: "You take 15% less damage from all physical and magical sources while your phylactery holds charge.",
      flavorText: "The Archive's undying pact refuses the call of oblivion.",
      source: "talent", class: "Revenant", treeId: "phylactery_anchor",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "dr", "defense", "revenant"]
    },
    rankUpgrades: [
      { description: "Take 30% less damage and you cannot be knocked down or displaced." }
    ]
  },

  // ──────────────── TIER 2 (6 pts) ────────────────
  {
    id: "pa_t2_soul_anchor_strike",
    name: "Soul Anchor Strike",
    icon: "spell_shadow_soulleech_3",
    maxRanks: 3,
    position: { x: 1, y: 1.5 },
    requires: "pa_t1_phylactery_ward",
    spell: {
      name: "Soul Anchor Strike",
      description: "Spend 2 DT: strike an enemy within 10 feet for 4d8 necrotic/frost damage and siphon their soul into your phylactery, charging it for 25 Phylactery HP.",
      flavorText: "Pinning the foe's soul to your personal reliquary.",
      source: "talent", class: "Revenant", treeId: "phylactery_anchor",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "melee", range: 10,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 8, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { deathToll: { baseAmount: 2 } },
      damageTypes: ["blight", "rime"],
      primaryDamage: { dice: "4d8", flat: 0, procChance: 100 },
      visualTheme: "wyrd", tags: ["melee", "charge-phylactery", "nuke", "revenant"]
    },
    rankUpgrades: [
      { description: "Deals 6d8 damage, charges phylactery for 40 HP, and stuns target for 1 round.", primaryDamage: { dice: "6d8", flat: 0, procChance: 100 } },
      { description: "Deals 8d8 damage, charges phylactery for 60 HP, stuns for 2 rounds, and refunds the 2 DT.", primaryDamage: { dice: "8d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "pa_t2_phylactery_link",
    name: "Phylactery Party Link",
    icon: "spell_shadow_lifedrain02",
    maxRanks: 3,
    position: { x: 3, y: 1.5 },
    requires: "pa_t1_vital_reserve",
    spell: {
      name: "Phylactery Party Link",
      description: "All allies within 30 feet take 25% less damage, transferring the absorbed damage directly into your phylactery shield instead.",
      flavorText: "Spectral chains of frost bind allies to the phylactery's protection.",
      source: "talent", class: "Revenant", treeId: "phylactery_anchor",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "party-protection", "damage-absorb", "revenant"]
    },
    rankUpgrades: [
      { description: "Allies take 40% less damage; when phylactery absorbs ally damage, heal the ally for 2d6." },
      { description: "Allies take 50% less damage; heal allies for 4d6 and allies gain +3 Durability Steps to equipped durability." }
    ]
  },

  // ──────────────── TIER 3 (6 pts) ────────────────
  {
    id: "pa_t3_frost_barrier_eruption",
    name: "Phylactery Aegis Nova",
    icon: "spell_frost_icebarrier",
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: "pa_t2_soul_anchor_strike",
    spell: {
      name: "Phylactery Aegis Nova",
      description: "Spend 3 DT: erupt the stored soul energy in your phylactery: grants all allies within 35 feet a 40-damage soul ward and taunts all enemies in range to attack you for 2 rounds.",
      flavorText: "Raising walls of frozen soul-stuff to shield the faithful.",
      source: "talent", class: "Revenant", treeId: "phylactery_anchor",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 35,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 16, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { deathToll: { baseAmount: 3 } },
      buffs: ["soul-ward", "mass-taunt"], visualTheme: "wyrd", tags: ["party-shield", "mass-taunt", "tank", "revenant"]
    },
    rankUpgrades: [
      { description: "Grants 65-damage ward, taunts for 3 rounds, and grants you +5 Durability Steps to equipped durability.", cooldownValue: 12 },
      { description: "Grants 90-damage ward, taunts for 3 rounds, +7 Durability Steps to equipped durability, and reflects 50% damage back at attackers.", cooldownValue: 10 }
    ]
  },
  {
    id: "pa_t3_eternal_guardian",
    name: "Deathless Sentinel",
    icon: "spell_frost_frozencore",
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: "pa_t2_phylactery_link",
    spell: {
      name: "Deathless Sentinel",
      description: "While your phylactery has at least 20 HP, your equipped durability durability cannot be degraded and you take 25% less damage from all attacks.",
      flavorText: "The deathless vigil watches over the chosen.",
      source: "talent", class: "Revenant", treeId: "phylactery_anchor",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "immune to durability damage", "tank", "revenant"]
    },
    rankUpgrades: [
      { description: "Take 40% less damage; gain +4 Durability Steps to equipped durability." },
      { description: "Take 55% less damage, +6 Durability Steps to equipped durability, and you generate 2 DT at the start of every turn." }
    ]
  },

  // ──────────────── TIER 4 (5 pts) ────────────────
  {
    id: "pa_t4_soul_drain_wave",
    name: "Phylactery Siphon Wave",
    icon: "spell_shadow_lifedrain",
    maxRanks: 3,
    position: { x: 1, y: 4.5 },
    requires: "pa_t3_frost_barrier_eruption",
    spell: {
      name: "Phylactery Siphon Wave",
      description: "Spend 4 DT: send a 30-foot shockwave through the ground: deals 6d10 necrotic/frost damage to all enemies, charges your phylactery for 10 HP per enemy hit, and knocks all enemies prone.",
      flavorText: "A wave of black frost drinking from the footsteps of the living.",
      source: "talent", class: "Revenant", treeId: "phylactery_anchor",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 20, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { deathToll: { baseAmount: 4 } },
      damageTypes: ["blight", "rime"],
      primaryDamage: { dice: "6d10", flat: 0, procChance: 100 },
      debuffs: ["knockdown"], visualTheme: "wyrd", tags: ["aoe", "knockdown", "charge-phylactery", "revenant"]
    },
    rankUpgrades: [
      { description: "35-foot wave deals 8d10 damage, charges 20 HP per enemy, cooldown drops to 16s.", primaryDamage: { dice: "8d10", flat: 0, procChance: 100 }, aoeSize: 35, cooldownValue: 16 },
      { description: "40-foot wave deals 11d10 damage, charges 30 HP per enemy, stuns for 1 round, and refunds 2 DT.", primaryDamage: { dice: "11d10", flat: 0, procChance: 100 }, aoeSize: 40, cooldownValue: 12 }
    ]
  },
  {
    id: "pa_t4_soul_siphon_passive",
    name: "Ambient Soul Harvest",
    icon: "spell_shadow_soulleech_3",
    maxRanks: 2,
    position: { x: 3.5, y: 4.5 },
    requires: "pa_t3_eternal_guardian",
    spell: {
      name: "Ambient Soul Harvest",
      description: "Whenever an enemy dies anywhere within 50 feet, your phylactery charges for 20 HP and you gain 2 Death Toll.",
      flavorText: "Dying souls are pulled into the Archive's cold embrace.",
      source: "talent", class: "Revenant", treeId: "phylactery_anchor",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "soul-charge", "dt-gain", "revenant"]
    },
    rankUpgrades: [
      { description: "Kills charge phylactery for 40 HP, gain 3 DT, and heal you for 25% max HP." }
    ]
  },

  // ──────────────── TIER 5 (5 pts) ────────────────
  {
    id: "pa_t5_immortal_essence",
    name: "Phylactery Soul Bastion",
    icon: "spell_frost_wisp",
    maxRanks: 2,
    position: { x: 1, y: 6 },
    requires: "pa_t4_soul_drain_wave",
    spell: {
      name: "Phylactery Soul Bastion",
      description: "Spend 5 DT: link your phylactery to the entire party for 3 rounds: all party members become immune to death (HP cannot drop below 1) and all damage taken by any ally charges your phylactery instead.",
      flavorText: "The pact that denies the grave its claim on the tribe.",
      source: "talent", class: "Revenant", treeId: "phylactery_anchor",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 40,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 30, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { deathToll: { baseAmount: 5 } },
      buffs: ["death-immune"], visualTheme: "wyrd", tags: ["invulnerable-party", "climax", "tank", "revenant"]
    },
    rankUpgrades: [
      { description: "Soul Bastion lasts 4 rounds: allies also deal +30% bonus frost damage while protected.", cooldownValue: 24 }
    ]
  },
  {
    id: "pa_t5_undying_anchor",
    name: "Undying Soul Anchor",
    icon: "spell_frost_frozencore",
    maxRanks: 3,
    position: { x: 3, y: 6 },
    requires: "pa_t4_soul_siphon_passive",
    spell: {
      name: "Undying Soul Anchor",
      description: "Your maximum Death Toll increases by 6. While phylactery is above 50% HP, you and all allies gain +3 Durability Steps to equipped durability and +15% damage reduction.",
      flavorText: "An unbreakable anchor pinned into the bedrock of life.",
      source: "talent", class: "Revenant", treeId: "phylactery_anchor",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "party-durability", "dr", "revenant"]
    },
    rankUpgrades: [
      { description: "Gain +5 Durability Steps to equipped durability and +25% damage reduction for the party." },
      { description: "Gain +7 Durability Steps to equipped durability, +35% damage reduction, and party attacks score crits on 18+." }
    ]
  },

  // ──────────────── TIER 6 (5 pts) ────────────────
  {
    id: "pa_t6_the_immortal_phylactery",
    name: "Avatar of the Undying Lichlord",
    icon: "spell_frost_frozencore",
    maxRanks: 1,
    position: { x: 1, y: 7.5 },
    requires: "pa_t5_immortal_essence",
    spell: {
      name: "Avatar of the Undying Lichlord",
      description: "Spend 6 DT: transform into the Immortal Lichlord for 1 minute: your phylactery capacity becomes infinite, all incoming attacks are absorbed by 100%, and you radiate a soul aura dealing 8d10 necrotic damage each round to all foes.",
      flavorText: "Death itself kneels before the master of the anchor.",
      source: "talent", class: "Revenant", treeId: "phylactery_anchor",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 90, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { deathToll: { baseAmount: 6 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      buffs: ["undying-lichlord"], visualTheme: "wyrd", tags: ["god-mode", "infinite-shield", "avatar", "revenant"]
    },
    rankUpgrades: []
  },
  {
    id: "pa_t6_phylactery_criticality",
    name: "Soul-Forged Crits",
    icon: "spell_shadow_soulleech_3",
    maxRanks: 2,
    position: { x: 2.5, y: 7.5 },
    requires: "pa_t5_undying_anchor",
    spell: {
      name: "Soul-Forged Crits",
      description: "All attacks and spells score critical hits on 17+ and critical hits charge your phylactery for 30 HP.",
      flavorText: "Strikes powered directly by the stored souls.",
      source: "talent", class: "Revenant", treeId: "phylactery_anchor",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "crit", "charge-on-crit", "revenant"]
    },
    rankUpgrades: [
      { description: "Crits on 16+; deals triple damage and charges phylactery for 60 HP." }
    ]
  },
  {
    id: "pa_t6_eternal_soul_ward",
    name: "Absolute Reliquary Shell",
    icon: "spell_holy_powerwordbarrier",
    maxRanks: 2,
    position: { x: 4, y: 7.5 },
    requires: "pa_t5_undying_anchor",
    spell: {
      name: "Absolute Reliquary Shell",
      description: "You and all allies gain a permanent 50-damage soul ward that regenerates 15 points every round.",
      flavorText: "The reliquary shields all who stand in its shadow.",
      source: "talent", class: "Revenant", treeId: "phylactery_anchor",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "regen-shield", "party-defense", "revenant"]
    },
    rankUpgrades: [
      { description: "Ward capacity 100 temp HP, regenerates 30 points per round, and grants +2 Durability Steps to equipped durability." }
    ]
  },

  // ──────────────── TIER 7 / CAPSTONE (15 pts) ────────────────
  {
    id: "pa_t7_grand_resurrection_cataclysm",
    name: "The Eternal Reliquary Cataclysm",
    icon: "spell_holy_resurrection",
    maxRanks: 1,
    position: { x: 0.5, y: 8 },
    requires: "pa_t6_the_immortal_phylactery",
    spell: {
      name: "The Eternal Reliquary Cataclysm",
      description: "ULTIMATE: Spend 8 DT: detonate the soul power of the Frozen Archive for 1 minute: all dead party members resurrect instantly at 100% HP/mana, all party members gain +150 temporary health, and all enemies take 12d10 necrotic damage each round.",
      flavorText: "The Archive opens its vault and pours eternity over the mortal world.",
      source: "talent", class: "Revenant", treeId: "phylactery_anchor",
      spellType: "ACTIVE", category: "healing",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 180, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { deathToll: { baseAmount: 8 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      healing: { dice: "10d10", flat: 0 },
      damageTypes: ["blight"],
      primaryDamage: { dice: "12d10", flat: 0, procChance: 100 },
      buffs: ["reliquary-cataclysm"], visualTheme: "wyrd", tags: ["ultimate", "capstone", "mass-resurrect", "revenant"]
    },
    rankUpgrades: []
  },
  {
    id: "pa_t7_phylactery_doctrine",
    name: "Phylactery Anchor Doctrine",
    icon: "spell_frost_frozencore",
    maxRanks: 5,
    position: { x: 1.5, y: 8 },
    requires: "pa_t6_the_immortal_phylactery",
    spell: {
      name: "Phylactery Anchor Doctrine",
      description: "All defensive shields, phylactery charging, and necrotic/frost damage you deal is increased by 10%.",
      flavorText: "The anchor holds fast against all storms.",
      source: "talent", class: "Revenant", treeId: "phylactery_anchor",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["blight", "rime"],
      visualTheme: "wyrd", tags: ["passive", "capstone", "damage", "revenant"]
    },
    rankUpgrades: [
      { description: "All shields and damage increased by 20%." },
      { description: "All shields and damage increased by 35%." },
      { description: "All shields and damage increased by 50%." },
      { description: "All shields and damage increased by 70%, and Phylactery Soul Shield costs 0 mana." }
    ]
  },
  {
    id: "pa_t7_infinite_phylactery_battery",
    name: "Perpetual Reliquary Engine",
    icon: "spell_shadow_lifedrain",
    maxRanks: 3,
    position: { x: 2.5, y: 8 },
    requires: "pa_t6_phylactery_criticality",
    spell: {
      name: "Perpetual Reliquary Engine",
      description: "Your maximum Death Toll increases by 10. Your phylactery charges for 10 HP at the start of every combat turn.",
      flavorText: "An engine that feeds on ambient soul flux.",
      source: "talent", class: "Revenant", treeId: "phylactery_anchor",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "capstone", "phylactery-engine", "revenant"]
    },
    rankUpgrades: [
      { description: "Max DT +15; phylactery charges 20 HP per turn and movement speed +15ft." },
      { description: "Max DT +20; phylactery charges 30 HP per turn and all abilities cost 2 fewer DT." }
    ]
  },
  {
    id: "pa_t7_soul_rebound",
    name: "Soul Rebound Shield",
    icon: "spell_holy_powerwordbarrier",
    maxRanks: 3,
    position: { x: 3.5, y: 8 },
    requires: "pa_t6_phylactery_criticality",
    spell: {
      name: "Soul Rebound Shield",
      description: "Whenever your phylactery absorbs damage, reflect 50% of the damage back to the attacker as frost/necrotic true damage.",
      flavorText: "Striking the vault shatters the thief's hands.",
      source: "talent", class: "Revenant", treeId: "phylactery_anchor",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["rime", "blight"],
      visualTheme: "wyrd", tags: ["passive", "capstone", "reflect", "revenant"]
    },
    rankUpgrades: [
      { description: "Reflect 75% of absorbed damage back as true damage." },
      { description: "Reflect 100% of absorbed damage, and attackers are stunned for 1 round on hit." }
    ]
  },
  {
    id: "pa_t7_immortal_phylactery_rebirth",
    name: "Phylactery Vessel Rebirth",
    icon: "spell_holy_resurrection",
    maxRanks: 3,
    position: { x: 4.5, y: 8 },
    requires: "pa_t6_eternal_soul_ward",
    spell: {
      name: "Phylactery Vessel Rebirth",
      description: "While phylactery has at least 1 HP, lethal damage reconstructs your body instantly: restores 100% full health, sets DT to max, and grants 50 temp HP (cooldown: 120s).",
      flavorText: "You cannot kill a vessel whose soul is stored elsewhere.",
      source: "talent", class: "Revenant", treeId: "phylactery_anchor",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "capstone", "cheat-death", "revenant"]
    },
    rankUpgrades: [
      { description: "Survive lethal damage, restore 100% HP, 75 temp HP, full DT (cooldown: 90s)." },
      { description: "Survive lethal damage, restore 100% HP, and immediately activate The Eternal Reliquary Cataclysm for free (cooldown: 60s)." }
    ]
  }
];
