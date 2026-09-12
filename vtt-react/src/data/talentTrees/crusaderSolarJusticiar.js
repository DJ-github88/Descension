// ============================================
// CRUSADER — SOLAR JUSTICIAR (v3: talents are spells)
// Fantasy: the greatsword executioner of the Dawn Vigil. Fervor-fuelled
// smites, armour sundering, consecrated ground, and the falling Titanfall.
// Economy: 8/6/6/5/5/5 + 15 = 50 pts across 7 tiers (19 nodes).
// Layout: XBLADES — two greatswords cross at the heart of the tree.
// ============================================

export const CRUSADER_SOLAR_JUSTICIAR = [
  // ─── TIER 1 (y: 0) ───
  {
    id: "csj_t1_zealots_edge",
    name: "Zealot's Edge",
    icon: "Slashing/Flaming Sword",
    maxRanks: 3,
    position: { x: 0.5, y: 0 },
    requires: null,
    spell: {
      name: "Zealot's Edge",
      description: "Passive — Aex's first furnace still burns in your blade. Melee attacks deal +1d4 sacred damage and generate +3 bonus Fervor.",
      flavorText: "The blade is heavy so that the prayer cannot wander.",
      source: "talent", class: "Crusader", treeId: "solar_justiciar",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["sacred"],
      primaryDamage: { dice: "1d4", flat: 0, procChance: 100 },
      visualTheme: "holy", tags: ["passive", "builder", "fervor-gen", "crusader"]
    },
    rankUpgrades: [
      { description: "Melee attacks deal +1d6 sacred damage and generate +6 bonus Fervor.", primaryDamage: { dice: "1d6", flat: 0, procChance: 100 } },
      { description: "Melee attacks deal +1d8 sacred damage, generate +10 bonus Fervor, and critical hits grant +10 additional Fervor.", primaryDamage: { dice: "1d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "csj_t1_righteous_cleave",
    name: "Righteous Cleave",
    icon: "Slashing/Slashing Cleave",
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    spell: {
      name: "Righteous Cleave",
      description: "Spend 2 AP: sweep Starlight Cleave through a 10 ft arc for 1d10 smashing + 1d6 sacred damage and +10 Fervor. Deals +15% damage to Aberrations, Undead, and Wyrd-tainted creatures.",
      flavorText: "Cut wide. Wyrd corruption rarely travels alone.",
      source: "talent", class: "Crusader", treeId: "solar_justiciar",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 2, targetingMode: "cone", rangeType: "melee", range: 10,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 3, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 4 } },
      damageTypes: ["smashing", "sacred"],
      primaryDamage: { dice: "1d10", flat: 0, procChance: 100 },
      secondaryDamage: { dice: "1d6", flat: 0, procChance: 100, damageType: "sacred" },
      visualTheme: "holy", tags: ["melee", "aoe", "cone", "builder", "crusader"]
    },
    rankUpgrades: [
      { description: "Damage increases to 2d8 smashing + 1d8 sacred, the tainted-foe bonus rises to +25%, and the cleave generates +15 Fervor.", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 }, secondaryDamage: { dice: "1d8", flat: 0, procChance: 100, damageType: "sacred" } },
      { description: "Damage increases to 2d10 smashing + 2d6 sacred and striking 2 or more tainted foes refunds 1 AP.", primaryDamage: { dice: "2d10", flat: 0, procChance: 100 }, secondaryDamage: { dice: "2d6", flat: 0, procChance: 100, damageType: "sacred" } }
    ]
  },
  {
    id: "csj_t1_unflinching_stride",
    name: "Unflinching Stride",
    icon: "Bludgeoning/Steady Step",
    maxRanks: 2,
    position: { x: 3.5, y: 0 },
    requires: null,
    spell: {
      name: "Unflinching Stride",
      description: "Passive — Gain +5 ft movement speed. While in Harmonic Stance (50+ Fervor), movement-impairing effects on you are 50% less effective.",
      flavorText: "He marches as though the mountain were already levelled.",
      source: "talent", class: "Crusader", treeId: "solar_justiciar",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "holy", tags: ["passive", "mobility", "harmonic-stance", "crusader"]
    },
    rankUpgrades: [
      { description: "Movement bonus increases to +10 ft, and while in Harmonic Stance you are immune to Slow and Immobilize effects." }
    ]
  },

  // ─── TIER 2 (y: 1) ───
  {
    id: "csj_t2_sundering_wrath",
    name: "Sundering Wrath",
    icon: "Radiant/Divine Downward Sword",
    maxRanks: 3,
    position: { x: 1.25, y: 1.5 },
    requires: "csj_t1_zealots_edge",
    spell: {
      name: "Sundering Wrath",
      description: "Passive — Harmonic Smite and any attack that spends 20+ Fervor shatter enemy armour: the target's Passive DR is reduced by 2 for 2 rounds.",
      flavorText: "Steel breaks before faith does.",
      source: "talent", class: "Crusader", treeId: "solar_justiciar",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "single",
      visualTheme: "holy", tags: ["passive", "armor-sunder", "fervor-payoff", "crusader"]
    },
    rankUpgrades: [
      { description: "The armour shatter reduces Passive DR by 4 and stacks up to 2 times." },
      { description: "The armour shatter reduces Passive DR by 6, and the target also loses 1 tier of Physical resistance." }
    ]
  },
  {
    id: "csj_t2_searing_cross",
    name: "Searing Cross",
    icon: "Slashing/Cross Slash",
    maxRanks: 3,
    position: { x: 2.75, y: 1.5 },
    requires: "csj_t1_righteous_cleave",
    spell: {
      name: "Searing Cross",
      description: "Spend 2 AP & 25 Fervor: strike twice in a cross for 2d8 slicing + 2d8 sacred damage. The wound is seared — the target takes 1d6 sacred damage at the start of its turn for 2 rounds.",
      flavorText: "Two strokes. One for the vow, one for the execution.",
      source: "talent", class: "Crusader", treeId: "solar_justiciar",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 2, targetingMode: "single", rangeType: "melee", range: 5,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 4, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 6 } },
      damageTypes: ["slicing", "sacred"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      secondaryDamage: { dice: "2d8", flat: 0, procChance: 100, damageType: "sacred" },
      isDot: true, dotTick: "1d6", dotDuration: 2,
      visualTheme: "holy", tags: ["melee", "burst", "spender", "sear", "crusader"]
    },
    rankUpgrades: [
      { description: "Damage increases to 3d8 slicing + 2d8 sacred, and the searing wound burns for 3 rounds.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 }, dotDuration: 3 },
      { description: "Damage increases to 3d10 slicing + 3d8 sacred; if the target is an Aberration or Undead it erupts on death for 2d8 sacred damage in 10 ft.", primaryDamage: { dice: "3d10", flat: 0, procChance: 100 }, secondaryDamage: { dice: "3d8", flat: 0, procChance: 100, damageType: "sacred" } }
    ]
  },

  // ─── TIER 3 (y: 3) ───
  {
    id: "csj_t3_harmonic_overdrive",
    name: "Harmonic Overdrive",
    icon: "Lightning/Thunder Resonance",
    maxRanks: 3,
    position: { x: 2.25, y: 3 },
    requires: "csj_t2_sundering_wrath",
    spell: {
      name: "Harmonic Overdrive",
      description: "Passive — At 75+ Fervor your greatsword hums at the binding frequency: melee reach increases by 5 ft and melee strikes deal +2d6 sacred damage.",
      flavorText: "The blade extends where the light reaches.",
      source: "talent", class: "Crusader", treeId: "solar_justiciar",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["sacred"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      visualTheme: "holy", tags: ["passive", "reach", "harmonic-stance", "crusader"]
    },
    rankUpgrades: [
      { description: "The Fervor threshold drops to 50+, and the bonus sacred damage increases to +3d6.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } },
      { description: "The Fervor threshold drops to 40+, and your strikes ignore 50% of the target's Active Soak dice." }
    ]
  },
  {
    id: "csj_t3_consecrated_impact",
    name: "Consecrated Impact",
    icon: "Radiant/Radiant Sunburst",
    maxRanks: 3,
    position: { x: 1.75, y: 3 },
    requires: "csj_t2_searing_cross",
    spell: {
      name: "Consecrated Impact",
      description: "Passive — Critical hits and kills made with Fervor-spending attacks consecrate the ground beneath the target for 3 rounds (10 ft). Enemies inside take 1d8 sacred damage at the start of their turn.",
      flavorText: "Where the righteous strike, the earth remembers.",
      source: "talent", class: "Crusader", treeId: "solar_justiciar",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "ground", damageTypes: ["sacred"],
      primaryDamage: { dice: "1d8", flat: 0, procChance: 100 },
      visualTheme: "holy", tags: ["passive", "consecration", "ground", "crusader"]
    },
    rankUpgrades: [
      { description: "The consecrated ground expands to 15 ft and deals 2d8 sacred damage per round; allies standing on it gain +2 on Active Soak die rolls.", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 } },
      { description: "The consecrated ground expands to 20 ft, deals 3d8 sacred damage per round, and allies on it gain +5 Fervor at the start of their turn.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } }
    ]
  },

  // ─── TIER 4 (y: 4.5) ───
  {
    id: "csj_t4_judgment_blade",
    name: "Judgment Blade",
    icon: "Radiant/Angelic Sword",
    maxRanks: 3,
    position: { x: 2.75, y: 4.5 },
    requires: "csj_t3_harmonic_overdrive",
    spell: {
      name: "Judgment Blade",
      description: "Spend 2 AP & 40 Fervor: leap up to 20 ft and bring your greatsword down for 4d8 smashing + 3d8 sacred damage, knocking the target Prone.",
      flavorText: "Gravity is merely Sol's judgment given weight.",
      source: "talent", class: "Crusader", treeId: "solar_justiciar",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 2, targetingMode: "single", rangeType: "ranged", range: 20,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 5, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 8 } },
      damageTypes: ["smashing", "sacred"],
      primaryDamage: { dice: "4d8", flat: 0, procChance: 100 },
      secondaryDamage: { dice: "3d8", flat: 0, procChance: 100, damageType: "sacred" },
      visualTheme: "holy", tags: ["gap-closer", "burst", "prone", "spender", "crusader"]
    },
    rankUpgrades: [
      { description: "Damage increases to 5d8 smashing + 4d8 sacred and the leap extends to 30 ft.", primaryDamage: { dice: "5d8", flat: 0, procChance: 100 }, secondaryDamage: { dice: "4d8", flat: 0, procChance: 100, damageType: "sacred" } },
      { description: "Damage increases to 6d10 smashing + 5d8 sacred; the landing shockwave deals 2d8 sacred damage to enemies within 10 ft.", primaryDamage: { dice: "6d10", flat: 0, procChance: 100 }, secondaryDamage: { dice: "5d8", flat: 0, procChance: 100, damageType: "sacred" } }
    ]
  },
  {
    id: "csj_t4_fervent_execution",
    name: "Fervent Execution",
    icon: "Slashing/Execution",
    maxRanks: 2,
    position: { x: 1.25, y: 4.5 },
    requires: "csj_t3_consecrated_impact",
    spell: {
      name: "Fervent Execution",
      description: "Passive — Against enemies below 35% health your Fervor spenders deal +30% critical damage, and kills refund 50% of the Fervor spent.",
      flavorText: "Finish it. Do not let corruption bleed into tomorrow.",
      source: "talent", class: "Crusader", treeId: "solar_justiciar",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "holy", tags: ["passive", "execute", "fervor-refund", "crusader"]
    },
    rankUpgrades: [
      { description: "The critical damage bonus rises to +50%, the threshold extends to enemies below 45% health, and kills refund 100% of the Fervor spent and grant 1 AP." }
    ]
  },

  // ─── TIER 5 (y: 6) ───
  {
    id: "csj_t5_solar_combustion",
    name: "Solar Combustion",
    icon: "Fire/Flame Burst",
    maxRanks: 3,
    position: { x: 3.25, y: 6 },
    requires: "csj_t4_judgment_blade",
    spell: {
      name: "Solar Combustion",
      description: "Passive — Spending 50+ Fervor in a single turn sets your blade alight: your next 2 attacks deal +2d8 ember/sacred damage and ignore physical DR.",
      flavorText: "The blade drinks starlight until it breathes fire.",
      source: "talent", class: "Crusader", treeId: "solar_justiciar",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["sacred", "ember"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      visualTheme: "holy", tags: ["passive", "ignite", "armor-ignore", "crusader"]
    },
    rankUpgrades: [
      { description: "The ignited attacks deal +3d8 ember/sacred damage and last for 3 attacks.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } },
      { description: "The ignited attacks deal +4d8 ember/sacred damage, and each one releases a 10 ft cone of holy flame.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "csj_t5_unyielding_fervor",
    name: "Unyielding Fervor",
    icon: "Fire/Firey Dedication",
    maxRanks: 2,
    position: { x: 0.75, y: 6 },
    requires: "csj_t4_fervent_execution",
    spell: {
      name: "Unyielding Fervor",
      description: "Passive — Fervor decays 50% slower outside of combat, and taking damage generates 1 Fervor per 5 damage suffered.",
      flavorText: "Pain is merely fuel awaiting direction.",
      source: "talent", class: "Crusader", treeId: "solar_justiciar",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "holy", tags: ["passive", "fervor-gen", "sustain", "crusader"]
    },
    rankUpgrades: [
      { description: "Fervor no longer decays during combat, and taking damage generates 1 Fervor per 3 damage suffered." }
    ]
  },

  // ─── TIER 6 (y: 7.5) ───
  {
    id: "csj_t6_titanic_cleave",
    name: "Titanfall Cleave",
    icon: "Slashing/Whirl",
    maxRanks: 1,
    position: { x: 3.5, y: 7 },
    requires: "csj_t5_solar_combustion",
    spell: {
      name: "Titanfall Cleave",
      description: "Spend 3 AP & 60 Fervor: whirl your greatsword through a 360° arc (15 ft) for 6d8 smashing + 4d8 sacred damage, hurling every enemy 10 ft back.",
      flavorText: "One revolution to clear the temple floor.",
      source: "talent", class: "Crusader", treeId: "solar_justiciar",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 3, targetingMode: "aoe", rangeType: "self-centered", range: 15,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 8, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { mana: { baseAmount: 10 } },
      damageTypes: ["smashing", "sacred"],
      primaryDamage: { dice: "6d8", flat: 0, procChance: 100 },
      secondaryDamage: { dice: "4d8", flat: 0, procChance: 100, damageType: "sacred" },
      visualTheme: "holy", tags: ["aoe", "whirlwind", "knockback", "crusader"]
    },
    rankUpgrades: []
  },
  {
    id: "csj_t6_vow_of_sunblade",
    name: "Vow of the Sunblade",
    icon: "Radiant/Angelic Ascension",
    maxRanks: 2,
    position: { x: 2, y: 7 },
    requires: ["csj_t5_solar_combustion", "csj_t5_unyielding_fervor"],
    spell: {
      name: "Vow of the Sunblade",
      description: "Passive — Your capacity for starlight deepens: maximum Fervor increased to 120, and you enter combat with 30 Fervor already banked.",
      flavorText: "He does not warm to the fight. He arrives already boiling.",
      source: "talent", class: "Crusader", treeId: "solar_justiciar",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "holy", tags: ["passive", "cap-increase", "opener", "crusader"]
    },
    rankUpgrades: [
      { description: "Maximum Fervor increases to 150, and you enter combat with 50 Fervor banked." }
    ]
  },
  {
    id: "csj_t6_burning_vigil",
    name: "Dawnfire Baptism",
    icon: "Radiant/Divine Halo",
    maxRanks: 2,
    position: { x: 0.5, y: 7 },
    requires: "csj_t5_unyielding_fervor",
    spell: {
      name: "Dawnfire Baptism",
      description: "Passive — The starlight that would scorch you is reforged. While at 80+ Fervor you take no self-damage from Zealous Scorching, gain +2 Passive DR, and your next Fervor spender deals +2d8 sacred damage.",
      flavorText: "Baptised in the overload, the vessel no longer cracks.",
      source: "talent", class: "Crusader", treeId: "solar_justiciar",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["sacred"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      visualTheme: "holy", tags: ["passive", "overload", "zealous-scorching", "crusader"]
    },
    rankUpgrades: [
      { description: "The Passive DR becomes +4, the bonus damage becomes +3d8, and when it triggers allies within 15 ft gain +10 Fervor.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } }
    ]
  },

  // ─── TIER 7 (y: 8) ───
  {
    id: "csj_t7_titanfall_executioner",
    name: "Titanfall Executioner",
    icon: "Bludgeoning/Comet Strike",
    maxRanks: 1,
    position: { x: 4, y: 8 },
    requires: "csj_t6_titanic_cleave",
    spell: {
      name: "Titanfall Executioner",
      description: "ULTIMATE — Spend 3 AP & 100 Fervor: call down Aex's titanic starlight hammer within 60 ft (25 ft radius) for 10d10 sacred + 6d8 smashing damage. It destroys terrain barriers, leaves permanent Consecrated Ground, and strips 50% of the maximum health from any Aberration struck.",
      flavorText: "The sky falls because Sol commanded the pillar to drop.",
      source: "talent", class: "Crusader", treeId: "solar_justiciar",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 3, targetingMode: "aoe", rangeType: "ranged", range: 60,
      aoeShape: "circle", aoeSize: 25,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "once_per_combat", cooldownValue: 1, cooldownUnit: "combat",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 15 } },
      damageTypes: ["sacred", "smashing"],
      primaryDamage: { dice: "10d10", flat: 0, procChance: 100 },
      secondaryDamage: { dice: "6d8", flat: 0, procChance: 100, damageType: "sacred" },
      visualTheme: "holy", tags: ["ultimate", "capstone", "titanfall", "crusader"]
    },
    rankUpgrades: []
  },
  {
    id: "csj_t7_justiciar_doctrine",
    name: "Justiciar Doctrine",
    icon: "Radiant/Holy Bible",
    maxRanks: 5,
    position: { x: 3, y: 8 },
    requires: "csj_t6_titanic_cleave",
    spell: {
      name: "Justiciar Doctrine",
      description: "Passive — Your Fervor-spending strikes deal +1d6 sacred damage.",
      flavorText: "Every rank of zeal is a written verdict.",
      source: "talent", class: "Crusader", treeId: "solar_justiciar",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["sacred"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "holy", tags: ["passive", "doctrine", "fervor-payoff", "crusader"]
    },
    rankUpgrades: [
      { description: "The bonus becomes +2d6 sacred damage and Harmonic Smite's Fervor requirement drops to 45+.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } },
      { description: "The bonus becomes +3d6 sacred damage and spending 50+ Fervor in a turn halves the Fervor cost of your next spender.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } },
      { description: "The bonus becomes +4d6 sacred damage and critical hits refund 10 Fervor.", primaryDamage: { dice: "4d6", flat: 0, procChance: 100 } },
      { description: "The bonus becomes +5d6 sacred damage, and once per round your first Fervor spender at 100 Fervor costs no Fervor.", primaryDamage: { dice: "5d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "csj_t7_solar_reservoir",
    name: "Sunwell Reservoir",
    icon: "Radiant/Radiant Core",
    maxRanks: 3,
    position: { x: 2, y: 8 },
    requires: "csj_t6_vow_of_sunblade",
    spell: {
      name: "Sunwell Reservoir",
      description: "Passive — You enter combat with 20 Fervor, and Consecrated Ground you create generates +5 Fervor per round for you and your allies standing on it.",
      flavorText: "The sun does not spend itself all at once.",
      source: "talent", class: "Crusader", treeId: "solar_justiciar",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self",
      visualTheme: "holy", tags: ["passive", "reservoir", "consecrated-ground", "crusader"]
    },
    rankUpgrades: [
      { description: "You enter combat with 40 Fervor and Consecrated Ground generates +10 Fervor per round." },
      { description: "You enter combat with 60 Fervor, and allies on your Consecrated Ground also gain +2 Passive DR." }
    ]
  },
  {
    id: "csj_t7_sunburst_verdict",
    name: "Verdict of the Sun",
    icon: "Radiant/Radiant Sun",
    maxRanks: 3,
    position: { x: 1, y: 8 },
    requires: "csj_t6_burning_vigil",
    spell: {
      name: "Verdict of the Sun",
      description: "Passive — Solvan Judgment can be unleashed at 80 Fervor instead of 100, and detonates a 15 ft starlight nova for 2d8 sacred damage.",
      flavorText: "Mercy is a verdict too — and it is not this one.",
      source: "talent", class: "Crusader", treeId: "solar_justiciar",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["sacred"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      visualTheme: "holy", tags: ["passive", "judgment", "nova", "crusader"]
    },
    rankUpgrades: [
      { description: "Solvan Judgment can be unleashed at 60 Fervor and the nova deals 3d8 sacred damage.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } },
      { description: "Solvan Judgment can be unleashed at 40 Fervor and the nova deals 4d8 sacred damage, blinding struck enemies for 1 round.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "csj_t7_incarnate_of_wrath",
    name: "Incarnate of Wrath",
    icon: "Radiant/Radiant Warrior",
    maxRanks: 3,
    position: { x: 0, y: 8 },
    requires: "csj_t6_burning_vigil",
    spell: {
      name: "Incarnate of Wrath",
      description: "Passive — Reaching maximum Fervor triggers Solar Overdrive for 2 rounds: all AP costs are reduced by 1 (minimum 1) and your melee critical hit chance is doubled.",
      flavorText: "When the vessel overflows, the world catches fire.",
      source: "talent", class: "Crusader", treeId: "solar_justiciar",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "holy", tags: ["passive", "capstone-row", "overdrive", "crusader"]
    },
    rankUpgrades: [
      { description: "Solar Overdrive lasts 3 rounds and grants +4 Passive DR while active." },
      { description: "Solar Overdrive lasts 4 rounds, and your first smite each round during it costs no Fervor." }
    ]
  }
];
