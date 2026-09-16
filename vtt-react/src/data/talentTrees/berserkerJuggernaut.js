// ============================================
// BERSERKER — JUGGERNAUT (v2: talents are spells)
// Spec: Calloused Husk, Trauma Calcification, Grit Shields, Reactive Bone Spines
// Resource: Rage (0-100)
// ============================================

export const BERSERKER_JUGGERNAUT = [
  // ─── TIER 1 (y: 0) ───
  {
    id: "bjn_t1_calcified_hide",
    name: "Shattered Resilience",
    icon: "General/Defend",
    maxRanks: 3,
    position: { x: 4.5, y: 0 },
    requires: null,
    spell: {
      name: "Shattered Resilience",
      description: "Passive: Your Rage decays half as fast. Taking physical damage causes your skin to calcify into grey scar tissue, granting +2 Passive DR and a 5 HP temporary Grit shield.",
      flavorText: "Wounds do not open; they solidify into granite.",
      source: "talent", class: "Berserker", treeId: "juggernaut",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "blood", tags: ["passive", "dr", "grit", "defense", "berserker"]
    },
    rankUpgrades: [
      { description: "Passive DR increases to +4 and temporary Grit shield increases to 10 HP." },
      { description: "Passive DR increases to +6; at 50+ Rage, your armor penalties from high Rage are completely eliminated." }
    ]
  },
  {
    id: "bjn_t1_skull_bash",
    name: "Caldera Headbutt",
    icon: "General/Concussion",
    maxRanks: 3,
    position: { x: 3, y: 0 },
    requires: null,
    spell: {
      name: "Caldera Headbutt",
      description: "Spend 1 AP: Smash your forehead into target foe for 1d8 smashing damage. Dazes the target (-2 to hit for 1 round) and generates +15 Rage.",
      flavorText: "Nordhalla ice is hard. His skull is harder.",
      source: "talent", class: "Berserker", treeId: "juggernaut",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 1, targetingMode: "single", rangeType: "melee", range: 5,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 1, cooldownUnit: "rounds",
      resourceCosts: { rage: { baseAmount: -15 } },
      damageTypes: ["smashing"],
      primaryDamage: { dice: "1d8", flat: 0, procChance: 100 },
      visualTheme: "blood", tags: ["melee", "builder", "daze", "berserker"]
    },
    rankUpgrades: [
      { description: "Damage increases to 2d8 smashing, generates +20 Rage, and knocks target back 5 ft.", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 }, resourceCosts: { rage: { baseAmount: -20 } } },
      { description: "Damage increases to 3d8 smashing; target must make a CON Save or be Stunned for 1 round.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "bjn_t1_unstoppable_weight",
    name: "Tectonic Mass",
    icon: "Nature/Bull",
    maxRanks: 2,
    position: { x: 0.5, y: 0 },
    requires: null,
    spell: {
      name: "Tectonic Mass",
      description: "Passive: You cannot be pushed, pulled, or knocked Prone while at 40+ Rage. Count as one size larger for grapple contests.",
      flavorText: "Try shoving an avalanche uphill.",
      source: "talent", class: "Berserker", treeId: "juggernaut",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "blood", tags: ["passive", "anchor", "stability", "berserker"]
    },
    rankUpgrades: [
      { description: "Threshold lowers to 20+ Rage; you deal 1d8 smashing damage to anyone attempting to grapple or displace you.", primaryDamage: { dice: "1d8", flat: 0, procChance: 100 }, damageTypes: ["smashing"] }
    ]
  },

  // ─── TIER 2 (y: 1) ───
  {
    id: "bjn_t2_calloused_barrier",
    name: "Calloused Barrier",
    icon: "Utility/Broad Shouldered Warrior",
    maxRanks: 3,
    position: { x: 3.5, y: 1 },
    requires: "bjn_t1_calcified_hide",
    spell: {
      name: "Calloused Barrier",
      description: "Spend 1 AP & 25 Rage: Instantly calcify stored Rage into a massive bone-scar shield granting 25 temporary HP and +4 Passive DR for 2 rounds.",
      flavorText: "The flesh remembers every hit and weaves an armor out of grief.",
      source: "talent", class: "Berserker", treeId: "juggernaut",
      spellType: "ACTIVE", category: "buff",
      actionPoints: 1, targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 2, cooldownUnit: "rounds",
      resourceCosts: { rage: { baseAmount: 25 } },
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
    icon: "General/Break Bone",
    maxRanks: 3,
    position: { x: 1, y: 1 },
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
      { description: "Spine damage increases to 3d8 stabbing; also triggers against ranged attackers within 15 ft.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } }
    ]
  },

  // ─── TIER 3 (y: 2) ───
  {
    id: "bjn_t3_ground_crush",
    name: "Tectonic Stomp",
    icon: "Bludgeoning/Stomp",
    maxRanks: 3,
    position: { x: 3.5, y: 2 },
    requires: "bjn_t2_calloused_barrier",
    spell: {
      name: "Tectonic Stomp",
      description: "Spend 2 AP & 30 Rage: Stomp the earth in a 15 ft radius. Deals 3d8 smashing damage and knocks all enemies Prone (STR save halves damage and negates Prone).",
      flavorText: "When the mountain stumbles, everything on it falls.",
      source: "talent", class: "Berserker", treeId: "juggernaut",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 2, targetingMode: "aoe", rangeType: "self-centered", range: 15,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 2, cooldownUnit: "rounds",
      resourceCosts: { rage: { baseAmount: 30 } },
      damageTypes: ["smashing"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      visualTheme: "blood", tags: ["aoe", "knockdown", "prone", "control", "berserker"]
    },
    rankUpgrades: [
      { description: "Damage increases to 4d8 smashing and radius extends to 20 ft.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 } },
      { description: "Damage increases to 5d8 smashing; leaves Difficult Terrain of shattered basalt in the area for 3 rounds.", primaryDamage: { dice: "5d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "bjn_t3_blood_soaked_iron",
    name: "Living Obsidian",
    icon: "Fire/Flowing Lava",
    maxRanks: 3,
    position: { x: 1.5, y: 2 },
    requires: "bjn_t2_bone_spines",
    spell: {
      name: "Living Obsidian",
      description: "Passive: While above 60 Rage, convert 30% of all incoming physical and fire damage into temporary HP.",
      flavorText: "Forge-heat fuses the ash and iron into black glass.",
      source: "talent", class: "Berserker", treeId: "juggernaut",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "blood", tags: ["passive", "absorb", "temp-hp", "berserker"]
    },
    rankUpgrades: [
      { description: "Conversion percentage increases to 50%, and threshold lowers to 40+ Rage." },
      { description: "Conversion percentage increases to 75%, threshold lowers to 20+ Rage, and each converted hit generates +5 Rage." }
    ]
  },

  // ─── TIER 4 (y: 3) ───
  {
    id: "bjn_t4_unshakable_goliath",
    name: "Colossus Tenacity",
    icon: "General/Bolster",
    maxRanks: 2,
    position: { x: 4.5, y: 3 },
    requires: "bjn_t3_ground_crush",
    spell: {
      name: "Colossus Tenacity",
      description: "Passive: Maximum Health increased by +30%. Whenever you drop below 35% health, gain 100 Rage and a 50 HP stone shield instantly.",
      flavorText: "The harder you hit the boulder, the sharper the edges become.",
      source: "talent", class: "Berserker", treeId: "juggernaut",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "blood", tags: ["passive", "hp-boost", "emergency-shield", "berserker"]
    },
    rankUpgrades: [
      { description: "Max HP bonus increases to +50%, shield value increases to 90 HP, and while the shield holds you are immune to all crowd control." }
    ]
  },
  {
    id: "bjn_t4_spinal_shatter",
    name: "Spine Burst",
    icon: "Force/Explosion Burst",
    maxRanks: 3,
    position: { x: 2.5, y: 3 },
    requires: "bjn_t3_blood_soaked_iron",
    spell: {
      name: "Spine Burst",
      description: "Spend 2 AP & 40 Rage: Shatter your protective bone carapace outward in a 15 ft radius: deals 4d8 stabbing + 2d8 smashing damage to all enemies and Impales them (movement speed reduced to 0 for 1 round).",
      flavorText: "A thousand calcium shrapnel shards leave no clean meat.",
      source: "talent", class: "Berserker", treeId: "juggernaut",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 2, targetingMode: "aoe", rangeType: "self-centered", range: 15,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 3, cooldownUnit: "rounds",
      resourceCosts: { rage: { baseAmount: 40 } },
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
    icon: "Utility/Demonic Warrior",
    maxRanks: 3,
    position: { x: 3.5, y: 4 },
    requires: "bjn_t4_unshakable_goliath",
    spell: {
      name: "Caldera Juggernaut Charge",
      description: "Spend 2 AP: Charge up to 40 ft in a straight line, smashing through enemies: deals 3d10 smashing damage to every creature in your path and tosses them 10 ft aside.",
      flavorText: "Nothing diverts the charge. Doors, barricades, and bodies all fold.",
      source: "talent", class: "Berserker", treeId: "juggernaut",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 2, targetingMode: "line", rangeType: "ranged", range: 40,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 2, cooldownUnit: "rounds",
      resourceCosts: { rage: { baseAmount: 0 } },
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
    icon: "Fire/Burning Forge",
    maxRanks: 2,
    position: { x: 0.5, y: 4 },
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
    icon: "Bludgeoning/Hammer Crush",
    maxRanks: 3,
    position: { x: 4.5, y: 5 },
    requires: "bjn_t5_juggernaut_charge",
    spell: {
      name: "Mountain Breaker",
      description: "Spend 3 AP & 60 Rage: Strike with apocalyptic force in a 20 ft cone: 7d10 smashing damage, permanently destroying enemy physical armor (-10 Passive DR) and creating an impassable stone crater.",
      flavorText: "He hit the earth so hard the horizon flinched.",
      source: "talent", class: "Berserker", treeId: "juggernaut",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 3, targetingMode: "cone", rangeType: "melee", range: 20,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 3, cooldownUnit: "rounds",
      resourceCosts: { rage: { baseAmount: 60 } },
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
    icon: "Utility/Shield With Plus",
    maxRanks: 2,
    position: { x: 2, y: 5 },
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
      { description: "Shield magnitudes increased by 100%, and while any Grit shield holds, you deal +3d6 smashing bonus damage on all melee attacks.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 }, damageTypes: ["smashing"] }
    ]
  },

  // ─── TIER 7 (Capstone Row, y: 6) ───
  {
    id: "bjn_t7_avatar_of_caldera_iron",
    name: "Avatar of Caldera Iron",
    icon: "Fire/Burning Transformation",
    maxRanks: 1,
    position: { x: 3.5, y: 6 },
    requires: "bjn_t6_monolithic_slam",
    spell: {
      name: "Avatar of Caldera Iron",
      description: "CAPSTONE — Spend 3 AP & 100 Rage: Transform completely into living basalt and volcanic iron for 3 rounds. Gain +10 Passive DR, 100 temporary HP, complete immunity to all displacement and mental conditions, and any enemy that strikes you takes 4d8 piercing damage from bone spines and is knocked Prone.",
      flavorText: "He is no longer a warrior. He is a piece of Nordhalla that decided to walk.",
      source: "talent", class: "Berserker", treeId: "juggernaut",
      spellType: "ACTIVE", category: "buff",
      actionPoints: 3, targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "once_per_combat", cooldownValue: 1, cooldownUnit: "combat",
      resourceCosts: { rage: { baseAmount: 100 } },
      durationRounds: 3,
      visualTheme: "blood", tags: ["capstone", "ultimate", "transformation", "titan", "berserker"]
    },
    rankUpgrades: []
  },
  {
    id: "bjn_t7_indomitable_fortress",
    name: "Living Fortress of the Waste",
    icon: "Utility/Bound Warrior",
    maxRanks: 3,
    position: { x: 1.5, y: 6 },
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
      { description: "Redirect increases to 50% of damage taken by allies, and you grant +4 Passive DR to all companions within 20 ft." },
      { description: "Redirect increases to 75%; companions within 20 ft gain +8 Passive DR, and damage you redirect is reduced by 50% before it reaches your Grit shields." }
    ]
  },
  {
    id: "bjn_t7_calcified_apotheosis",
    name: "Calcified Apotheosis",
    icon: "Utility/Scaled Armor",
    maxRanks: 5,
    position: { x: 4.5, y: 6 },
    requires: "bjn_t6_monolithic_slam",
    spell: {
      name: "Calcified Apotheosis",
      description: "Passive: Trauma Calcification perfected. Every 20 damage you take from a single hit calcifies a scar layer, granting +2 Passive DR and 10 Grit shield (stacks up to +10 DR and 50 Grit). Layers persist for 3 rounds.",
      flavorText: "Every wound writes another plate of armor onto the same hide.",
      source: "talent", class: "Berserker", treeId: "juggernaut",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "blood", tags: ["passive", "capstone", "trauma-calcification", "scar-armor", "grit", "berserker"]
    },
    rankUpgrades: [
      { description: "Each scar layer now grants +3 Passive DR and 15 Grit shield, stacking up to +12 Passive DR and 75 Grit." },
      { description: "Each scar layer now grants +3 Passive DR and 20 Grit shield, stacking up to +15 Passive DR and 100 Grit; scar layers persist until shattered." },
      { description: "Scar layers trigger on hits of 15+ damage and grant +4 Passive DR and 25 Grit shield each, stacking up to +16 Passive DR and 125 Grit." },
      { description: "Scar layers cap at +20 Passive DR and 150 Grit; whenever a layer is added you gain 50 temporary HP, and at maximum stacks you are immune to critical hits." }
    ]
  },
  {
    id: "bjn_t7_reactive_spine_mantle",
    name: "Reactive Spine Mantle",
    icon: "Nature/Scorpion Stinger",
    maxRanks: 3,
    position: { x: 2.5, y: 6 },
    requires: "bjn_t6_monolithic_slam",
    spell: {
      name: "Reactive Spine Mantle",
      description: "Passive: Your reactive bone spines fuse into a permanent mantle. Whenever a creature within 10 ft hits you in melee, it takes 2d8 stabbing damage and starts Bleeding (1d6 per round for 2 rounds).",
      flavorText: "Strike the mountain and the mountain's teeth answer first.",
      source: "talent", class: "Berserker", treeId: "juggernaut",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "single", damageTypes: ["stabbing"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      visualTheme: "blood", tags: ["passive", "capstone", "retaliation", "bone-spines", "bleed", "berserker"]
    },
    rankUpgrades: [
      { description: "Retaliation reaches 20 ft and spine damage increases to 4d8 stabbing; each trigger also grants you 10 Grit shield.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 } },
      { description: "Spine damage increases to 6d8 stabbing; each trigger grants 15 Grit shield and erupts for 3d8 stabbing damage to all enemies within 10 ft of the attacker.", primaryDamage: { dice: "6d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "bjn_t7_geothermal_ironhide",
    name: "Geothermal Ironhide",
    icon: "Fire/Flame Shield",
    maxRanks: 3,
    position: { x: 0, y: 6 },
    requires: "bjn_t6_granite_vow",
    spell: {
      name: "Geothermal Ironhide",
      description: "Passive: Caldera heat soaks into iron-hard skin. You take 50% less fire and ember damage, and whenever you take such damage you convert the prevented damage into a Grit shield (up to 15 Grit per hit).",
      flavorText: "The forge is not a place he visits. It is a place he carries.",
      source: "talent", class: "Berserker", treeId: "juggernaut",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["ember"],
      visualTheme: "blood", tags: ["passive", "capstone", "thermal-soak", "grit", "fire", "berserker"]
    },
    rankUpgrades: [
      { description: "Fire and ember damage reduction increases to 75%, and the Grit shield gained from a prevented hit increases to 25." },
      { description: "You are immune to fire and ember damage and convert all prevented damage into Grit shields (up to 40 per hit); while any Grit shield holds, your melee attacks deal +2d8 ember bonus damage." }
    ]
  }
];
