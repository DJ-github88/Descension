// ============================================
// LUNARCH — MOONWELL GUARDIAN (v2: talents are spells)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50.
// The well tree: moonwells, group healing, protective tides.
// ============================================

export const LUNARCH_MOONWELL_GUARDIAN = [
  {
    id: "mw_t1_lunar_healing",
    name: "Lunar Healing",
    icon: "spell_holy_renew",
    maxRanks: 3,
    position: { x: 0.5, y: 0 },
    requires: null,
    spell: {
      name: "Lunar Healing",
      description: "The Waxing Moon fills your hands. During Waxing Moon, your healing spells heal an additional 1d6.",
      flavorText: "The moon waxes so wounds wane.",
      source: "talent", class: "Lunarch", treeId: "moonwell-guardian",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "self",
      healing: { dice: "1d6", flat: 0 },
      visualTheme: "sacred", tags: ["passive", "waxing", "healing", "lunarch"]
    },
    rankUpgrades: [
      { description: "The Waxing Moon fills your hands. During Waxing Moon, your healing spells heal an additional 2d6." },
      { description: "The Waxing Moon fills your hands. During Waxing Moon your healing heals an additional 3d6; during New Moon it instead grants 5 temporary health.", healing: { dice: "3d6", flat: 0 } }
    ]
  },
  {
    id: "mw_t1_moonlight_heal",
    name: "Moonlight Heal",
    icon: "spell_holy_heal",
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    spell: {
      name: "Moonlight Heal",
      description: "Pour pale light into a wound. Heal an ally within 60 feet for 2d8 health.",
      flavorText: "Moonlight is just the sun being gentle about it.",
      source: "talent", class: "Lunarch", treeId: "moonwell-guardian",
      spellType: "ACTIVE", category: "healing",
      targetingMode: "single", rangeType: "ranged", range: 60,
      castTimeType: "short", castTimeValue: 1,
      cooldownCategory: "short", cooldownValue: 8, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 10 } },
      healing: { dice: "2d8", flat: 0 },
      visualTheme: "sacred", tags: ["healing", "core", "lunarch"]
    },
    rankUpgrades: [
      { description: "Pour pale light into a wound. Heal an ally within 60 feet for 4d8 health.", healing: { dice: "4d8", flat: 0 } },
      { description: "Pour pale light into a wound. Heal an ally within 60 feet for 6d8 health; during Waxing Moon the overflow becomes a lunar shield.", healing: { dice: "6d8", flat: 0 } }
    ]
  },
  {
    id: "mw_t1_lunar_blessing",
    name: "Lunar Blessing",
    icon: "spell_holy_blessingofstrength",
    maxRanks: 2,
    position: { x: 3.5, y: 0 },
    requires: null,
    spell: {
      name: "Lunar Blessing",
      description: "Bless an ally within 60 feet: they gain +1d6 to their next attack roll, save, or healing received.",
      flavorText: "Small benediction, generous fine print.",
      source: "talent", class: "Lunarch", treeId: "moonwell-guardian",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "single", rangeType: "ranged", range: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 10, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 6 } },
      buffs: ["blessed"], visualTheme: "sacred", tags: ["blessing", "utility", "lunarch"]
    },
    rankUpgrades: [
      { description: "Bless up to TWO allies within 60 feet: each gains +1d6 to their next attack roll, save, or healing received, and the blessing persists until used." }
    ]
  },

  {
    id: "mw_t2_moonwell_sanctuary",
    name: "Moonwell Sanctuary",
    icon: "spell_holy_circleofrenewal",
    maxRanks: 3,
    position: { x: 1, y: 1.5 },
    requires: "mw_t1_lunar_healing",
    spell: {
      name: "Moonwell Sanctuary",
      description: "Open a moonwell within 30 feet for 1 minute: allies within 20 feet of it regain 1d8 health at the start of their turns and gain +1 to saves.",
      flavorText: "A still pool that drinks back.",
      source: "talent", class: "Lunarch", treeId: "moonwell-guardian",
      spellType: "ACTIVE", category: "healing",
      targetingMode: "aoe", rangeType: "ranged", range: 30, aoeShape: "circle", aoeSize: 20,
      castTimeType: "short", castTimeValue: 1.5,
      cooldownCategory: "medium", cooldownValue: 30, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: true,
      resourceCosts: { mana: { baseAmount: 18 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      healing: { dice: "1d8", flat: 0, isHoT: true, hotDuration: 6, hotTick: "1d8" },
      buffs: ["moonwell"], visualTheme: "sacred", tags: ["well", "zone", "hot", "lunarch"]
    },
    rankUpgrades: [
      { description: "Open a moonwell within 30 feet for 1 minute: allies within 30 feet regain 2d8 health at the start of their turns and gain +1 to saves.", healing: { dice: "2d8", flat: 0, isHoT: true, hotDuration: 6, hotTick: "2d8" } },
      { description: "Open a moonwell within 60 feet for 1 minute: allies within 30 feet regain 3d8 health per turn, gain +2 to saves, and the well cleanses one poison per turn.", healing: { dice: "3d8", flat: 0, isHoT: true, hotDuration: 6, hotTick: "3d8" } }
    ]
  },
  {
    id: "mw_t2_protective_aura",
    name: "Protective Aura",
    icon: "spell_holy_devotionaura",
    maxRanks: 3,
    position: { x: 3, y: 1.5 },
    requires: "mw_t1_moonlight_heal",
    spell: {
      name: "Protective Aura",
      description: "Your moon-shadow shields the faithful. Allies within 10 feet gain +1 Durability Steps to equipped durability and resistance to blight damage.",
      flavorText: "Stand in the shade. It repairs.",
      source: "talent", class: "Lunarch", treeId: "moonwell-guardian",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["blight"],
      visualTheme: "sacred", tags: ["passive", "aura", "ally", "lunarch"]
    },
    rankUpgrades: [
      { description: "Your moon-shadow shields the faithful. Allies within 15 feet gain +1 Durability Steps to equipped durability and blight resistance; during Waxing Moon the durability bonus becomes +2." },
      { description: "Your moon-shadow shields the faithful. Allies within 20 feet gain +2 Durability Steps to equipped durability and blight resistance at all times, and +3 during Waxing Moon." }
    ]
  },

  {
    id: "mw_t3_lunar_shield",
    name: "Lunar Shield",
    icon: "spell_holy_powerwordshield",
    maxRanks: 3,
    position: { x: 1.5, y: 3 },
    requires: "mw_t2_moonwell_sanctuary",
    spell: {
      name: "Lunar Shield",
      description: "As a reaction when an ally within 30 feet takes damage, reduce it by 2d6.",
      flavorText: "The moon catches what it can.",
      source: "talent", class: "Lunarch", treeId: "moonwell-guardian",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "reaction", "shield", "lunarch"]
    },
    rankUpgrades: [
      { description: "As a reaction when an ally within 30 feet takes damage, reduce it by 3d6 and heal them for the amount reduced." },
      { description: "As a reaction when an ally within 60 feet takes damage, reduce it by 5d6, heal them for the reduction, and during Full Moon the reaction is free (usable twice per round)." }
    ]
  },
  {
    id: "mw_t3_mass_restoration",
    name: "Mass Restoration",
    icon: "spell_holy_prayerofhealing",
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: "mw_t2_protective_aura",
    spell: {
      name: "Mass Restoration",
      description: "Moonlight Heal washes over the whole company: heal ALL allies within 30 feet for 2d6 each.",
      flavorText: "One tide, everyone's shore.",
      source: "talent", class: "Lunarch", treeId: "moonwell-guardian",
      spellType: "ACTIVE", category: "healing",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 30,
      castTimeType: "short", castTimeValue: 1.5,
      cooldownCategory: "medium", cooldownValue: 18, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: false, interruptible: true,
      resourceCosts: { mana: { baseAmount: 16 } },
      healing: { dice: "2d6", flat: 0 },
      visualTheme: "sacred", tags: ["healing", "aoe", "lunarch"]
    },
    rankUpgrades: [
      { description: "Moonlight Heal washes over the whole company: heal ALL allies within 30 feet for 3d6 each; during Waxing Moon it also removes one curse, disease, or poison per ally.", healing: { dice: "3d6", flat: 0 } },
      { description: "Moonlight Heal washes over the whole company: heal ALL allies within 40 feet for 4d6 each, cleansing one curse, disease, or poison per ally regardless of phase.", healing: { dice: "4d6", flat: 0 } }
    ]
  },

  {
    id: "mw_t4_lunar_resurgence",
    name: "Lunar Resurgence",
    icon: "spell_holy_layonhands",
    maxRanks: 3,
    position: { x: 1.5, y: 4.5 },
    requires: "mw_t3_lunar_shield",
    spell: {
      name: "Lunar Resurgence",
      description: "Overflowing light hardens into durability. When your healing exceeds a target's missing health, the excess becomes a lunar barrier absorbing the next 2d6 damage.",
      flavorText: "Aedris the First-Lit casts a pale shadow on this power.",
      source: "talent", class: "Lunarch", treeId: "moonwell-guardian",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "overflow", "shield", "lunarch"]
    },
    rankUpgrades: [
      { description: "Overflowing light hardens into durability. Healing overflow becomes a lunar barrier absorbing 4d6 damage." },
      { description: "Overflowing light hardens into durability. Healing overflow becomes a barrier absorbing 6d6, and barriers reflect 10% of absorbed damage as sacred.", damageTypes: ["sacred"] }
    ]
  },
  {
    id: "mw_t4_celestial_guardian",
    name: "Celestial Guardian",
    icon: "spell_holy_holyprotection",
    maxRanks: 2,
    position: { x: 2.5, y: 4.5 },
    requires: "mw_t3_mass_restoration",
    spell: {
      name: "Celestial Guardian",
      description: "Once per turn when an ally within 60 feet would be reduced to 0 health, they are instead stabilized and healed for 3d6.",
      flavorText: "The moon refuses to sign the paperwork.",
      source: "talent", class: "Lunarch", treeId: "moonwell-guardian",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "self",
      healing: { dice: "3d6", flat: 0 },
      visualTheme: "sacred", tags: ["passive", "save", "ally", "lunarch"]
    },
    rankUpgrades: [
      { description: "Once per turn when an ally within 60 feet would be reduced to 0 health, they are instead healed to 5 health + 3d6 and gain a lunar barrier.", healing: { dice: "3d6", flat: 5 } }
    ]
  },

  {
    id: "mw_t5_eternal_moonwell",
    name: "Eternal Moonwell",
    icon: "spell_holy_divineprovidence",
    maxRanks: 3,
    position: { x: 2, y: 6 },
    requires: "mw_t4_lunar_resurgence",
    spell: {
      name: "Eternal Moonwell",
      description: "Your moonwell becomes a permanent fixture of the land: allies within 30 feet of it cannot be frightened or charmed, and the well persists until you dismiss it or create another.",
      flavorText: "Wells outlive their diggers. This one plans to.",
      source: "talent", class: "Lunarch", treeId: "moonwell-guardian",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "well", "permanence", "lunarch"]
    },
    rankUpgrades: [
      { description: "Your moonwell becomes permanent: allies within 30 feet cannot be frightened or charmed, and enemies entering the radius are slowed by 10 feet." },
      { description: "Your moonwell becomes permanent and jealous: allies within are immune to fear and charm, enemies are slowed 15 feet, and undead inside take 2d6 sacred damage per turn.", damageTypes: ["sacred"], primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "mw_t5_tidal_mend",
    name: "Tidal Mend",
    icon: "spell_nature_healingtouch",
    maxRanks: 2,
    position: { x: 2.5, y: 6 },
    requires: "mw_t4_celestial_guardian",
    spell: {
      name: "Tidal Mend",
      description: "Healing flows like water, finding every crack. Your single-target heals jump to the nearest other wounded ally within 15 feet at 50% potency.",
      flavorText: "Light behaves like liquid in your hands.",
      source: "talent", class: "Lunarch", treeId: "moonwell-guardian",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "cleave", "healing", "lunarch"]
    },
    rankUpgrades: [
      { description: "Healing flows like water, finding every crack. Your single-target heals jump to the two nearest wounded allies within 20 feet at 60% potency." }
    ]
  },

  {
    id: "mw_t6_lunar_apotheosis",
    name: "Lunar Apotheosis",
    icon: "spell_holy_resurrection",
    maxRanks: 1,
    position: { x: 1.5, y: 5.5 },
    requires: "mw_t5_eternal_moonwell",
    spell: {
      name: "Lunar Apotheosis",
      description: "Open a massive moonwell for 1 minute: all allies within 40 feet regain 4d6 health at the start of their turns and are immune to blight damage. Costs 12 mana.",
      flavorText: "The well becomes a lake. The lake becomes a promise.",
      source: "talent", class: "Lunarch", treeId: "moonwell-guardian",
      spellType: "ACTIVE", category: "healing",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 40,
      castTimeType: "long", castTimeValue: 3,
      cooldownCategory: "long", cooldownValue: 120, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: false, interruptible: true,
      resourceCosts: { mana: { baseAmount: 12 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      healing: { dice: "4d6", flat: 0, isHoT: true, hotDuration: 6, hotTick: "4d6" },
      buffs: ["apotheosis"], damageTypes: ["blight"],
      visualTheme: "sacred", tags: ["well", "massive", "lunarch"]
    }
  },
  {
    id: "mw_t6_waning_grace",
    name: "Waning Grace",
    icon: "spell_holy_renew",
    maxRanks: 2,
    position: { x: 2, y: 6.5 },
    requires: "mw_t5_eternal_moonwell",
    spell: {
      name: "Waning Grace",
      description: "The fading moon teaches release. During Waning Moon, your healing spells cost 25% less mana.",
      flavorText: "Less light, lighter touch, smaller bill.",
      source: "talent", class: "Lunarch", treeId: "moonwell-guardian",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "waning", "cost", "lunarch"]
    },
    rankUpgrades: [
      { description: "The fading moon teaches release. During Waning Moon, your healing spells cost 50% less mana and gain +5 feet range per spell level." }
    ]
  },
  {
    id: "mw_t6_wellspring_tide",
    name: "Wellspring Tide",
    icon: "spell_frost_frost",
    maxRanks: 2,
    position: { x: 2.5, y: 5.5 },
    requires: "mw_t5_tidal_mend",
    spell: {
      name: "Wellspring Tide",
      description: "Your moonwell exhales each round: allies who start their turn within it regain 2 mana.",
      flavorText: "The well pays dividends in drinkable light.",
      source: "talent", class: "Lunarch", treeId: "moonwell-guardian",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "well", "mana", "lunarch"]
    },
    rankUpgrades: [
      { description: "Your moonwell exhales each round: allies who start their turn within it regain 4 mana and 1d4 temporary health." }
    ]
  },

  {
    id: "mw_t7_aedris_well",
    name: "Aedris' Well",
    icon: "spell_holy_resurrection",
    maxRanks: 1,
    position: { x: 0.5, y: 8 },
    requires: "mw_t6_lunar_apotheosis",
    spell: {
      name: "Aedris' Well",
      description: "ULTIMATE: Open the First-Lit's own well for 1 minute: a 60-foot zone where allies regain 5d8 health per turn, are immune to fear, charm, and blight, and one downed ally per round is automatically revived at half health. The well's water can be drawn once during its duration to restore all allies' mana by 25.",
      flavorText: "There is a well older than the moon. Aedris dug it.",
      source: "talent", class: "Lunarch", treeId: "moonwell-guardian",
      spellType: "ACTIVE", category: "healing",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 60,
      castTimeType: "long", castTimeValue: 3,
      cooldownCategory: "long", cooldownValue: 300, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: false, interruptible: true,
      resourceCosts: { mana: { baseAmount: 30 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      healing: { dice: "5d8", flat: 0, isHoT: true, hotDuration: 6, hotTick: "5d8" },
      buffs: ["aedris-well"], visualTheme: "sacred", tags: ["ultimate", "capstone", "well", "revive", "lunarch"]
    }
  },
  {
    id: "mw_t7_deep_tides",
    name: "Deep Tides",
    icon: "spell_nature_healingwave",
    maxRanks: 5,
    position: { x: 1.5, y: 8 },
    requires: "mw_t6_waning_grace",
    spell: {
      name: "Deep Tides",
      description: "The tide runs deeper than any single shore. All healing you do is increased by 10%.",
      flavorText: "Depth first. Breadth follows.",
      source: "talent", class: "Lunarch", treeId: "moonwell-guardian",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "capstone", "healing", "lunarch"]
    },
    rankUpgrades: [
      { description: "The tide runs deeper than any single shore. All healing you do is increased by 20%." },
      { description: "The tide runs deeper than any single shore. All healing you do is increased by 30%." },
      { description: "The tide runs deeper than any single shore. All healing you do is increased by 45%." },
      { description: "The tide runs deeper than any single shore. All healing you do is increased by 60%, and Moonlight Heal costs half mana during Waxing Moon." }
    ]
  },
  {
    id: "mw_t7_moonpooled",
    name: "Moonpooled",
    icon: "spell_frost_stun",
    maxRanks: 3,
    position: { x: 3, y: 8 },
    requires: "mw_t6_waning_grace",
    spell: {
      name: "Moonpooled",
      description: "You carry a moonwell in your chest. Your Moonwell Sanctuary radius increases by 10 feet.",
      flavorText: "Property of the tide. Always.",
      source: "talent", class: "Lunarch", treeId: "moonwell-guardian",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "capstone", "well", "lunarch"]
    },
    rankUpgrades: [
      { description: "You carry a moonwell in your chest. Moonwell Sanctuary's radius increases by 20 feet and its duration by 1 minute." },
      { description: "You carry a moonwell in your chest. Moonwell radius +20 feet, duration +1 minute, and you may maintain two wells simultaneously." }
    ]
  },
  {
    id: "mw_t7_tidebound_guardian",
    name: "Tidebound Guardian",
    icon: "spell_holy_powerwordbarrier",
    maxRanks: 3,
    position: { x: 3.5, y: 8 },
    requires: "mw_t6_wellspring_tide",
    spell: {
      name: "Tidebound Guardian",
      description: "The tide repays its guardian. Whenever an ally is healed by your moonwell, you regain 2 health.",
      flavorText: "The keeper drinks from the rim.",
      source: "talent", class: "Lunarch", treeId: "moonwell-guardian",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "self",
      healing: { dice: null, flat: 2 },
      visualTheme: "sacred", tags: ["passive", "capstone", "synergy", "lunarch"]
    },
    rankUpgrades: [
      { description: "The tide repays its guardian. Whenever an ally is healed by your moonwell, you regain 4 health and 1 mana.", healing: { dice: null, flat: 4 } },
      { description: "The tide repays its guardian. Moonwell heals restore 6 health and 2 mana to you, and while your well stands you gain +2 Durability Steps to equipped durability.", healing: { dice: null, flat: 6 } }
    ]
  },
  {
    id: "mw_t7_phase_weaver",
    name: "Phase Weaver",
    icon: "spell_nature_moonglow",
    maxRanks: 3,
    position: { x: 2, y: 7.5 },
    requires: "mw_t6_wellspring_tide",
    spell: {
      name: "Phase Weaver",
      description: "You learned to hurry the moon along. Once per short rest, advance your Lunar Phase by one step as a free action.",
      flavorText: "The clock is lunar. You know where the gears are.",
      source: "talent", class: "Lunarch", treeId: "moonwell-guardian",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 60, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { mana: { baseAmount: 5 } },
      visualTheme: "sacred", tags: ["phase", "control", "utility", "lunarch"]
    },
    rankUpgrades: [
      { description: "You learned to hurry the moon along. Advance your Lunar Phase one step as a free action, twice per short rest." },
      { description: "You learned to hurry the moon along. Advance your phase as a free action at will (10-second internal cooldown), and each advance restores 3 mana." }
    ]
  }
];
