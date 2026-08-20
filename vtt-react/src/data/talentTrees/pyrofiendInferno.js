// ============================================
// PYROFIEND — INFERNO (v2: talents are spells)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50.
// Resource: Inferno Veil (Inferno Level 0-9). Ascend for power; the Veil burns back.
// Damage type: ember. The Demon's Bargain: at Level 9, the death clock ticks.
// ============================================

export const PYROFIEND_INFERNO = [
  {
    id: "inf_t1_burst_mastery",
    name: "Burst Mastery",
    icon: "spell_fire_fireball02",
    maxRanks: 3,
    position: { x: 1, y: 8 },
    requires: null,
    spell: {
      name: "Burst Mastery",
      description: "The fury of Emberspire extends your reach through the Abyss. Your ember spells have +5 feet range.",
      flavorText: "The furnace does not need to be close. It needs to be felt.",
      source: "talent", class: "Pyrofiend", treeId: "inferno",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "fire", tags: ["passive", "range", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "The fury of Emberspire extends your reach through the Abyss. Your ember spells have +10 feet range." },
      { description: "The fury of Emberspire extends your reach through the Abyss. Your ember spells have +15 feet range and ignore half cover." }
    ]
  },
  {
    id: "inf_t1_rapid_ascent",
    name: "Rapid Ascent",
    icon: "spell_fire_soulburn",
    maxRanks: 3,
    position: { x: 2, y: 8 },
    requires: null,
    spell: {
      name: "Rapid Ascent",
      description: "The horror within grants command over the ascent. Spend 1 Action Point to reduce your Inferno Level by 1.",
      flavorText: "Climbing down the mountain of fire, one deliberate step.",
      source: "talent", class: "Pyrofiend", treeId: "inferno",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 5, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { mana: { baseAmount: 3 } },
      visualTheme: "fire", tags: ["descent", "control", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "The horror within grants command over the ascent. Spend 1 Action Point to reduce your Inferno Level by 1d3." },
      { description: "The horror within grants command over the ascent. Spend 1 Action Point to reduce your Inferno Level by 1d4." }
    ]
  },
  {
    id: "inf_t1_inner_fire",
    name: "Inner Fire",
    icon: "spell_fire_flamebolt",
    maxRanks: 2,
    position: { x: 3, y: 8 },
    requires: null,
    spell: {
      name: "Inner Fire",
      description: "The heart of Emberspire beats within you, making you one with the flame. You have resistance to ember damage.",
      flavorText: "You stopped flinching at heat years ago. Heat started flinching at you.",
      source: "talent", class: "Pyrofiend", treeId: "inferno",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["ember"],
      visualTheme: "fire", tags: ["passive", "resistance", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "The heart of Emberspire beats within you, making you one with the flame. You have resistance to ember damage and take 2 less damage from Inferno drawbacks." }
    ]
  },

  {
    id: "inf_t2_critical_blast",
    name: "Critical Blast",
    icon: "spell_fire_incinerate",
    maxRanks: 3,
    position: { x: 1.5, y: 6.5 },
    requires: "inf_t1_burst_mastery",
    spell: {
      name: "Critical Blast",
      description: "Abyssal fire turns pain into power. Once per round, when you take ember damage, your next ember spell deals 2 additional ember damage and can be cast as a reaction.",
      flavorText: "Hit me again. I insist.",
      source: "talent", class: "Pyrofiend", treeId: "inferno",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["ember"],
      visualTheme: "fire", tags: ["passive", "reaction", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "Abyssal fire turns pain into power. Once per round, when you take ember damage, your next ember spell deals 4 additional ember damage and can be cast as a reaction." },
      { description: "Abyssal fire turns pain into power. When you take ember damage, your next ember spell deals 4 additional ember damage, can be cast as a reaction, and ascends you 1 Inferno Level." }
    ]
  },
  {
    id: "inf_t2_detonation",
    name: "Detonation",
    icon: "spell_fire_selfdestruct",
    maxRanks: 3,
    position: { x: 2.5, y: 6.5 },
    requires: "inf_t1_rapid_ascent",
    spell: {
      name: "Detonation",
      description: "The Abyss grants motion through flame. Spend 1 Action Point: teleport 15 feet to an unoccupied space within or adjacent to fire terrain.",
      flavorText: "You do not walk through fire. You commute.",
      source: "talent", class: "Pyrofiend", treeId: "inferno",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "self", rangeType: "self", range: 15,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 8, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { mana: { baseAmount: 5 } },
      visualTheme: "fire", tags: ["mobility", "teleport", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "The Abyss grants motion through flame. Spend 1 Action Point: teleport 20 feet to an unoccupied space within or adjacent to fire terrain, dealing 1d6 ember damage to enemies you pass through." },
      { description: "The Abyss grants motion through flame. Spend 1 Action Point: teleport 25 feet to any unoccupied space you can see, dealing 2d6 ember damage to enemies within 5 feet of both endpoints.", damageTypes: ["ember"], primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "inf_t3_fiery_resurgence",
    name: "Fiery Resurgence",
    icon: "spell_fire_fire",
    maxRanks: 3,
    position: { x: 1.5, y: 5 },
    requires: "inf_t2_critical_blast",
    spell: {
      name: "Fiery Resurgence",
      description: "Your will ignites the ground beneath your enemies. Spend 1 Action Point: create a 5-foot-radius zone of ember terrain within 60 feet that lasts 1 minute. Enemies that enter take 1d4 ember damage.",
      flavorText: "Zoning permit granted by Emberspire.",
      source: "talent", class: "Pyrofiend", treeId: "inferno",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "ranged", range: 60, aoeShape: "circle", aoeSize: 5,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 10, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 8 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      damageTypes: ["ember"],
      primaryDamage: { dice: "1d4", flat: 0, procChance: 100 },
      debuffs: ["fire-terrain"], visualTheme: "fire", tags: ["terrain", "zone", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "Your will ignites the ground beneath your enemies. Spend 1 Action Point: create a 10-foot-radius zone of ember terrain within 60 feet that lasts 1 minute. Enemies that enter take 1d4 ember damage." },
      { description: "Your will ignites the ground beneath your enemies. Spend 1 Action Point: create a 15-foot-radius zone of ember terrain within 60 feet that lasts 1 minute. Enemies that enter take 1d6 ember damage.", primaryDamage: { dice: "1d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "inf_t3_immolation",
    name: "Immolation",
    icon: "spell_fire_sealoffire",
    maxRanks: 3,
    position: { x: 3, y: 5 },
    requires: "inf_t2_detonation",
    spell: {
      name: "Immolation",
      description: "Your Wyrd-touched aura sears the air itself. Enemies within 5 feet take 3 ember damage at the start of your turn.",
      flavorText: "Personal space, enforced thermally.",
      source: "talent", class: "Pyrofiend", treeId: "inferno",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["ember"],
      visualTheme: "fire", tags: ["passive", "aura", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "Your Wyrd-touched aura sears the air itself. Enemies within 5 feet take 6 ember damage at the start of your turn." },
      { description: "Your Wyrd-touched aura sears the air itself. Enemies within 10 feet take 9 ember damage at the start of your turn." }
    ]
  },

  {
    id: "inf_t4_overcharge",
    name: "Overcharge",
    icon: "spell_fire_moltenblood",
    maxRanks: 3,
    position: { x: 1.5, y: 3.5 },
    requires: "inf_t3_fiery_resurgence",
    spell: {
      name: "Overcharge",
      description: "Each burst of pain births a greater retort. When you take ember damage, you may deal 1d6 ember damage to one creature within 30 feet.",
      flavorText: "Pain, forwarded.",
      source: "talent", class: "Pyrofiend", treeId: "inferno",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["ember"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "fire", tags: ["passive", "retaliation", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "Each burst of pain births a greater retort. When you take ember damage, you may deal 1d8 ember damage to one creature within 30 feet.", primaryDamage: { dice: "1d8", flat: 0, procChance: 100 } },
      { description: "Each burst of pain births a greater retort. When you take ember damage, you may deal 1d10 ember damage to one creature within 30 feet.", primaryDamage: { dice: "1d10", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "inf_t4_ascended_burst",
    name: "Ascended Burst",
    icon: "spell_fire_fireball",
    maxRanks: 2,
    position: { x: 2.5, y: 3.5 },
    requires: "inf_t3_immolation",
    spell: {
      name: "Ascended Burst",
      description: "The core of Emberspire erupts through you, a star of Abyssal brilliance. Create a 20-foot-radius zone of blazing light centered on you for 1 minute: enemies inside have disadvantage on attack rolls.",
      flavorText: "A dying star, rented for the evening.",
      source: "talent", class: "Pyrofiend", treeId: "inferno",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 20,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 45, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { mana: { baseAmount: 15 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      debuffs: ["blinded-zone"], visualTheme: "fire", tags: ["zone", "control", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "The core of Emberspire erupts through you, a star of Abyssal brilliance. Create a 30-foot-radius zone of blazing light centered on you for 1 minute: enemies inside have disadvantage on attack rolls, you have advantage against them, and enemies entering take 2d6 sacred damage.", damageTypes: ["sacred"], primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "inf_t5_maximum_power",
    name: "Maximum Power",
    icon: "spell_fire_twilightfireward",
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: "inf_t4_overcharge",
    spell: {
      name: "Maximum Power",
      description: "The deeper you fall into the Inferno, the farther your flames reach. At Inferno Level 8 or higher, your ember spells have their range doubled.",
      flavorText: "At the bottom of the mountain, everything is downhill.",
      source: "talent", class: "Pyrofiend", treeId: "inferno",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "fire", tags: ["passive", "range", "scaling", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "The deeper you fall into the Inferno, the farther your flames reach. At Inferno Level 7 or higher, your ember spells have their range doubled and ignore half cover." },
      { description: "The deeper you fall into the Inferno, the farther your flames reach. At Inferno Level 6 or higher, your ember spells have their range doubled and ignore all cover." }
    ]
  },
  {
    id: "inf_t5_power_surge",
    name: "Power Surge",
    icon: "spell_fire_burnout",
    maxRanks: 2,
    position: { x: 2.5, y: 2 },
    requires: "inf_t4_ascended_burst",
    spell: {
      name: "Power Surge",
      description: "Each notch of the Inferno fuels your Wyrd-touched might to bursting. After you spend 3 or more Inferno Levels in one turn, gain advantage on all attack rolls for 1 round.",
      flavorText: "Spending power generates power. The Abyss loves circular logic.",
      source: "talent", class: "Pyrofiend", treeId: "inferno",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "fire", tags: ["passive", "surge", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "Each notch of the Inferno fuels your Wyrd-touched might to bursting. After you spend 2 or more Inferno Levels in one turn, gain advantage on all attack rolls for 1 round and regain 1 Action Point." }
    ]
  },

  {
    id: "inf_t6_heat_death",
    name: "Heat Death",
    icon: "spell_fire_meteorstorm",
    maxRanks: 1,
    position: { x: 1.5, y: 1 },
    requires: "inf_t5_maximum_power",
    spell: {
      name: "Heat Death",
      description: "Every soul consumed by your hellfire feeds the Emberspire within. When an enemy dies from your ember damage, ascend 1 Inferno Level if below Level 8; otherwise restore 8 health.",
      flavorText: "Ash is just unclaimed currency.",
      source: "talent", class: "Pyrofiend", treeId: "inferno",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["ember"],
      visualTheme: "fire", tags: ["kill", "engine", "pyrofiend"]
    }
  },
  {
    id: "inf_t6_critical_cascade",
    name: "Critical Cascade",
    icon: "spell_fire_flare",
    maxRanks: 2,
    position: { x: 2, y: 1 },
    requires: "inf_t5_maximum_power",
    spell: {
      name: "Critical Cascade",
      description: "Your Abyssal fire finds the cracks in all things. When you score a critical hit with an ember spell, gain 1 Action Point.",
      flavorText: "Cracks in everything. That is how the light gets burn.",
      source: "talent", class: "Pyrofiend", treeId: "inferno",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["ember"],
      visualTheme: "fire", tags: ["passive", "crit", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "Your Abyssal fire finds the cracks in all things. When you score a critical hit with an ember spell, gain 1 Action Point and halve your Inferno drawback self-damage for 1 round." }
    ]
  },
  {
    id: "inf_t6_permanent_inferno",
    name: "Permanent Inferno",
    icon: "spell_fire_moltenblood",
    maxRanks: 2,
    position: { x: 3, y: 1 },
    requires: "inf_t5_power_surge",
    spell: {
      name: "Permanent Inferno",
      description: "The Inferno becomes your permanent throne. You can no longer descend below Inferno Level 3.",
      flavorText: "The mountain keeps a room for you. It is on fire. That is the amenity.",
      source: "talent", class: "Pyrofiend", treeId: "inferno",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "fire", tags: ["passive", "floor", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "The Inferno becomes your permanent throne. You can no longer descend below Inferno Level 3, and at Inferno Level 9 all your attacks deal +1d12 ember damage.", damageTypes: ["ember"], primaryDamage: { dice: "1d12", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "inf_t7_supernova",
    name: "Supernova",
    icon: "spell_fire_soulburn",
    maxRanks: 1,
    position: { x: 0, y: 0 },
    requires: "inf_t6_heat_death",
    spell: {
      name: "Supernova",
      description: "ULTIMATE: The final gift of Emberspire — a dying star born of pure Abyssal fury. Consume ALL your Inferno Levels to birth a star in a 50-foot radius for 3 rounds. Enemies take 8d12 ember damage at the start of each of their turns while it burns.",
      flavorText: "Every star dies. This one takes requests.",
      source: "talent", class: "Pyrofiend", treeId: "inferno",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 50,
      castTimeType: "short", castTimeValue: 2,
      cooldownCategory: "long", cooldownValue: 180, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: false, interruptible: true,
      resourceCosts: { mana: { baseAmount: 30 } },
      durationRounds: 3, durationRealTime: 18, durationUnit: "seconds",
      damageTypes: ["ember"],
      primaryDamage: { dice: "8d12", flat: 0, procChance: 100 },
      isDot: true, dotDuration: 3, dotTick: "8d12",
      visualTheme: "fire", tags: ["ultimate", "capstone", "aoe", "pyrofiend"]
    }
  },
  {
    id: "inf_t7_abyssal_furnace",
    name: "Abyssal Furnace",
    icon: "spell_fire_fire",
    maxRanks: 5,
    position: { x: 1, y: 0 },
    requires: "inf_t6_critical_cascade",
    spell: {
      name: "Abyssal Furnace",
      description: "The furnace inside you runs hotter than spec. All ember damage you deal is increased by 5%.",
      flavorText: "Warranty void. Power increased.",
      source: "talent", class: "Pyrofiend", treeId: "inferno",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["ember"],
      visualTheme: "fire", tags: ["passive", "capstone", "damage", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "The furnace inside you runs hotter than spec. All ember damage you deal is increased by 10%." },
      { description: "The furnace inside you runs hotter than spec. All ember damage you deal is increased by 15%." },
      { description: "The furnace inside you runs hotter than spec. All ember damage you deal is increased by 20%." },
      { description: "The furnace inside you runs hotter than spec. All ember damage you deal is increased by 25%." }
    ]
  },
  {
    id: "inf_t7_veil_bargain",
    name: "Bargainer's Terms",
    icon: "spell_shadow_shadowwordpain",
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: "inf_t6_critical_cascade",
    spell: {
      name: "Bargainer's Terms",
      description: "You have read the fine print of the Veil. Inferno drawback self-damage is reduced by 2.",
      flavorText: "Clause 9, subsection b: the burning is negotiable.",
      source: "talent", class: "Pyrofiend", treeId: "inferno",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "fire", tags: ["passive", "capstone", "drawback", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "You have read the fine print of the Veil. Inferno drawback self-damage is reduced by 4." },
      { description: "You have read the fine print of the Veil. Inferno drawback self-damage is reduced by 6, and the Demon's Bargain death clock at Inferno Level 9 ticks every other round instead of every round." }
    ]
  },
  {
    id: "inf_t7_star_touched",
    name: "Star-Touched",
    icon: "spell_fire_twilightfireward",
    maxRanks: 3,
    position: { x: 3, y: 0 },
    requires: "inf_t6_permanent_inferno",
    spell: {
      name: "Star-Touched",
      description: "Dying starlight answers to family. All ember spells cost 2 less mana (minimum 1).",
      flavorText: "Stellar discount. Family rate.",
      source: "talent", class: "Pyrofiend", treeId: "inferno",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "fire", tags: ["passive", "capstone", "cost", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "Dying starlight answers to family. All ember spells cost 4 less mana (minimum 1)." },
      { description: "Dying starlight answers to family. All ember spells cost 6 less mana (minimum 1) and their cooldowns are reduced by 15%." }
    ]
  },
  {
    id: "inf_t7_blazing_ascent",
    name: "Blazing Ascent",
    icon: "spell_fire_elementaldevastation",
    maxRanks: 3,
    position: { x: 4, y: 0 },
    requires: "inf_t6_permanent_inferno",
    spell: {
      name: "Blazing Ascent",
      description: "You climb the Inferno faster than it burns you. All sources that ascend your Inferno Level grant 1 additional level (this cannot exceed Level 9).",
      flavorText: "Two steps up, one step charred.",
      source: "talent", class: "Pyrofiend", treeId: "inferno",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "fire", tags: ["passive", "capstone", "ascent", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "You climb the Inferno faster than it burns you. All sources that ascend your Inferno Level grant 1 additional level (cannot exceed 9), and reaching a new level restores 3 health." },
      { description: "You climb the Inferno faster than it burns you. All sources that ascend your Inferno Level grant 1 additional level (cannot exceed 9), and reaching a new level restores 3 health and 5 mana." }
    ]
  }
];
