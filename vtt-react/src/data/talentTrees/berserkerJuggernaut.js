// ============================================
// BERSERKER — JUGGERNAUT (v2: talents are spells)
// Spec: Calloused Husk, Trauma Calcification, Grit Shields, Reactive Bone Spines
// Resource: Blood-Heat (0-100)
// ============================================

export const BERSERKER_JUGGERNAUT = [
  // ─── TIER 1 (y: 0) ───
  {
    id: "bjn_t1_calcified_hide",
    name: "Shattered Resilience",
    icon: "ability_warrior_defensivestance",
    maxRanks: 3,
    position: { x: 0.5, y: 0 },
    requires: null,
    spell: {
      name: "Shattered Resilience",
      description: "Passive: Your Blood-Heat decays half as fast. Taking physical damage causes your skin to calcify into grey scar tissue, granting +2 Passive DR and a 5 HP temporary Grit shield.",
      flavorText: "Wounds do not open; they solidify into granite.",
      source: "talent", class: "Berserker", treeId: "juggernaut",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "blood", tags: ["passive", "dr", "grit", "defense", "berserker"]
    },
    rankUpgrades: [
      { description: "Passive DR increases to +4 and temporary Grit shield increases to 10 HP." },
      { description: "Passive DR increases to +6; at 50+ Blood-Heat, your armor penalties from High-Heat are completely eliminated." }
    ]
  },
  {
    id: "bjn_t1_skull_bash",
    name: "Caldera Headbutt",
    icon: "ability_warrior_shieldbash",
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    spell: {
      name: "Caldera Headbutt",
      description: "Spend 1 AP: Smash your forehead into target foe for 1d8 smashing damage. Dazes the target (-2 to hit for 1 round) and generates +15 Blood-Heat.",
      flavorText: "Nordhalla ice is hard. His skull is harder.",
      source: "talent", class: "Berserker", treeId: "juggernaut",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 1, targetingMode: "single", rangeType: "melee", range: 5,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 0, cooldownUnit: "round",
      damageTypes: ["smashing"],
      primaryDamage: { dice: "1d8", flat: 0, procChance: 100 },
      visualTheme: "blood", tags: ["melee", "builder", "daze", "berserker"]
    },
    rankUpgrades: [
      { description: "Damage increases to 2d8 smashing, generates +20 Blood-Heat, and knocks target back 5 ft.", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 } },
      { description: "Damage increases to 3d8 smashing; target must make a CON Save or be Stunned for 1 round.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "bjn_t1_unstoppable_weight",
    name: "Tectonic Mass",
    icon: "ability_bullrush",
    maxRanks: 2,
    position: { x: 3.5, y: 0 },
    requires: null,
    spell: {
      name: "Tectonic Mass",
      description: "Passive: You cannot be pushed, pulled, or knocked Prone while at 40+ Blood-Heat. Count as one size larger for grapple contests.",
      flavorText: "Try shoving an avalanche uphill.",
      source: "talent", class: "Berserker", treeId: "juggernaut",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "blood", tags: ["passive", "anchor", "stability", "berserker"]
    },
    rankUpgrades: [
      { description: "Threshold lowers to 20+ Blood-Heat; you deal 1d8 smashing damage to anyone attempting to grapple or displace you.", primaryDamage: { dice: "1d8", flat: 0, procChance: 100 } }
    ]
  },

  // ─── TIER 2 (y: 1) ───
  {
    id: "bjn_t2_calloused_barrier",
    name: "Calloused Barrier",
    icon: "ability_warrior_shieldwall",
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: "bjn_t1_calcified_hide",
    spell: {
      name: "Calloused Barrier",
      description: "Spend 1 AP & 25 Heat: Instantly calcify stored Blood-Heat into a massive bone-scar shield granting 25 temporary HP and +4 Passive DR for 2 rounds.",
      flavorText: "The flesh remembers every hit and weaves an armor out of grief.",
      source: "talent", class: "Berserker", treeId: "juggernaut",
      spellType: "ACTIVE", category: "buff",
      actionPoints: 1, targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 2, cooldownUnit: "round",
      visualTheme: "blood", tags: ["shield", "temp-hp", "spender", "berserker"]
    },
    rankUpgrades: [
      { description: "Temporary HP increases to 40 and Passive DR increases to +6." },
      { description: "Temporary HP increases to 60; when the barrier expires or breaks, it erupts outward dealing 3d6 piercing damage in 10 ft." }
    ]
  },
  {
    id: "bjn_t2_bone_spines",
    name: "Reactive Bone Spines",
    icon: "spell_shadow_antimagic",
    maxRanks: 3,
    position: { x: 2.5, y: 1 },
    requires: "bjn_t1_skull_bash",
    spell: {
      name: "Reactive Bone Spines",
      description: "Passive: Whenever an enemy hits you in melee, sharp calcium spines shatter outward: attacker takes 1d8 stabbing damage.",
      flavorText: "Hitting him is merely loading the spring.",
      source: "talent", class: "Berserker", treeId: "juggernaut",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "single", damageTypes: ["stabbing"],
      primaryDamage: { dice: "1d8", flat: 0, procChance: 100 },
      visualTheme: "blood", tags: ["passive", "thorns", "retaliation", "berserker"]
    },
    rankUpgrades: [
      { description: "Spine damage increases to 2d8 stabbing and applies 1d6 bleed for 2 rounds.", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 } },
      { description: "Spine damage increases to 3d8 stabbing; also triggers against ranged attackers within 15 ft." }
    ]
  },

  // ─── TIER 3 (y: 2) ───
  {
    id: "bjn_t3_ground_crush",
    name: "Tectonic Stomp",
    icon: "ability_warrior_groundslam",
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: "bjn_t2_calloused_barrier",
    spell: {
      name: "Tectonic Stomp",
      description: "Spend 2 AP & 30 Heat: Stomp the earth in a 15 ft radius. Deals 3d8 smashing damage and knocks all enemies Prone (STR save halves damage and negates Prone).",
      flavorText: "When the mountain stumbles, everything on it falls.",
      source: "talent", class: "Berserker", treeId: "juggernaut",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 2, targetingMode: "aoe", rangeType: "self-centered", range: 15,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 2, cooldownUnit: "round",
      damageTypes: ["smashing"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      visualTheme: "blood", tags: ["aoe", "knockdown", "prone", "control", "berserker"]
    },
    rankUpgrades: [
      { description: "Damage increases to 4d8 smashing and radius extends to 20 ft.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 } },
      { description: "Damage increases to 5d8 smashing; leaves Difficult Terrain of shattered basalt in the area for 3 rounds." }
    ]
  },
  {
    id: "bjn_t3_blood_soaked_iron",
    name: "Living Obsidian",
    icon: "spell_fire_felfire",
    maxRanks: 2,
    position: { x: 2.5, y: 2 },
    requires: "bjn_t2_bone_spines",
    spell: {
      name: "Living Obsidian",
      description: "Passive: While above 60 Blood-Heat, convert 30% of all incoming physical and fire damage into temporary HP.",
      flavorText: "Heat fuses the ash and iron into black glass.",
      source: "talent", class: "Berserker", treeId: "juggernaut",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "blood", tags: ["passive", "absorb", "temp-hp", "berserker"]
    },
    rankUpgrades: [
      { description: "Conversion percentage increases to 50%, and threshold lowers to 40+ Blood-Heat." }
    ]
  },

  // ─── TIER 4 (y: 3) ───
  {
    id: "bjn_t4_unshakable_goliath",
    name: "Colossus Tenacity",
    icon: "ability_warrior_laststand",
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: "bjn_t3_ground_crush",
    spell: {
      name: "Colossus Tenacity",
      description: "Passive: Maximum Health increased by +30%. Whenever you drop below 35% health, gain 100 Blood-Heat and a 50 HP stone shield instantly.",
      flavorText: "The harder you hit the boulder, the sharper the edges become.",
      source: "talent", class: "Berserker", treeId: "juggernaut",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "blood", tags: ["passive", "hp-boost", "emergency-shield", "berserker"]
    },
    rankUpgrades: [
      { description: "Max HP bonus increases to +45%, and shield value increases to 75 HP." },
      { description: "Max HP bonus increases to +60%, and while the shield holds you are immune to all crowd control." }
    ]
  },
  {
    id: "bjn_t4_spinal_shatter",
    name: "Spine Burst",
    icon: "spell_nature_earthbindtotem",
    maxRanks: 3,
    position: { x: 2.5, y: 3 },
    requires: "bjn_t3_blood_soaked_iron",
    spell: {
      name: "Spine Burst",
      description: "Spend 2 AP & 40 Heat: Shatter your protective bone carapace outward in a 15 ft radius: deals 4d8 stabbing + 2d8 smashing damage to all enemies and Impales them (movement speed reduced to 0 for 1 round).",
      flavorText: "A thousand calcium shrapnel shards leave no clean meat.",
      source: "talent", class: "Berserker", treeId: "juggernaut",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 2, targetingMode: "aoe", rangeType: "self-centered", range: 15,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 3, cooldownUnit: "round",
      damageTypes: ["stabbing", "smashing"],
      primaryDamage: { dice: "4d8", flat: 0, procChance: 100 },
      secondaryDamage: { dice: "2d8", flat: 0, procChance: 100, damageType: "smashing" },
      visualTheme: "blood", tags: ["aoe", "impale", "root", "burst", "berserker"]
    },
    rankUpgrades: [
      { description: "Damage increases to 5d8 stabbing + 3d8 smashing, and root duration extends to 2 rounds.", primaryDamage: { dice: "5d8", flat: 0, procChance: 100 }, secondaryDamage: { dice: "3d8", flat: 0, procChance: 100, damageType: "smashing" } },
      { description: "Damage increases to 7d8 stabbing + 4d8 smashing; immediately regenerates full bone plating after firing.", primaryDamage: { dice: "7d8", flat: 0, procChance: 100 }, secondaryDamage: { dice: "4d8", flat: 0, procChance: 100, damageType: "smashing" } }
    ]
  },

  // ─── TIER 5 (y: 4) ───
  {
    id: "bjn_t5_juggernaut_charge",
    name: "Caldera Juggernaut Charge",
    icon: "ability_warrior_bullrush",
    maxRanks: 3,
    position: { x: 1, y: 4 },
    requires: "bjn_t4_unshakable_goliath",
    spell: {
      name: "Caldera Juggernaut Charge",
      description: "Spend 2 AP: Charge up to 40 ft in a straight line, smashing through enemies: deals 3d10 smashing damage to every creature in your path and tosses them 10 ft aside.",
      flavorText: "Nothing diverts the charge. Doors, barricades, and bodies all fold.",
      source: "talent", class: "Berserker", treeId: "juggernaut",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 2, targetingMode: "line", rangeType: "ranged", range: 40,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 2, cooldownUnit: "round",
      damageTypes: ["smashing"],
      primaryDamage: { dice: "3d10", flat: 0, procChance: 100 },
      visualTheme: "blood", tags: ["mobility", "charge", "knockback", "berserker"]
    },
    rankUpgrades: [
      { description: "Damage increases to 4d10 smashing; grants 20 temporary HP for each enemy trampled.", primaryDamage: { dice: "4d10", flat: 0, procChance: 100 } },
      { description: "Damage increases to 6d10 smashing; enemies trampled are Stunned for 1 round.", primaryDamage: { dice: "6d10", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "bjn_t5_unyielding_mass",
    name: "Heart of Caldera Basalt",
    icon: "spell_fire_immolation",
    maxRanks: 2,
    position: { x: 2.5, y: 4 },
    requires: "bjn_t4_spinal_shatter",
    spell: {
      name: "Heart of Caldera Basalt",
      description: "Passive: You take 25% reduced damage from critical hits and your Active Soak die can never roll lower than half its maximum value.",
      flavorText: "Soft organs have been replaced with hardened magma.",
      source: "talent", class: "Berserker", treeId: "juggernaut",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "blood", tags: ["passive", "crit-reduction", "soak-floor", "berserker"]
    },
    rankUpgrades: [
      { description: "You are completely immune to bonus damage from critical hits, and your Active Soak die always rolls its maximum possible value." }
    ]
  },

  // ─── TIER 6 (y: 5) ───
  {
    id: "bjn_t6_monolithic_slam",
    name: "Mountain Breaker",
    icon: "ability_warrior_shockwave",
    maxRanks: 3,
    position: { x: 1, y: 5 },
    requires: "bjn_t5_juggernaut_charge",
    spell: {
      name: "Mountain Breaker",
      description: "Spend 3 AP & 60 Heat: Strike with apocalyptic force in a 20 ft cone: 7d10 smashing damage, permanently destroying enemy physical armor (-10 Passive DR) and creating an impassable stone crater.",
      flavorText: "He hit the earth so hard the horizon flinched.",
      source: "talent", class: "Berserker", treeId: "juggernaut",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 3, targetingMode: "cone", rangeType: "melee", range: 20,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 3, cooldownUnit: "round",
      damageTypes: ["smashing"],
      primaryDamage: { dice: "7d10", flat: 0, procChance: 100 },
      visualTheme: "blood", tags: ["cone", "armor-destruction", "burst", "berserker"]
    },
    rankUpgrades: [
      { description: "Damage increases to 9d10 smashing, and cone extends to 25 ft.", primaryDamage: { dice: "9d10", flat: 0, procChance: 100 } },
      { description: "Damage increases to 12d10 smashing; enemies struck take double damage from all sources for 1 round.", primaryDamage: { dice: "12d10", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "bjn_t6_granite_vow",
    name: "Vow of the Monolith",
    icon: "ability_racial_avatar",
    maxRanks: 2,
    position: { x: 2.5, y: 5 },
    requires: "bjn_t5_unyielding_mass",
    spell: {
      name: "Vow of the Monolith",
      description: "Passive: All temporary Grit shields granted by your abilities are increased by 50% in magnitude and do not decay over time.",
      flavorText: "Once the stone forms, it stays until shattered.",
      source: "talent", class: "Berserker", treeId: "juggernaut",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "blood", tags: ["passive", "grit-boost", "permanent-shields", "berserker"]
    },
    rankUpgrades: [
      { description: "Shield magnitudes increased by 100%, and while any Grit shield holds, you deal +3d6 smashing bonus damage on all melee attacks.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } }
    ]
  },

  // ─── TIER 7 (Capstone Row, y: 6) ───
  {
    id: "bjn_t7_avatar_of_caldera_iron",
    name: "Avatar of Caldera Iron",
    icon: "spell_nature_shamanrage",
    maxRanks: 1,
    position: { x: 1, y: 6 },
    requires: "bjn_t6_monolithic_slam",
    spell: {
      name: "Avatar of Caldera Iron",
      description: "CAPSTONE — Spend 3 AP & 100 Heat: Transform completely into living basalt and volcanic iron for 3 rounds. Gain +10 Passive DR, 100 temporary HP, complete immunity to all displacement and mental conditions, and any enemy that strikes you takes 4d8 piercing damage from bone spines and is knocked Prone.",
      flavorText: "He is no longer a warrior. He is a piece of Nordhalla that decided to walk.",
      source: "talent", class: "Berserker", treeId: "juggernaut",
      spellType: "ACTIVE", category: "buff",
      actionPoints: 3, targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "once_per_combat", cooldownValue: 1, cooldownUnit: "combat",
      durationRounds: 3,
      visualTheme: "blood", tags: ["capstone", "ultimate", "transformation", "titan", "berserker"]
    },
    rankUpgrades: []
  },
  {
    id: "bjn_t7_indomitable_fortress",
    name: "Living Fortress of the Waste",
    icon: "ability_warrior_defensivestance",
    maxRanks: 2,
    position: { x: 2.5, y: 6 },
    requires: "bjn_t6_granite_vow",
    spell: {
      name: "Living Fortress of the Waste",
      description: "Passive: Whenever you are attacked, redirect 25% of any damage taken by allies within 20 ft into your own Grit shields, and your size category increases permanently by 1.",
      flavorText: "Stand behind the Juggernaut. Nordhalla itself cannot pierce his bulk.",
      source: "talent", class: "Berserker", treeId: "juggernaut",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", auraRadius: 20,
      visualTheme: "blood", tags: ["passive", "capstone-row", "party-cover", "size-increase", "berserker"]
    },
    rankUpgrades: [
      { description: "Redirect increases to 50% of damage taken by allies, and you grant +4 Passive DR to all companions within 20 ft." }
    ]
  }
];
