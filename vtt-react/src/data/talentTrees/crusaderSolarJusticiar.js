// ============================================
// CRUSADER — SOLAR JUSTICIAR (v2: talents are spells)
// Spec: Two-Handed Greatsword Smites, Armor Sundering, Radiant Burst
// Resource: Fervor (0-100)
// ============================================

export const CRUSADER_SOLAR_JUSTICIAR = [
  // ─── TIER 1 (y: 0) ───
  {
    id: "csj_t1_zealots_edge",
    name: "Zealot's Edge",
    icon: "spell_holy_righteousfury",
    maxRanks: 3,
    position: { x: 0.5, y: 0 },
    requires: null,
    spell: {
      name: "Zealot's Edge",
      description: "Passive: Your greatsword strikes burn with Aex's original furnace. Melee attacks deal +1d4 sacred damage and generate +3 bonus Fervor.",
      flavorText: "The blade is heavy so that the prayer cannot wander.",
      source: "talent", class: "Crusader", treeId: "solar_justiciar",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["sacred"],
      primaryDamage: { dice: "1d4", flat: 0, procChance: 100 },
      visualTheme: "holy", tags: ["passive", "builder", "sacred", "crusader"]
    },
    rankUpgrades: [
      { description: "Melee attacks deal +1d6 sacred damage and generate +6 bonus Fervor.", primaryDamage: { dice: "1d6", flat: 0, procChance: 100 } },
      { description: "Melee attacks deal +1d8 sacred damage, generate +10 bonus Fervor, and critical hits grant +10 additional Fervor.", primaryDamage: { dice: "1d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "csj_t1_righteous_cleave",
    name: "Righteous Cleave",
    icon: "ability_warrior_cleave",
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    spell: {
      name: "Righteous Cleave",
      description: "Spend 2 AP: Sweep your blade in a 10 ft arc dealing 1d10 smashing + 1d6 sacred damage. Deals +15% damage against Aberrations, Undead, and Wyrd-tainted creatures.",
      flavorText: "Cut wide. Wyrd corruption rarely travels alone.",
      source: "talent", class: "Crusader", treeId: "solar_justiciar",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 2, targetingMode: "cone", rangeType: "melee", range: 10,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 0, cooldownUnit: "round",
      damageTypes: ["smashing", "sacred"],
      primaryDamage: { dice: "1d10", flat: 0, procChance: 100 },
      secondaryDamage: { dice: "1d6", flat: 0, procChance: 100, damageType: "sacred" },
      visualTheme: "holy", tags: ["melee", "aoe", "cone", "builder", "crusader"]
    },
    rankUpgrades: [
      { description: "Base damage increases to 2d8 smashing + 1d8 sacred, and bonus vs tainted foes increases to +25%.", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 }, secondaryDamage: { dice: "1d8", flat: 0, procChance: 100, damageType: "sacred" } },
      { description: "Base damage increases to 2d10 smashing + 2d6 sacred; hits refund 1 AP if they strike 2 or more tainted foes.", primaryDamage: { dice: "2d10", flat: 0, procChance: 100 }, secondaryDamage: { dice: "2d6", flat: 0, procChance: 100, damageType: "sacred" } }
    ]
  },
  {
    id: "csj_t1_unflinching_stride",
    name: "Unflinching Stride",
    icon: "ability_warrior_charge",
    maxRanks: 2,
    position: { x: 3.5, y: 0 },
    requires: null,
    spell: {
      name: "Unflinching Stride",
      description: "Passive: Gain +5 ft base movement speed. While at 50+ Fervor, movement-slowing effects against you are reduced by 50%.",
      flavorText: "He marches as though the mountain were already leveled.",
      source: "talent", class: "Crusader", treeId: "solar_justiciar",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "holy", tags: ["passive", "mobility", "fervor-scaling", "crusader"]
    },
    rankUpgrades: [
      { description: "Movement speed bonus increases to +10 ft; at 50+ Fervor you are completely immune to Slow and Immobilize effects." }
    ]
  },

  // ─── TIER 2 (y: 1) ───
  {
    id: "csj_t2_sundering_wrath",
    name: "Sundering Wrath",
    icon: "spell_holy_sealingblessing",
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: "csj_t1_zealots_edge",
    spell: {
      name: "Sundering Wrath",
      description: "Passive: Your heavy greatsword smites fracture enemy armor. When you spend 20+ Fervor on a strike, the target's Passive DR is reduced by 2 for 2 rounds.",
      flavorText: "Steel breaks before faith does.",
      source: "talent", class: "Crusader", treeId: "solar_justiciar",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "single",
      visualTheme: "holy", tags: ["passive", "armor-shred", "fervor-payoff", "crusader"]
    },
    rankUpgrades: [
      { description: "Armor reduction increases to -4 Passive DR and stacks up to 2 times." },
      { description: "Armor reduction increases to -6 Passive DR; additionally reduces target's Physical resistance by 1 tier." }
    ]
  },
  {
    id: "csj_t2_searing_cross",
    name: "Searing Cross",
    icon: "spell_holy_auramastery",
    maxRanks: 3,
    position: { x: 2.5, y: 1 },
    requires: "csj_t1_righteous_cleave",
    spell: {
      name: "Searing Cross",
      description: "Spend 2 AP & 25 Fervor: Strike twice in a cross pattern. Deal 2d8 slashing + 2d8 sacred damage. Leaves a burning starlight sigil on the target.",
      flavorText: "Two strokes. One for the vow, one for the execution.",
      source: "talent", class: "Crusader", treeId: "solar_justiciar",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 2, targetingMode: "single", rangeType: "melee", range: 5,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 1, cooldownUnit: "round",
      damageTypes: ["slicing", "sacred"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      secondaryDamage: { dice: "2d8", flat: 0, procChance: 100, damageType: "sacred" },
      visualTheme: "holy", tags: ["melee", "burst", "spender", "crusader"]
    },
    rankUpgrades: [
      { description: "Damage increases to 3d8 slashing + 2d8 sacred, and the burning sigil deals 1d6 sacred at start of target's turn for 2 rounds.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } },
      { description: "Damage increases to 3d10 slashing + 3d8 sacred; if the target is an Aberration or Undead, it explodes on death for 2d8 sacred in 10 ft.", primaryDamage: { dice: "3d10", flat: 0, procChance: 100 }, secondaryDamage: { dice: "3d8", flat: 0, procChance: 100, damageType: "sacred" } }
    ]
  },

  // ─── TIER 3 (y: 2) ───
  {
    id: "csj_t3_harmonic_overdrive",
    name: "Harmonic Overdrive",
    icon: "spell_holy_divineprovidence",
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: "csj_t2_sundering_wrath",
    spell: {
      name: "Harmonic Overdrive",
      description: "Passive: While at 75+ Fervor, your greatsword hums with Solvan resonance: your melee weapon range increases by 5 ft and melee strikes deal +2d6 sacred damage.",
      flavorText: "The blade extends where the light reaches.",
      source: "talent", class: "Crusader", treeId: "solar_justiciar",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["sacred"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      visualTheme: "holy", tags: ["passive", "reach", "fervor-scaling", "crusader"]
    },
    rankUpgrades: [
      { description: "Threshold lowers to 50+ Fervor; bonus sacred damage increases to +3d6.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } },
      { description: "Threshold lowers to 40+ Fervor; while active, your strikes ignore 50% of the target's Active Soak rolls." }
    ]
  },
  {
    id: "csj_t3_consecrated_impact",
    name: "Consecrated Impact",
    icon: "spell_holy_restoration",
    maxRanks: 2,
    position: { x: 2.5, y: 2 },
    requires: "csj_t2_searing_cross",
    spell: {
      name: "Consecrated Impact",
      description: "Passive: When you land a critical hit or kill an enemy with a Fervor-spending attack, the ground beneath them becomes Consecrated Ground for 3 rounds (enemies inside take 1d8 sacred damage/round).",
      flavorText: "Where the righteous strike, the earth remembers.",
      source: "talent", class: "Crusader", treeId: "solar_justiciar",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "ground", damageTypes: ["sacred"],
      primaryDamage: { dice: "1d8", flat: 0, procChance: 100 },
      visualTheme: "holy", tags: ["passive", "consecration", "ground", "crusader"]
    },
    rankUpgrades: [
      { description: "Consecrated Ground radius increases to 15 ft and deals 2d8 sacred damage per round; allies inside gain +2 to Active Soak die rolls.", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 } }
    ]
  },

  // ─── TIER 4 (y: 3) ───
  {
    id: "csj_t4_judgment_blade",
    name: "Judgment Blade",
    icon: "ability_paladin_judgmentblue",
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: "csj_t3_harmonic_overdrive",
    spell: {
      name: "Judgment Blade",
      description: "Spend 2 AP & 40 Fervor: Leap up to 20 ft and slam your greatsword down onto target foe. Deals 4d8 smashing + 3d8 sacred damage, knocking the target Prone.",
      flavorText: "Gravity is merely Sol's judgment given weight.",
      source: "talent", class: "Crusader", treeId: "solar_justiciar",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 2, targetingMode: "single", rangeType: "ranged", range: 20,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 2, cooldownUnit: "round",
      damageTypes: ["smashing", "sacred"],
      primaryDamage: { dice: "4d8", flat: 0, procChance: 100 },
      secondaryDamage: { dice: "3d8", flat: 0, procChance: 100, damageType: "sacred" },
      visualTheme: "holy", tags: ["gap-closer", "burst", "prone", "spender", "crusader"]
    },
    rankUpgrades: [
      { description: "Damage increases to 5d8 smashing + 4d8 sacred, and leap range extends to 30 ft.", primaryDamage: { dice: "5d8", flat: 0, procChance: 100 }, secondaryDamage: { dice: "4d8", flat: 0, procChance: 100, damageType: "sacred" } },
      { description: "Damage increases to 6d10 smashing + 5d8 sacred; shockwave deals 2d8 sacred damage to all enemies within 10 ft of the landing point.", primaryDamage: { dice: "6d10", flat: 0, procChance: 100 }, secondaryDamage: { dice: "5d8", flat: 0, procChance: 100, damageType: "sacred" } }
    ]
  },
  {
    id: "csj_t4_fervent_execution",
    name: "Fervent Execution",
    icon: "ability_warrior_decisivestrike",
    maxRanks: 3,
    position: { x: 2.5, y: 3 },
    requires: "csj_t3_consecrated_impact",
    spell: {
      name: "Fervent Execution",
      description: "Passive: Against enemies below 35% health, your Fervor spenders deal +30% critical damage and refund 50% of the Fervor spent on a kill.",
      flavorText: "Finish it. Do not let corruption bleed into tomorrow.",
      source: "talent", class: "Crusader", treeId: "solar_justiciar",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "holy", tags: ["passive", "execute", "fervor-refund", "crusader"]
    },
    rankUpgrades: [
      { description: "Critical damage bonus increases to +50%, and threshold extends to enemies below 45% health." },
      { description: "Kills with Fervor spenders refund 100% of Fervor spent and grant 1 free Action Point this turn." }
    ]
  },

  // ─── TIER 5 (y: 4) ───
  {
    id: "csj_t5_solar_combustion",
    name: "Solar Combustion",
    icon: "spell_fire_sealoffire",
    maxRanks: 3,
    position: { x: 1, y: 4 },
    requires: "csj_t4_judgment_blade",
    spell: {
      name: "Solar Combustion",
      description: "Passive: Whenever you consume 50+ Fervor in a single turn, your blade bursts into solar flame: your next 2 attacks deal +2d8 ember/sacred damage and ignore physical DR.",
      flavorText: "The blade drinks starlight until it breathes fire.",
      source: "talent", class: "Crusader", treeId: "solar_justiciar",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["sacred", "ember"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      visualTheme: "holy", tags: ["passive", "armor-ignore", "fire-burst", "crusader"]
    },
    rankUpgrades: [
      { description: "Bonus damage increases to +3d8 ember/sacred and lasts for 3 attacks.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } },
      { description: "Bonus damage increases to +4d8 ember/sacred; attacks while ignited release 10 ft cone waves of holy flame." }
    ]
  },
  {
    id: "csj_t5_unyielding_fervor",
    name: "Unyielding Fervor",
    icon: "spell_holy_innerfire",
    maxRanks: 2,
    position: { x: 2.5, y: 4 },
    requires: "csj_t4_fervent_execution",
    spell: {
      name: "Unyielding Fervor",
      description: "Passive: Fervor decays 50% slower outside of combat, and taking damage generates 1 Fervor per 5 damage suffered.",
      flavorText: "Pain is merely fuel awaiting direction.",
      source: "talent", class: "Crusader", treeId: "solar_justiciar",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "holy", tags: ["passive", "resource-gen", "crusader"]
    },
    rankUpgrades: [
      { description: "Fervor never naturally decays during combat encounters, and taking damage generates 1 Fervor per 3 damage suffered." }
    ]
  },

  // ─── TIER 6 (y: 5) ───
  {
    id: "csj_t6_titanic_cleave",
    name: "Titanic Cleave",
    icon: "ability_warrior_shockwave",
    maxRanks: 3,
    position: { x: 1, y: 5 },
    requires: "csj_t5_solar_combustion",
    spell: {
      name: "Titanic Cleave",
      description: "Spend 3 AP & 60 Fervor: Whirl your greatsword in a 360-degree 15 ft radius. Deals 6d8 smashing + 4d8 sacred damage to all enemies, throwing them 10 ft back.",
      flavorText: "One revolution to clear the temple floor.",
      source: "talent", class: "Crusader", treeId: "solar_justiciar",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 3, targetingMode: "aoe", rangeType: "self-centered", range: 15,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 3, cooldownUnit: "round",
      damageTypes: ["smashing", "sacred"],
      primaryDamage: { dice: "6d8", flat: 0, procChance: 100 },
      secondaryDamage: { dice: "4d8", flat: 0, procChance: 100, damageType: "sacred" },
      visualTheme: "holy", tags: ["aoe", "whirlwind", "knockback", "crusader"]
    },
    rankUpgrades: [
      { description: "Damage increases to 8d8 smashing + 5d8 sacred, and radius expands to 20 ft.", primaryDamage: { dice: "8d8", flat: 0, procChance: 100 }, secondaryDamage: { dice: "5d8", flat: 0, procChance: 100, damageType: "sacred" } },
      { description: "Damage increases to 10d8 smashing + 6d8 sacred; shattered enemies suffer Sundered Armor (-8 DR) for 3 rounds.", primaryDamage: { dice: "10d8", flat: 0, procChance: 100 }, secondaryDamage: { dice: "6d8", flat: 0, procChance: 100, damageType: "sacred" } }
    ]
  },
  {
    id: "csj_t6_dawn_zealot_vow",
    name: "Vow of the Sunblade",
    icon: "spell_holy_holybolt",
    maxRanks: 2,
    position: { x: 2.5, y: 5 },
    requires: "csj_t5_unyielding_fervor",
    spell: {
      name: "Vow of the Sunblade",
      description: "Passive: Maximum Fervor increased to 120. When entering combat, start with 30 free Fervor.",
      flavorText: "He does not warm to the fight. He arrives already boiling.",
      source: "talent", class: "Crusader", treeId: "solar_justiciar",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "holy", tags: ["passive", "cap-increase", "start-fervor", "crusader"]
    },
    rankUpgrades: [
      { description: "Maximum Fervor increased to 150, and combat opener grants 50 free Fervor." }
    ]
  },

  // ─── TIER 7 (Capstone Row, y: 6) ───
  {
    id: "csj_t7_titanfall_executioner",
    name: "Titanfall Executioner",
    icon: "spell_holy_avenginewrath",
    maxRanks: 1,
    position: { x: 1, y: 6 },
    requires: "csj_t6_titanic_cleave",
    spell: {
      name: "Titanfall Executioner",
      description: "CAPSTONE — Spend 3 AP & 100 Fervor: Channel the cosmic weight of Aex's Willing Sacrifice. Call down a gigantic hammer of solid starlight in a 25 ft radius within 60 ft: 10d10 sacred + 6d8 smashing damage. Obliterates terrain barriers, leaves permanent Consecrated Ground, and permanently removes 50% of the maximum health of any Aberration struck.",
      flavorText: "The sky falls because Sol commanded the pillar to drop.",
      source: "talent", class: "Crusader", treeId: "solar_justiciar",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 3, targetingMode: "aoe", rangeType: "ranged", range: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "once_per_combat", cooldownValue: 1, cooldownUnit: "combat",
      damageTypes: ["sacred", "smashing"],
      primaryDamage: { dice: "10d10", flat: 0, procChance: 100 },
      secondaryDamage: { dice: "6d8", flat: 0, procChance: 100, damageType: "sacred" },
      visualTheme: "holy", tags: ["capstone", "ultimate", "titanfall", "obliterate", "crusader"]
    },
    rankUpgrades: []
  },
  {
    id: "csj_t7_infinite_fervor",
    name: "Incarnate of Wrath",
    icon: "spell_holy_powerwordbarrier",
    maxRanks: 2,
    position: { x: 2.5, y: 6 },
    requires: "csj_t6_dawn_zealot_vow",
    spell: {
      name: "Incarnate of Wrath",
      description: "Passive: Whenever you reach maximum Fervor, enter Solar Overdrive for 2 rounds: all AP costs are reduced by 1 (minimum 1) and your greatsword smites double their critical hit chance.",
      flavorText: "When the vessel overflows, the world catches fire.",
      source: "talent", class: "Crusader", treeId: "solar_justiciar",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "holy", tags: ["passive", "capstone-row", "ap-reduction", "crusader"]
    },
    rankUpgrades: [
      { description: "Solar Overdrive duration increases to 3 rounds and additionally grants +4 Passive DR while active." }
    ]
  }
];
