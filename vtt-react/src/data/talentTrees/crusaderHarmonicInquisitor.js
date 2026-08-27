// ============================================
// CRUSADER — HARMONIC INQUISITOR (v2: talents are spells)
// Spec: Aex Resonance, Anti-Caster Interrupts, Starlight Lightning, Ranged Chakrams
// Resource: Radiant Fervor (0-100)
// ============================================

export const CRUSADER_HARMONIC_INQUISITOR = [
  // ─── TIER 1 (y: 0) ───
  {
    id: "chi_t1_discordant_strike",
    name: "Discordant Reprimand",
    icon: "spell_holy_dispelmagic",
    maxRanks: 3,
    position: { x: 0.5, y: 0 },
    requires: null,
    spell: {
      name: "Discordant Reprimand",
      description: "Passive: Your melee strikes disrupt magical weaves. Hitting a creature concentrating on a spell forces a Constitution check with Disadvantage, and dealing damage to spellcasters generates +5 bonus Radiant Fervor.",
      flavorText: "Aex's song is the true chord. All else is noise to be struck down.",
      source: "talent", class: "Crusader", treeId: "harmonic_inquisitor",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self",
      visualTheme: "holy", tags: ["passive", "anti-magic", "concentration-break", "crusader"]
    },
    rankUpgrades: [
      { description: "Concentration-breaking damage deals +1d8 sacred bonus damage, and Fervor generation increases to +8.", primaryDamage: { dice: "1d8", flat: 0, procChance: 100 } },
      { description: "Breaking enemy concentration Stuns the target for 1 round and immediately refunds 1 Action Point." }
    ]
  },
  {
    id: "chi_t1_chakram_throw",
    name: "Chakram of Aex",
    icon: "ability_glaivetoss",
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    spell: {
      name: "Chakram of Aex",
      description: "Spend 2 AP: Hurl a spinning disc of crystallized starlight down a 30 ft line dealing 2d8 sacred + 1d6 storm damage to all enemies, then returning to your hand.",
      flavorText: "It carves the air in geometric perfection before returning home.",
      source: "talent", class: "Crusader", treeId: "harmonic_inquisitor",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 2, targetingMode: "line", rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 1, cooldownUnit: "round",
      damageTypes: ["sacred", "storm"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      secondaryDamage: { dice: "1d6", flat: 0, procChance: 100, damageType: "storm" },
      visualTheme: "holy", tags: ["ranged", "line", "chakram", "builder", "crusader"]
    },
    rankUpgrades: [
      { description: "Damage increases to 3d8 sacred + 2d6 storm, and range extends to 40 ft.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 }, secondaryDamage: { dice: "2d6", flat: 0, procChance: 100, damageType: "storm" } },
      { description: "Damage increases to 4d8 sacred + 3d6 storm; enemies hit have their spell ranges reduced by 50% for 1 round.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 }, secondaryDamage: { dice: "3d6", flat: 0, procChance: 100, damageType: "storm" } }
    ]
  },
  {
    id: "chi_t1_starlight_tuning",
    name: "Starlight Tuning",
    icon: "spell_holy_blessingofwisdom",
    maxRanks: 2,
    position: { x: 3.5, y: 0 },
    requires: null,
    spell: {
      name: "Starlight Tuning",
      description: "Passive: Gain +2 to Initiative and +2 to saving throws against spells and magical effects.",
      flavorText: "Listen for the cadence. Act between the incantations.",
      source: "talent", class: "Crusader", treeId: "harmonic_inquisitor",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "holy", tags: ["passive", "initiative", "spell-save", "crusader"]
    },
    rankUpgrades: [
      { description: "Bonuses increase to +4 Initiative and +4 to saving throws against spells and magical effects." }
    ]
  },

  // ─── TIER 2 (y: 1) ───
  {
    id: "chi_t2_spell_reprimand",
    name: "Starlight Bolt Reprimand",
    icon: "spell_holy_pureofheart",
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: "chi_t1_discordant_strike",
    spell: {
      name: "Starlight Bolt Reprimand",
      description: "REACTION — Spend 1 AP & 20 Fervor: When an enemy within 30 ft begins casting a spell, call down a descending bolt of starlight lightning dealing 3d6 sacred + 2d6 storm damage and forcing a CON Save or the spell is counter-spelled.",
      flavorText: "Silence falls faster than the word can leave their throat.",
      source: "talent", class: "Crusader", treeId: "harmonic_inquisitor",
      spellType: "REACTION", category: "damage",
      actionPoints: 1, targetingMode: "single", rangeType: "ranged", range: 30,
      castTimeType: "reaction", castTimeValue: 1,
      cooldownValue: 2, cooldownUnit: "round",
      damageTypes: ["sacred", "storm"],
      primaryDamage: { dice: "3d6", flat: 0, procChance: 100 },
      secondaryDamage: { dice: "2d6", flat: 0, procChance: 100, damageType: "storm" },
      visualTheme: "holy", tags: ["reaction", "interrupt", "counterspell", "crusader"]
    },
    rankUpgrades: [
      { description: "Damage increases to 4d6 sacred + 3d6 storm; successful counters refund 100% of Fervor spent.", primaryDamage: { dice: "4d6", flat: 0, procChance: 100 }, secondaryDamage: { dice: "3d6", flat: 0, procChance: 100, damageType: "storm" } },
      { description: "Damage increases to 5d6 sacred + 4d6 storm; counter-spelling also Stuns the target for 1 round.", primaryDamage: { dice: "5d6", flat: 0, procChance: 100 }, secondaryDamage: { dice: "4d6", flat: 0, procChance: 100, damageType: "storm" } }
    ]
  },
  {
    id: "chi_t2_ricochet_blade",
    name: "Refracting Chakram",
    icon: "ability_ironmaidens_boomerang",
    maxRanks: 3,
    position: { x: 2.5, y: 1 },
    requires: "chi_t1_chakram_throw",
    spell: {
      name: "Refracting Chakram",
      description: "Passive: Chakram of Aex ricochets to up to 2 additional targets within 15 ft of the primary line, dealing 100% damage to each.",
      flavorText: "Starlight bent into sharp angles by devotion.",
      source: "talent", class: "Crusader", treeId: "harmonic_inquisitor",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "chain",
      visualTheme: "holy", tags: ["passive", "ricochet", "chain", "crusader"]
    },
    rankUpgrades: [
      { description: "Chakram ricochets to up to 3 additional targets and applies a 1d6 sacred DoT for 2 rounds." },
      { description: "Chakram ricochets to up to 4 additional targets and shreds 3 Passive DR from all struck enemies." }
    ]
  },

  // ─── TIER 3 (y: 2) ───
  {
    id: "chi_t3_null_warding",
    name: "Null-Frequency Shroud",
    icon: "spell_holy_sealofsalvation",
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: "chi_t2_spell_reprimand",
    spell: {
      name: "Null-Frequency Shroud",
      description: "Passive: You and allies within 15 ft take 20% reduced damage from all magical spells and elemental sources (Arcane, Wyrd, Ember, Rime, Storm, Blight).",
      flavorText: "A frequency of perfect stillness surrounds the Inquisitor.",
      source: "talent", class: "Crusader", treeId: "harmonic_inquisitor",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", auraRadius: 15,
      visualTheme: "holy", tags: ["passive", "aura", "spell-resistance", "crusader"]
    },
    rankUpgrades: [
      { description: "Magic damage reduction increases to 30%, and radius extends to 20 ft." },
      { description: "Magic damage reduction increases to 40%; when you resist or save against a spell, gain +15 Radiant Fervor." }
    ]
  },
  {
    id: "chi_t3_acoustic_sever",
    name: "Acoustic Severing",
    icon: "spell_holy_sealingblessing",
    maxRanks: 2,
    position: { x: 2.5, y: 2 },
    requires: "chi_t2_ricochet_blade",
    spell: {
      name: "Acoustic Severing",
      description: "Passive: Critical hits with Sacred or Storm abilities purge 1 active positive magical buff from the target (magical shields, haste, enchantments).",
      flavorText: "Cut the cord that connects the creature to its source.",
      source: "talent", class: "Crusader", treeId: "harmonic_inquisitor",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "single",
      visualTheme: "holy", tags: ["passive", "purge", "dispel", "crusader"]
    },
    rankUpgrades: [
      { description: "Purges up to 2 magical buffs; dealing damage equal to 200% of any shield destroyed as sacred burst damage to adjacent enemies." }
    ]
  },

  // ─── TIER 4 (y: 3) ───
  {
    id: "chi_t4_pillars_of_judgment",
    name: "Pillars of the Harmonic Vigil",
    icon: "spell_holy_mindvision",
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: "chi_t3_null_warding",
    spell: {
      name: "Pillars of the Harmonic Vigil",
      description: "Spend 2 AP & 40 Fervor: Drop 3 starlight monoliths in target 25 ft radius within 45 ft. Deals 4d8 sacred + 3d8 storm damage. The area between pillars becomes a Magic Deadzone where spells cost double mana and suffer Disadvantage to hit.",
      flavorText: "Three tuning forks driven into the bedrock cancel all corrupt chords.",
      source: "talent", class: "Crusader", treeId: "harmonic_inquisitor",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 2, targetingMode: "aoe", rangeType: "ranged", range: 45,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 3, cooldownUnit: "round",
      damageTypes: ["sacred", "storm"],
      primaryDamage: { dice: "4d8", flat: 0, procChance: 100 },
      secondaryDamage: { dice: "3d8", flat: 0, procChance: 100, damageType: "storm" },
      visualTheme: "holy", tags: ["aoe", "deadzone", "anti-magic", "control", "crusader"]
    },
    rankUpgrades: [
      { description: "Damage increases to 5d8 sacred + 4d8 storm, and area becomes 30 ft radius.", primaryDamage: { dice: "5d8", flat: 0, procChance: 100 }, secondaryDamage: { dice: "4d8", flat: 0, procChance: 100, damageType: "storm" } },
      { description: "Damage increases to 6d10 sacred + 5d8 storm; enemies inside cannot cast spells of rank 3 or higher at all for 2 rounds.", primaryDamage: { dice: "6d10", flat: 0, procChance: 100 }, secondaryDamage: { dice: "5d8", flat: 0, procChance: 100, damageType: "storm" } }
    ]
  },
  {
    id: "chi_t4_rebound_resonance",
    name: "Reflective Resonance",
    icon: "spell_holy_lightsgrace",
    maxRanks: 3,
    position: { x: 2.5, y: 3 },
    requires: "chi_t3_acoustic_sever",
    spell: {
      name: "Reflective Resonance",
      description: "Passive: When you take magical spell damage, store 30% of it as Harmonic Charge. Your next melee or Chakram attack discharges the charge as bonus Sacred damage.",
      flavorText: "Drink the spell, purify the energy, strike with the converted light.",
      source: "talent", class: "Crusader", treeId: "harmonic_inquisitor",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self",
      visualTheme: "holy", tags: ["passive", "absorb", "discharge", "crusader"]
    },
    rankUpgrades: [
      { description: "Storage percentage increases to 50% of magical damage taken." },
      { description: "Storage percentage increases to 75%, and discharge triggers a 10 ft AoE shockwave." }
    ]
  },

  // ─── TIER 5 (y: 4) ───
  {
    id: "chi_t5_supernova_purge",
    name: "Supernova Surge Purge",
    icon: "spell_holy_holywordbarrier",
    maxRanks: 3,
    position: { x: 1, y: 4 },
    requires: "chi_t4_pillars_of_judgment",
    spell: {
      name: "Supernova Surge Purge",
      description: "Spend 2 AP & 50 Fervor: Vent stored starlight in a 30 ft radius burst. Deals 5d8 sacred + 4d6 storm damage, Blinds all enemies for 1 round, and dispels all magical terrain hazards (acid pools, rime zones, fire walls).",
      flavorText: "A momentary sun washes the battlefield clean.",
      source: "talent", class: "Crusader", treeId: "harmonic_inquisitor",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 2, targetingMode: "aoe", rangeType: "self-centered", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 3, cooldownUnit: "round",
      damageTypes: ["sacred", "storm"],
      primaryDamage: { dice: "5d8", flat: 0, procChance: 100 },
      secondaryDamage: { dice: "4d6", flat: 0, procChance: 100, damageType: "storm" },
      visualTheme: "holy", tags: ["aoe", "blind", "hazard-clear", "crusader"]
    },
    rankUpgrades: [
      { description: "Damage increases to 7d8 sacred + 5d6 storm, and Blind duration increases to 2 rounds.", primaryDamage: { dice: "7d8", flat: 0, procChance: 100 }, secondaryDamage: { dice: "5d6", flat: 0, procChance: 100, damageType: "storm" } },
      { description: "Damage increases to 9d8 sacred + 6d6 storm; also drains 20% maximum mana/resource from all affected spellcasters.", primaryDamage: { dice: "9d8", flat: 0, procChance: 100 }, secondaryDamage: { dice: "6d6", flat: 0, procChance: 100, damageType: "storm" } }
    ]
  },
  {
    id: "chi_t5_inquisitor_mobility",
    name: "Starlight Translocation",
    icon: "spell_holy_greaterblessingofsanctuary",
    maxRanks: 2,
    position: { x: 2.5, y: 4 },
    requires: "chi_t4_rebound_resonance",
    spell: {
      name: "Starlight Translocation",
      description: "Spend 1 AP: Teleport instantly up to 30 ft to the location of your Chakram of Aex or to any Consecrated Ground tile. Generates +15 Radiant Fervor.",
      flavorText: "Step along the starlight beam before it fades.",
      source: "talent", class: "Crusader", treeId: "harmonic_inquisitor",
      spellType: "ACTIVE", category: "utility",
      actionPoints: 1, targetingMode: "position", rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 2, cooldownUnit: "round",
      visualTheme: "holy", tags: ["mobility", "teleport", "tactical", "crusader"]
    },
    rankUpgrades: [
      { description: "Teleport range extends to 45 ft; landing releases a 10 ft shockwave dealing 2d8 sacred damage to adjacent foes." }
    ]
  },

  // ─── TIER 6 (y: 5) ───
  {
    id: "chi_t6_total_negation",
    name: "Total Mana Shatter",
    icon: "spell_holy_sealofvengeance",
    maxRanks: 3,
    position: { x: 1, y: 5 },
    requires: "chi_t5_supernova_purge",
    spell: {
      name: "Total Mana Shatter",
      description: "Spend 2 AP & 60 Fervor: Strike target caster in melee: 6d10 sacred + 4d8 storm damage. Shatters their spellcasting focus or wand, preventing spellcasting for 2 rounds on a failed Wisdom save.",
      flavorText: "Break the instrument and the melody ceases.",
      source: "talent", class: "Crusader", treeId: "harmonic_inquisitor",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 2, targetingMode: "single", rangeType: "melee", range: 5,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 3, cooldownUnit: "round",
      damageTypes: ["sacred", "storm"],
      primaryDamage: { dice: "6d10", flat: 0, procChance: 100 },
      secondaryDamage: { dice: "4d8", flat: 0, procChance: 100, damageType: "storm" },
      visualTheme: "holy", tags: ["melee", "silence", "mana-burn", "crusader"]
    },
    rankUpgrades: [
      { description: "Damage increases to 8d10 sacred + 5d8 storm, and silence duration extends to 3 rounds.", primaryDamage: { dice: "8d10", flat: 0, procChance: 100 }, secondaryDamage: { dice: "5d8", flat: 0, procChance: 100, damageType: "storm" } },
      { description: "Damage increases to 10d10 sacred + 6d8 storm; if target has mana, deal additional damage equal to 50% of current mana.", primaryDamage: { dice: "10d10", flat: 0, procChance: 100 }, secondaryDamage: { dice: "6d8", flat: 0, procChance: 100, damageType: "storm" } }
    ]
  },
  {
    id: "chi_t6_harmonic_mastery",
    name: "Harmonic Synchronicity",
    icon: "spell_holy_perserverence",
    maxRanks: 2,
    position: { x: 2.5, y: 5 },
    requires: "chi_t5_inquisitor_mobility",
    spell: {
      name: "Harmonic Synchronicity",
      description: "Passive: You have 2 Reactions per combat round instead of 1. Successfully using a reaction refunds 1 AP on your next turn.",
      flavorText: "The tempo of the battlefield bends to the Inquisitor's meter.",
      source: "talent", class: "Crusader", treeId: "harmonic_inquisitor",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "holy", tags: ["passive", "extra-reaction", "ap-refund", "crusader"]
    },
    rankUpgrades: [
      { description: "You gain a 3rd Reaction per round when at 75+ Radiant Fervor, and all Reaction AP costs are reduced to 0." }
    ]
  },

  // ─── TIER 7 (Capstone Row, y: 6) ───
  {
    id: "chi_t7_grand_inquisitor_avatar",
    name: "Avatar of the Grand Inquisitor",
    icon: "spell_holy_blessingofchampion",
    maxRanks: 1,
    position: { x: 1, y: 6 },
    requires: "chi_t6_total_negation",
    spell: {
      name: "Avatar of the Grand Inquisitor",
      description: "CAPSTONE — Spend 3 AP & 100 Fervor: Become the Ultimate Arbiter of Starlight for 3 rounds. All enemy spellcasting within 60 ft is completely silenced. Every melee strike automatically casts a free Chakram of Aex that circles your body, and you can cast Starlight Bolt Reprimand without spending reactions or cooldowns.",
      flavorText: "In the presence of the Grand Inquisitor, magic is unmade and only the pure word stands.",
      source: "talent", class: "Crusader", treeId: "harmonic_inquisitor",
      spellType: "ACTIVE", category: "buff",
      actionPoints: 3, targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "once_per_combat", cooldownValue: 1, cooldownUnit: "combat",
      durationRounds: 3,
      visualTheme: "holy", tags: ["capstone", "ultimate", "silence-aura", "chakram-storm", "crusader"]
    },
    rankUpgrades: []
  },
  {
    id: "chi_t7_eternal_accord",
    name: "Chord of Final Resolution",
    icon: "spell_holy_blessedrecovery",
    maxRanks: 2,
    position: { x: 2.5, y: 6 },
    requires: "chi_t6_harmonic_mastery",
    spell: {
      name: "Chord of Final Resolution",
      description: "Passive: Whenever you counter-spell or purge a magical buff from an enemy, all allies within 30 ft gain +2 to hit and +3 bonus damage on their next 2 attacks.",
      flavorText: "When the discord is resolved, the symphony sings.",
      source: "talent", class: "Crusader", treeId: "harmonic_inquisitor",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", auraRadius: 30,
      visualTheme: "holy", tags: ["passive", "capstone-row", "party-buff", "synergy", "crusader"]
    },
    rankUpgrades: [
      { description: "Party bonus increases to +4 to hit and +6 bonus damage; also grants allies +10 ft movement speed." }
    ]
  }
];
