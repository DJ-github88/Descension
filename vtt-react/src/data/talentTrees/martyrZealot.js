// ============================================
// MARTYR — ZEALOT (v2: talents are spells)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50.
// The judgment tree: sacred damage, smites, holy wrath.
// ============================================

export const MARTYR_ZEALOT = [
  {
    id: "zl_t1_sols_judgment",
    name: "Sol's Judgment",
    icon: "spell_holy_righteousfury",
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    spell: {
      name: "Sol's Judgment",
      description: "Sol's righteous fire burns through your sworn enemies. Deal 2d6 sacred damage plus your Spirit modifier to one creature within 30 feet. Costs 1 Devotion.",
      flavorText: "The verdict is brief. The appeal window is closed.",
      source: "talent", class: "Martyr", treeId: "zealot",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 6, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { devotion: { baseAmount: 1 } },
      damageTypes: ["sacred"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      visualTheme: "sacred", tags: ["damage", "judgment", "martyr"]
    },
    rankUpgrades: [
      { description: "Sol's righteous fire burns through your sworn enemies. Deal 3d6 sacred damage plus your Spirit modifier to one creature within 30 feet. Costs 1 Devotion.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } },
      { description: "Sol's righteous fire burns through your sworn enemies. Deal 3d6 sacred damage plus your Spirit modifier to one creature within 40 feet. Costs 1 Devotion.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 }, range: 40 }
    ]
  },
  {
    id: "zl_t1_sacred_flame",
    name: "Sacred Flame",
    icon: "spell_holy_searinglight",
    maxRanks: 3,
    position: { x: 0.5, y: 1 },
    requires: null,
    spell: {
      name: "Sacred Flame",
      description: "Channel Sol's purifying flame to consume the wicked. A target within 60 feet must make a Spirit save or take 2d8 sacred damage. No attack roll required.",
      flavorText: "Aim is a courtesy the wicked forfeited.",
      source: "talent", class: "Martyr", treeId: "zealot",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "ranged", range: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 8, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 8 } },
      damageTypes: ["sacred"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      visualTheme: "sacred", tags: ["damage", "save-based", "martyr"]
    },
    rankUpgrades: [
      { description: "Channel Sol's purifying flame to consume the wicked. A target within 60 feet must make a Spirit save or take 3d8 sacred damage; cover does not help. No attack roll required.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } },
      { description: "Channel Sol's purifying flame to consume the wicked. A target within 60 feet must make a Spirit save or take 3d8 sacred damage and be blinded for 1 round. No attack roll, cover does not help.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 }, debuffs: ["blinded"] }
    ]
  },
  {
    id: "zl_t1_wrathful_smite",
    name: "Wrathful Smite",
    icon: "spell_holy_crusaderstrike",
    maxRanks: 2,
    position: { x: 3.5, y: 1 },
    requires: null,
    spell: {
      name: "Wrathful Smite",
      description: "Sol's wrath descends through your righteous strike. Empower your next attack: +2d6 sacred damage, and the target must pass a Spirit save or be frightened for 1 round. Costs 1 Devotion.",
      flavorText: "Sharpened with somebody else's rage.",
      source: "talent", class: "Martyr", treeId: "zealot",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 10, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { devotion: { baseAmount: 1 } },
      damageTypes: ["sacred"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      visualTheme: "sacred", tags: ["smite", "empower", "martyr"]
    },
    rankUpgrades: [
      { description: "Sol's wrath descends through your righteous strike. Empower your next attack: +4d6 sacred damage, and the target must pass a Spirit save or be frightened for 2 rounds. Costs 1 Devotion.", primaryDamage: { dice: "4d6", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "zl_t2_crusader_strike",
    name: "Crusader Strike",
    icon: "spell_holy_crusaderstrike",
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: "zl_t1_sols_judgment",
    spell: {
      name: "Crusader Strike",
      description: "Each blow channels Sol's healing radiance. Strike for weapon damage plus 2d6 sacred damage; you heal for half the sacred damage dealt.",
      flavorText: "The sword gives back. Eventually, to someone.",
      source: "talent", class: "Martyr", treeId: "zealot",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "melee", range: 5,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 6, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 5 } },
      damageTypes: ["sacred"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      visualTheme: "sacred", tags: ["melee", "sustain", "martyr"]
    },
    rankUpgrades: [
      { description: "Each blow channels Sol's healing radiance. Strike for weapon damage plus 3d6 sacred damage; you heal for half the sacred damage dealt.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } },
      { description: "Each blow channels Sol's healing radiance. Strike for weapon damage plus 4d6 sacred damage; you and your lowest-health ally each heal for half the sacred damage dealt.", primaryDamage: { dice: "4d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "zl_t2_dawns_reckoning",
    name: "Dawn's Reckoning",
    icon: "spell_holy_blessingofstrength",
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: "zl_t1_sacred_flame",
    spell: {
      name: "Dawn's Reckoning",
      description: "Those who strike you feel Sol's searing judgment returned. When you are hit by a melee attack, the attacker takes 2d6 sacred damage.",
      flavorText: "Every blow against you is a signed confession.",
      source: "talent", class: "Martyr", treeId: "zealot",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["sacred"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      visualTheme: "sacred", tags: ["passive", "retaliation", "martyr"]
    },
    rankUpgrades: [
      { description: "Those who strike you feel Sol's searing judgment returned. When you are hit by a melee attack, the attacker takes 3d6 sacred damage.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } },
      { description: "Those who strike you feel Sol's searing judgment returned. When you are hit by ANY attack, the attacker takes 4d6 sacred damage.", primaryDamage: { dice: "4d6", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "zl_t3_wrath_of_heaven",
    name: "Wrath of Heaven",
    icon: "spell_holy_sealofwrath",
    maxRanks: 3,
    position: { x: 2, y: 3.5 },
    requires: "zl_t2_crusader_strike",
    spell: {
      name: "Wrath of Heaven",
      description: "Sol's celestial fury rains down at your call. Call down judgment in a 20-foot radius within 60 feet: enemies take 4d6 sacred damage. Costs 2 Devotion.",
      flavorText: "Skyfall, on request.",
      source: "talent", class: "Martyr", treeId: "zealot",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "ranged", range: 60, aoeShape: "circle", aoeSize: 20,
      castTimeType: "short", castTimeValue: 1.5,
      cooldownCategory: "medium", cooldownValue: 20, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: true,
      resourceCosts: { devotion: { baseAmount: 2 }, mana: { baseAmount: 12 } },
      damageTypes: ["sacred"],
      primaryDamage: { dice: "4d6", flat: 0, procChance: 100 },
      visualTheme: "sacred", tags: ["aoe", "judgment", "martyr"]
    },
    rankUpgrades: [
      { description: "Sol's celestial fury rains down at your call. Call down judgment in a 25-foot radius within 60 feet: enemies take 6d6 sacred damage. Costs 2 Devotion.", primaryDamage: { dice: "6d6", flat: 0, procChance: 100 } },
      { description: "Sol's celestial fury rains down at your call. Call down judgment in a 30-foot radius within 90 feet: enemies take 8d6 sacred damage and are blinded for 1 round. Costs 2 Devotion.", primaryDamage: { dice: "8d6", flat: 0, procChance: 100 }, debuffs: ["blinded"] }
    ]
  },
  {
    id: "zl_t3_holy_avenger",
    name: "Dawnsworn Avenger",
    icon: "spell_holy_auraoflight",
    maxRanks: 3,
    position: { x: 2.5, y: 3.5 },
    requires: "zl_t2_dawns_reckoning",
    spell: {
      name: "Dawnsworn Avenger",
      description: "Sol's light sanctifies your weapon. Your weapon attacks are treated as magical and deal 1d6 additional sacred damage.",
      flavorText: "The blade took an oath. It keeps it better than most.",
      source: "talent", class: "Martyr", treeId: "zealot",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["sacred"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "sacred", tags: ["passive", "weapon", "martyr"]
    },
    rankUpgrades: [
      { description: "Sol's light sanctifies your weapon. Your weapon attacks are treated as magical and deal 2d6 additional sacred damage.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } },
      { description: "Sol's light sanctifies your weapon. Your weapon attacks are magical, deal 3d6 additional sacred damage, and ignore resistance to sacred damage.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "zl_t4_sword_of_justice",
    name: "Sword of Justice",
    icon: "spell_holy_righteousnessaura",
    maxRanks: 3,
    position: { x: 2, y: 4.5 },
    requires: "zl_t3_wrath_of_heaven",
    spell: {
      name: "Sword of Justice",
      description: "You wield Sol's perfect judgment as an unyielding blade. Your attacks ignore sacred resistance, and critical hits deal maximum damage.",
      flavorText: "Moderation, in the pursuit of justice, is no virtue.",
      source: "talent", class: "Martyr", treeId: "zealot",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["sacred"],
      visualTheme: "sacred", tags: ["passive", "penetration", "crit", "martyr"]
    },
    rankUpgrades: [
      { description: "You wield Sol's perfect judgment as an unyielding blade. Your attacks ignore sacred resistance, critical hits deal maximum damage, and your crit range increases by 1." },
      { description: "You wield Sol's perfect judgment as an unyielding blade. Your attacks ignore sacred resistance AND immunity, critical hits deal maximum damage, and your crit range increases by 2." }
    ]
  },
  {
    id: "zl_t4_avenging_angel",
    name: "Avenging Angel",
    icon: "ability_paladin_judgementofthepure",
    maxRanks: 2,
    position: { x: 2.5, y: 4.5 },
    requires: "zl_t3_holy_avenger",
    spell: {
      name: "Avenging Angel",
      description: "Your sacrifice wings you on Sol's sacred fury. Sprout wings of light for 1 minute: gain flight speed equal to your movement and +2 to attack and damage rolls. Costs 3 Devotion.",
      flavorText: "The choir can see you now. Try to look justified.",
      source: "talent", class: "Martyr", treeId: "zealot",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 90, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { devotion: { baseAmount: 3 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      buffs: ["avenging-angel"], visualTheme: "sacred", tags: ["flight", "buff", "martyr"]
    },
    rankUpgrades: [
      { description: "Your sacrifice wings you on Sol's sacred fury. Sprout wings of light for 1 minute: gain flight, +3 to attack and damage rolls, and allies within 20 feet gain +1 to attack rolls. Costs 3 Devotion." }
    ]
  },

  {
    id: "zl_t5_final_judgment",
    name: "Final Judgment",
    icon: "spell_holy_divineintervention",
    maxRanks: 3,
    position: { x: 2, y: 5.5 },
    requires: "zl_t4_sword_of_justice",
    spell: {
      name: "Final Judgment",
      description: "Sol's final verdict extinguishes the unworthy. Execute a creature within 30 feet that has 25 or fewer health remaining: it dies instantly. Bosses take 5d10 sacred instead. Costs 4 Devotion.",
      flavorText: "Case closed. Gavel optional.",
      source: "talent", class: "Martyr", treeId: "zealot",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 30, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { devotion: { baseAmount: 4 } },
      damageTypes: ["sacred"],
      primaryDamage: { dice: "5d10", flat: 0, procChance: 100 },
      visualTheme: "sacred", tags: ["execute", "verdict", "martyr"]
    },
    rankUpgrades: [
      { description: "Sol's final verdict extinguishes the unworthy. Execute a creature within 30 feet at 50 or fewer health: it dies instantly. Bosses take 5d10 sacred instead. Costs 4 Devotion." },
      { description: "Sol's final verdict extinguishes the unworthy. Execute a creature within 60 feet at 50 or fewer health: it dies instantly and its allies are frightened for 1 round. Bosses take 5d10 sacred. Costs 4 Devotion.", primaryDamage: { dice: "5d10", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "zl_t5_sol_vengeance",
    name: "Sol Vengeance",
    icon: "spell_holy_blessedlife",
    maxRanks: 2,
    position: { x: 2.5, y: 5.5 },
    requires: "zl_t4_avenging_angel",
    spell: {
      name: "Sol Vengeance",
      description: "When allies fall, your grief ignites Sol's vengeful flame. For 2 rounds after an ally is reduced to 0 health, your attacks deal 2d6 additional sacred damage.",
      flavorText: "Grief, weaponized. Sol approves, quietly.",
      source: "talent", class: "Martyr", treeId: "zealot",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["sacred"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      visualTheme: "sacred", tags: ["passive", "revenge", "martyr"]
    },
    rankUpgrades: [
      { description: "When allies fall, your grief ignites Sol's vengeful flame. For 3 rounds after an ally is reduced to 0 health, your attacks deal 3d6 additional sacred damage and you gain +2 to attack rolls.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "zl_t6_apocalypse",
    name: "Apocalypse",
    icon: "spell_holy_sealofwrath",
    maxRanks: 1,
    position: { x: 1.5, y: 6.5 },
    requires: "zl_t5_final_judgment",
    spell: {
      name: "Apocalypse",
      description: "Your ultimate sacrifice calls forth Sol's consuming sacred fire. Unleash judgment in a 60-foot radius: all enemies take 8d6 sacred damage, and enemies reduced to 0 by it are destroyed — no death saves, no return. Costs all Devotion (minimum 4).",
      flavorText: "The dawn arrives early, and it is furious.",
      source: "talent", class: "Martyr", treeId: "zealot",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 60,
      castTimeType: "long", castTimeValue: 3,
      cooldownCategory: "long", cooldownValue: 180, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: false, interruptible: true,
      resourceCosts: { devotion: { baseAmount: 5 }, mana: { baseAmount: 25 } },
      damageTypes: ["sacred"],
      primaryDamage: { dice: "8d6", flat: 0, procChance: 100 },
      visualTheme: "sacred", tags: ["apocalypse", "aoe", "martyr"]
    }
  },
  {
    id: "zl_t6_zealous_heart",
    name: "Zealous Heart",
    icon: "spell_holy_unyieldingfaith",
    maxRanks: 2,
    position: { x: 2, y: 6.5 },
    requires: "zl_t5_sol_vengeance",
    spell: {
      name: "Zealous Heart",
      description: "Righteousness is a renewable resource. You gain 1 Devotion whenever you critically hit or reduce an enemy below half health.",
      flavorText: "Zion: the drum beats faster.",
      source: "talent", class: "Martyr", treeId: "zealot",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "resource", "martyr"]
    },
    rankUpgrades: [
      { description: "Righteousness is a renewable resource. You gain 1 Devotion whenever you critically hit or reduce an enemy below half health, and 2 Devotion on a killing blow." }
    ]
  },
  {
    id: "zl_t6_consecrated_blade",
    name: "Consecrated Blade",
    icon: "spell_holy_holysmite",
    maxRanks: 2,
    position: { x: 2.5, y: 6.5 },
    requires: "zl_t5_sol_vengeance",
    spell: {
      name: "Consecrated Blade",
      description: "Your smites leave consecrated wounds. Targets struck by your Wrathful Smite take an additional 1d6 sacred damage at the start of their turns for 2 turns.",
      flavorText: "The light checks in. Daily.",
      source: "talent", class: "Martyr", treeId: "zealot",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["sacred"],
      isDot: true, dotDuration: 2, dotTick: "1d6",
      visualTheme: "sacred", tags: ["passive", "dot", "smite", "martyr"]
    },
    rankUpgrades: [
      { description: "Your smites leave consecrated wounds. Targets struck by your Wrathful Smite take an additional 2d6 sacred damage at the start of their turns for 3 turns.", dotTick: "2d6", dotDuration: 3 }
    ]
  },

  {
    id: "zl_t7_sol_incarnate",
    name: "Sol Incarnate",
    icon: "spell_holy_avengingwrath",
    maxRanks: 1,
    position: { x: 0.5, y: 8 },
    requires: "zl_t6_apocalypse",
    spell: {
      name: "Sol Incarnate",
      description: "ULTIMATE: For 30 seconds you become the dawn given form. Your weapons are sheathed in solar fire (+3d8 sacred per strike), you gain flight, critical hits deal maximum damage, and each enemy that dies by your hand restores 2 Devotion to you. Costs all Devotion (minimum 5).",
      flavorText: "Do not look directly at the Martyr. Everyone looks anyway.",
      source: "talent", class: "Martyr", treeId: "zealot",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 300, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { devotion: { baseAmount: 6 }, mana: { baseAmount: 30 } },
      durationRounds: 5, durationRealTime: 30, durationUnit: "seconds",
      buffs: ["sol-incarnate"], damageTypes: ["sacred"],
      visualTheme: "sacred", tags: ["ultimate", "capstone", "transform", "martyr"]
    }
  },
  {
    id: "zl_t7_fervent_blade",
    name: "Fervent Blade",
    icon: "spell_holy_crusaderstrike",
    maxRanks: 5,
    position: { x: 1.5, y: 8 },
    requires: "zl_t6_zealous_heart",
    spell: {
      name: "Fervent Blade",
      description: "Practice sharpens faith. All sacred damage you deal is increased by 10%.",
      flavorText: "Drill makes the dawn brighter.",
      source: "talent", class: "Martyr", treeId: "zealot",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["sacred"],
      visualTheme: "sacred", tags: ["passive", "capstone", "damage", "martyr"]
    },
    rankUpgrades: [
      { description: "Practice sharpens faith. All sacred damage you deal is increased by 20%." },
      { description: "Practice sharpens faith. All sacred damage you deal is increased by 30%." },
      { description: "Practice sharpens faith. All sacred damage you deal is increased by 45%." },
      { description: "Practice sharpens faith. All sacred damage you deal is increased by 60%, and Crusader Strike costs no mana." }
    ]
  },
  {
    id: "zl_t7_righteous_host",
    name: "Righteous Host",
    icon: "spell_holy_prayerofspirit",
    maxRanks: 3,
    position: { x: 2, y: 8 },
    requires: "zl_t6_zealous_heart",
    spell: {
      name: "Righteous Host",
      description: "Your conviction spreads. While Avenging Angel is active, allies within 20 feet deal 10% more sacred damage.",
      flavorText: "Wings are contagious.",
      source: "talent", class: "Martyr", treeId: "zealot",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["sacred"],
      visualTheme: "sacred", tags: ["passive", "capstone", "aura", "ally", "martyr"]
    },
    rankUpgrades: [
      { description: "Your conviction spreads. While Avenging Angel is active, allies within 30 feet deal 20% more sacred damage." },
      { description: "Your conviction spreads. Avenging Angel's radius is 40 feet, and allies inside deal 20% more sacred damage and gain flight alongside you." }
    ]
  },
  {
    id: "zl_t7_last_rite",
    name: "Last Rite",
    icon: "spell_holy_divineintervention",
    maxRanks: 3,
    position: { x: 2.5, y: 8 },
    requires: "zl_t6_consecrated_blade",
    spell: {
      name: "Last Rite",
      description: "Your executes leave no ambiguity. Final Judgment's health threshold is increased by 10.",
      flavorText: "The paperwork was filed before the fight started.",
      source: "talent", class: "Martyr", treeId: "zealot",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["sacred"],
      visualTheme: "sacred", tags: ["passive", "capstone", "execute", "martyr"]
    },
    rankUpgrades: [
      { description: "Your executes leave no ambiguity. Final Judgment's health threshold is increased by 20." },
      { description: "Your executes leave no ambiguity. Final Judgment's threshold is increased by 35, and its Devotion cost drops to 3." }
    ]
  },
  {
    id: "zl_t7_morning_crusade",
    name: "Morning Crusade",
    icon: "spell_holy_righteousfury",
    maxRanks: 3,
    position: { x: 3.5, y: 8 },
    requires: "zl_t6_consecrated_blade",
    spell: {
      name: "Morning Crusade",
      description: "Judgment, delivered briskly. The cooldowns of your Zealot spells are reduced by 15%.",
      flavorText: "Justice before breakfast.",
      source: "talent", class: "Martyr", treeId: "zealot",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "capstone", "cooldown", "martyr"]
    },
    rankUpgrades: [
      { description: "Judgment, delivered briskly. The cooldowns of your Zealot spells are reduced by 30%." },
      { description: "Judgment, delivered briskly. The cooldowns of your Zealot spells are reduced by 45%." }
    ]
  }
];
