// ============================================
// MARTYR — ZEALOT (v3: Rebalanced Tier Budgets, Normalized Grid Coordinates)
// Schema: see talentSystem.mjs.
// Grid coordinates: x (0..4), y (0..6 representing Tiers 1..7).
//
// FANTASY: The Righteous Inquisitor / Sacred Smiter / Holy Fire Avenger.
// ============================================

export const MARTYR_ZEALOT = [
  // ──────────────── TIER 1 (Row 0) ────────────────
  {
    id: "zl_t1_sols_judgment",
    name: "Sol's Judgment",
    icon: "spell_holy_righteousfury",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Sol's Judgment",
      description: "Spend 1 AP and 1 Devotion: Strike a target within 30 feet with solar fire dealing 1d8 sacred damage.",
      flavorText: "The verdict is brief. The appeal window is closed.",
      source: "talent", class: "Martyr", treeId: "zealot",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 1,
      targetingMode: "single", rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 1, cooldownUnit: "round",
      resourceCosts: { devotion: { baseAmount: 1 } },
      damageTypes: ["sacred"],
      primaryDamage: { dice: "1d8", flat: 0, procChance: 100 },
      visualTheme: "sacred", tags: ["damage", "judgment", "martyr"]
    },
    rankUpgrades: [
      { description: "Deals 2d6 sacred damage.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } },
      { description: "Deals 2d8 sacred damage and illuminates the target for 1 round (+1 to hit for all allies).", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "zl_t1_sacred_blade",
    name: "Consecrated Edge",
    icon: "spell_holy_searinglight",
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    spell: {
      name: "Consecrated Edge",
      description: "Passive: Your weapon attacks deal +1d4 sacred damage.",
      flavorText: "Holy runes carved into the steel glow with celestial heat.",
      source: "talent", class: "Martyr", treeId: "zealot",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["sacred"],
      primaryDamage: { dice: "1d4", flat: 0, procChance: 100 },
      visualTheme: "sacred", tags: ["passive", "damage", "martyr"]
    },
    rankUpgrades: [
      { description: "Weapon attacks deal +1d6 sacred damage." },
      { description: "Weapon attacks deal +1d8 sacred damage and ignore up to 2 points of enemy Armor." }
    ]
  },
  {
    id: "zl_t1_zealous_purity",
    name: "Zealous Conviction",
    icon: "spell_holy_sealofwrath",
    maxRanks: 2,
    position: { x: 3, y: 0 },
    requires: null,
    spell: {
      name: "Zealous Conviction",
      description: "Passive: You gain +2 to saving throws against Fear and Charm effects, and +1 to hit against creatures of darkness or undeath.",
      flavorText: "Righteousness leaves no room for hesitation or panic.",
      source: "talent", class: "Martyr", treeId: "zealot",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "accuracy", "save-buff", "martyr"]
    },
    rankUpgrades: [
      { description: "Gain +4 to saving throws against Fear/Charm, and +2 to hit against dark creatures." }
    ]
  },

  // ──────────────── TIER 2 (Row 1) ────────────────
  {
    id: "zl_t2_retributive_smite",
    name: "Retributive Smite",
    icon: "spell_holy_holysmite",
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: "zl_t1_sols_judgment",
    spell: {
      name: "Retributive Smite",
      description: "Spend 1 AP and 1 Devotion: Deliver a crushing melee strike dealing 1d8 physical + 1d8 sacred damage (2d8 total). If the target damaged you or an ally this round, deals +1d6 bonus sacred damage.",
      flavorText: "An eye for an eye, collected in blinding radiance.",
      source: "talent", class: "Martyr", treeId: "zealot",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 1,
      targetingMode: "single", rangeType: "melee", range: 5,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 1, cooldownUnit: "round",
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      damageTypes: ["smashing", "sacred"],
      resourceCosts: { devotion: { baseAmount: 1 } },
      visualTheme: "sacred", tags: ["strike", "smite", "retribution", "martyr"]
    },
    rankUpgrades: [
      { description: "Deals 1d8 physical + 2d6 sacred damage; retribution bonus increases to +1d8 sacred.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } },
      { description: "Deals 1d8 physical + 2d8 sacred damage; retribution bonus increases to +2d6 sacred and Staggers target.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "zl_t2_holy_fire",
    name: "Holy Fire Flare",
    icon: "spell_holy_searinglight",
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: "zl_t1_zealous_purity",
    spell: {
      name: "Holy Fire Flare",
      description: "Spend 1 AP: Hurl a blinding spear of sacred light at a target within 45 feet dealing 1d8 sacred damage and forcing a Spirit save or become Dazed for 1 round.",
      flavorText: "Aim is a courtesy the wicked forfeited.",
      source: "talent", class: "Martyr", treeId: "zealot",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 1,
      targetingMode: "single", rangeType: "ranged", range: 45,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 2, cooldownUnit: "rounds",
      primaryDamage: { dice: "1d8", flat: 0, procChance: 100 },
      damageTypes: ["sacred"],
      visualTheme: "sacred", tags: ["ranged", "daze", "martyr"]
    },
    rankUpgrades: [
      { description: "Deals 2d6 sacred damage and ignores all partial cover.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } },
      { description: "Deals 2d8 sacred damage, ignores cover, and Blinds the target for 1 round on a failed save.", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 } }
    ]
  },

  // ──────────────── TIER 3 (Row 2) ────────────────
  {
    id: "zl_t3_pillar_of_wrath",
    name: "Pillar of Holy Wrath",
    icon: "spell_holy_holybolt",
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: "zl_t2_retributive_smite",
    spell: {
      name: "Pillar of Holy Wrath",
      description: "Spend 1 AP and 2 Devotion: Call down a 15-foot column of pure celestial fury within 40 feet. Deals 2d8 sacred damage to all enemies and knocks them Prone on a failed Fortitude save.",
      flavorText: "A pillar of dawn directly upon the unrepentant.",
      source: "talent", class: "Martyr", treeId: "zealot",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 1,
      targetingMode: "aoe", aoeShape: "circle", aoeSize: 15, rangeType: "ranged", range: 40,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 2, cooldownUnit: "rounds",
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      damageTypes: ["sacred"],
      resourceCosts: { devotion: { baseAmount: 2 } },
      visualTheme: "sacred", tags: ["aoe", "pillar", "knockdown", "martyr"]
    },
    rankUpgrades: [
      { description: "Deals 2d10 sacred damage and leaves radiant consecrated ground for 2 rounds (1d6 sacred/rd).", primaryDamage: { dice: "2d10", flat: 0, procChance: 100 } },
      { description: "Deals 3d8 sacred damage, leaves radiant ground, and generates 1 Devotion if 2 or more enemies are struck.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "zl_t3_fervent_strike",
    name: "Fanatic's Fervor",
    icon: "spell_holy_sealofblood",
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: "zl_t2_holy_fire",
    spell: {
      name: "Fanatic's Fervor",
      description: "Passive: Whenever you score a critical hit or reduce an enemy to 0 HP, immediately gain 1 Devotion and your movement speed increases by 10 feet for 1 round.",
      flavorText: "Righteous victory fuels boundless zeal.",
      source: "talent", class: "Martyr", treeId: "zealot",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "on-kill", "speed", "martyr"]
    },
    rankUpgrades: [
      { description: "Gain 1 Devotion, +15 feet speed, and your next attack deals +1d6 sacred damage." },
      { description: "Gain 2 Devotion, +15 feet speed, and your next attack deals +1d8 sacred damage." }
    ]
  },

  // ──────────────── TIER 4 (Row 3) ────────────────
  {
    id: "zl_t4_inquisitors_brand",
    name: "Inquisitor's Brand",
    icon: "spell_holy_righteousfury",
    maxRanks: 1,
    position: { x: 2, y: 3 },
    requires: ["zl_t3_pillar_of_wrath", "zl_t3_fervent_strike"],
    spell: {
      name: "Inquisitor's Brand",
      description: "Spend 1 AP and 2 Devotion: Brand an enemy within 35 feet with the symbol of Sol. Deals 2d10 sacred damage immediately, and all sacred damage dealt to the target by anyone is increased by +1d6 for 2 rounds.",
      flavorText: "Marked for destruction. There is no sanctuary.",
      source: "talent", class: "Martyr", treeId: "zealot",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 1,
      targetingMode: "single", rangeType: "ranged", range: 35,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 3, cooldownUnit: "rounds",
      primaryDamage: { dice: "2d10", flat: 0, procChance: 100 },
      damageTypes: ["sacred"],
      resourceCosts: { devotion: { baseAmount: 2 } },
      visualTheme: "sacred", tags: ["strike", "brand", "vulnerability", "martyr"]
    }
  },

  // ──────────────── TIER 5 (Row 4) ────────────────
  {
    id: "zl_t5_searing_halo",
    name: "Searing Halo",
    icon: "spell_holy_auraoflight",
    maxRanks: 3,
    position: { x: 1, y: 4 },
    requires: "zl_t4_inquisitors_brand",
    spell: {
      name: "Searing Halo",
      description: "Passive: A glowing corona of white-hot light crowns you. Enemies within 10 feet take 2 sacred damage at the start of their turns.",
      flavorText: "The heat of absolute conviction radiates outward.",
      source: "talent", class: "Martyr", treeId: "zealot",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["sacred"],
      visualTheme: "sacred", tags: ["passive", "aura", "damage", "martyr"]
    },
    rankUpgrades: [
      { description: "Aura deals 4 sacred damage to enemies within 10 feet." },
      { description: "Aura deals 6 sacred damage to enemies within 10 feet and illuminates them, preventing concealment." }
    ]
  },
  {
    id: "zl_t5_righteous_execution",
    name: "Righteous Execution",
    icon: "ability_warrior_decisivestrike",
    maxRanks: 2,
    position: { x: 3, y: 4 },
    requires: "zl_t4_inquisitors_brand",
    spell: {
      name: "Righteous Execution",
      description: "Passive: Your attacks against enemies below half maximum health score critical hits on rolls of 19–20 and deal +1d6 bonus sacred damage.",
      flavorText: "Finishing the judgment with a single, decisive stroke.",
      source: "talent", class: "Martyr", treeId: "zealot",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["sacred"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "sacred", tags: ["passive", "crit-range", "execute", "martyr"]
    },
    rankUpgrades: [
      { description: "Critical hits occur on rolls of 18–20 and deal +1d8 bonus sacred damage." }
    ]
  },

  // ──────────────── TIER 6 (Row 5) ────────────────
  {
    id: "zl_t6_sunburst_nova",
    name: "Sunburst Nova",
    icon: "spell_holy_divineprovidence",
    maxRanks: 3,
    position: { x: 2, y: 5 },
    requires: ["zl_t5_searing_halo", "zl_t5_righteous_execution"],
    spell: {
      name: "Sunburst Nova",
      description: "Spend 2 AP and 3 Devotion: Detonate a blinding super-nova in a 25-foot radius. Deals 3d8 sacred damage to all enemies and Blinds all targets that fail a Spirit save for 1 round.",
      flavorText: "The sky splits open and daylight pours down with crushing weight.",
      source: "talent", class: "Martyr", treeId: "zealot",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 2,
      targetingMode: "aoe", aoeShape: "circle", aoeSize: 25, rangeType: "ranged", range: 35,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 3, cooldownUnit: "rounds",
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      damageTypes: ["sacred"],
      resourceCosts: { devotion: { baseAmount: 3 } },
      visualTheme: "sacred", tags: ["nuke", "aoe", "blind", "martyr"]
    },
    rankUpgrades: [
      { description: "Deals 3d10 sacred damage and forces enemies to drop 1 rank of weapon guard.", primaryDamage: { dice: "3d10", flat: 0, procChance: 100 } },
      { description: "Deals 4d8 sacred damage, Blinds targets, and sets the ground on fire with sacred embers for 2 rounds.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 } }
    ]
  },

  // ──────────────── TIER 7 (Row 6 - Capstones) ────────────────
  {
    id: "zl_t7_avatar_of_wrath",
    name: "Avatar of the Holy Avenger",
    icon: "spell_holy_powerwordbarrier",
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: "zl_t6_sunburst_nova",
    spell: {
      name: "Avatar of the Holy Avenger",
      description: "ULTIMATE: Spend 2 AP and 3 Devotion: For 2 rounds, transform into an angel of righteous vengeance. All your attacks deal +1d10 sacred damage, your critical hits blind targets for 1 round, and you gain +3 Armor and +2 to hit.",
      flavorText: "You are the sword of Sol made flesh. Sinners burn in your shadow.",
      source: "talent", class: "Martyr", treeId: "zealot",
      spellType: "ACTIVE", category: "buff",
      actionPoints: 2,
      targetingMode: "self",
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 5, cooldownUnit: "rounds",
      resourceCosts: { devotion: { baseAmount: 3 } },
      visualTheme: "sacred", tags: ["ultimate", "avenger", "buff", "martyr"]
    }
  },
  {
    id: "zl_t7_unrelenting_crusade",
    name: "Unrelenting Crusade",
    icon: "spell_holy_blessingofstrength",
    maxRanks: 2,
    position: { x: 1, y: 6 },
    requires: "zl_t6_sunburst_nova",
    spell: {
      name: "Unrelenting Crusade",
      description: "Passive: Your sacred damage ignores up to 5 points of enemy Sacred / Elemental Resistance and deals double damage to undead and demons.",
      flavorText: "No unholy ward can withstand the true flame.",
      source: "talent", class: "Martyr", treeId: "zealot",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "penetration", "anti-evil", "martyr"]
    },
    rankUpgrades: [
      { description: "Ignores up to 8 points of resistance and your sacred critical hits generate 2 Devotion." }
    ]
  },
  {
    id: "zl_t7_martyrs_retribution",
    name: "Wrath of the Saint",
    icon: "spell_holy_sealofsacrifice",
    maxRanks: 2,
    position: { x: 3, y: 6 },
    requires: "zl_t6_sunburst_nova",
    spell: {
      name: "Wrath of the Saint",
      description: "Passive: When you take damage equal to 12 or more in a single hit, unleash an automatic retort dealing 2d8 sacred damage to the attacker.",
      flavorText: "Strike the bell, hear the thunder.",
      source: "talent", class: "Martyr", treeId: "zealot",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["sacred"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      visualTheme: "sacred", tags: ["passive", "retaliation", "martyr"]
    },
    rankUpgrades: [
      { description: "Retaliation deals 3d8 sacred damage and Dazes the attacker for 1 round." }
    ]
  }
];
