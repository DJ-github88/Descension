// ============================================
// CRUSADER — HARMONIC INQUISITOR (v3: talents are spells)
// Fantasy: the occult hunter of the Vigil. Aex's song as a discordant tuning
// fork — counterspells, chakram lines, starlight lightning, reactions, and
// the silence that follows. Economy: 8/6/6/5/5/5 + 15 = 50 pts (19 nodes).
// Layout: TUNINGFORK — a central handle opening into a resonance lens.
// ============================================

export const CRUSADER_HARMONIC_INQUISITOR = [
  // ─── TIER 1 (y: 0) ───
  {
    id: "chi_t1_discordant_strike",
    name: "Discordant Reprimand",
    icon: "Lightning/Lightning Strike",
    maxRanks: 3,
    position: { x: 2.5, y: 0 },
    requires: null,
    spell: {
      name: "Discordant Reprimand",
      description: "Passive — Strikes that damage a spellcaster generate +5 bonus Fervor, and hitting a creature that is concentrating forces a Constitution save with Disadvantage to maintain the spell.",
      flavorText: "Aex's song is the true chord. All else is noise to be struck down.",
      source: "talent", class: "Crusader", treeId: "harmonic_inquisitor",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self",
      visualTheme: "holy", tags: ["passive", "anti-magic", "concentration-break", "crusader"]
    },
    rankUpgrades: [
      { description: "Breaking concentration deals +1d8 sacred bonus damage and Fervor generation becomes +8.", primaryDamage: { dice: "1d8", flat: 0, procChance: 100 }, damageTypes: ["sacred"] },
      { description: "Breaking concentration Stuns the target for 1 round and immediately refunds 1 AP." }
    ]
  },
  {
    id: "chi_t1_chakram_throw",
    name: "Chakram of Aex",
    icon: "Radiant/Chakra Circle",
    maxRanks: 3,
    position: { x: 0.5, y: 0 },
    requires: null,
    spell: {
      name: "Chakram of Aex",
      description: "Spend 2 AP: hurl a spinning disc of crystallised starlight down a 30 ft line for 2d8 sacred + 1d6 storm damage to all enemies, then it returns to your hand.",
      flavorText: "It carves the air in geometric perfection before returning home.",
      source: "talent", class: "Crusader", treeId: "harmonic_inquisitor",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 2, targetingMode: "line", rangeType: "ranged", range: 30,
      aoeShape: "line", aoeSize: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 1, cooldownUnit: "rounds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 5 } },
      damageTypes: ["sacred", "storm"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      secondaryDamage: { dice: "1d6", flat: 0, procChance: 100, damageType: "storm" },
      visualTheme: "holy", tags: ["ranged", "line", "chakram", "builder", "crusader"]
    },
    rankUpgrades: [
      { description: "Damage increases to 3d8 sacred + 2d6 storm and the line extends to 40 ft.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 }, secondaryDamage: { dice: "2d6", flat: 0, procChance: 100, damageType: "storm" } },
      { description: "Damage increases to 4d8 sacred + 3d6 storm; enemies struck have their spell ranges reduced by 50% for 1 round.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 }, secondaryDamage: { dice: "3d6", flat: 0, procChance: 100, damageType: "storm" } }
    ]
  },
  {
    id: "chi_t1_starlight_tuning",
    name: "Starlight Tuning",
    icon: "Lightning/Thunder Resonance",
    maxRanks: 2,
    position: { x: 4, y: 0 },
    requires: null,
    spell: {
      name: "Starlight Tuning",
      description: "Passive — Gain +2 Initiative and +2 on saving throws against spells and magical effects.",
      flavorText: "Listen for the cadence. Act between the incantations.",
      source: "talent", class: "Crusader", treeId: "harmonic_inquisitor",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "holy", tags: ["passive", "initiative", "spell-save", "crusader"]
    },
    rankUpgrades: [
      { description: "The bonuses increase to +4 Initiative and +4 on saving throws against spells, and succeeding on such a save grants +10 Fervor." }
    ]
  },

  // ─── TIER 2 (y: 2) ───
  {
    id: "chi_t2_spell_reprimand",
    name: "Starlight Bolt Reprimand",
    icon: "Lightning/Vertical Lightning",
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: "chi_t1_discordant_strike",
    spell: {
      name: "Starlight Bolt Reprimand",
      description: "REACTION: When an enemy within 30 ft begins casting a spell, spend 1 AP & 20 Fervor to call down a starlight bolt for 3d6 sacred + 2d6 storm damage — a failed Constitution save counterspells the spell.",
      flavorText: "Silence falls faster than the word can leave their throat.",
      source: "talent", class: "Crusader", treeId: "harmonic_inquisitor",
      spellType: "ACTIVE", actionType: "reaction", category: "damage",
      actionPoints: 1, targetingMode: "single", rangeType: "ranged", range: 30,
      castTimeType: "reaction", castTimeValue: 1,
      reactionTrigger: "When an enemy within 30 ft begins casting a spell",
      cooldownCategory: "short", cooldownValue: 1, cooldownUnit: "rounds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 6 } },
      damageTypes: ["sacred", "storm"],
      primaryDamage: { dice: "3d6", flat: 0, procChance: 100 },
      secondaryDamage: { dice: "2d6", flat: 0, procChance: 100, damageType: "storm" },
      visualTheme: "holy", tags: ["reaction", "interrupt", "counterspell", "crusader"]
    },
    rankUpgrades: [
      { description: "Damage increases to 4d6 sacred + 3d6 storm, and a successful counterspell refunds 20 Fervor.", primaryDamage: { dice: "4d6", flat: 0, procChance: 100 }, secondaryDamage: { dice: "3d6", flat: 0, procChance: 100, damageType: "storm" } },
      { description: "Damage increases to 5d6 sacred + 4d6 storm, and a successful counterspell also Stuns the caster for 1 round.", primaryDamage: { dice: "5d6", flat: 0, procChance: 100 }, secondaryDamage: { dice: "4d6", flat: 0, procChance: 100, damageType: "storm" } }
    ]
  },
  {
    id: "chi_t2_ricochet_blade",
    name: "Refracting Chakram",
    icon: "Radiant/Multi Shot",
    maxRanks: 3,
    position: { x: 4, y: 1 },
    requires: "chi_t1_chakram_throw",
    spell: {
      name: "Refracting Chakram",
      description: "Passive — Chakram of Aex ricochets to 2 additional enemies within 15 ft of the line, dealing 100% damage to each.",
      flavorText: "Starlight bent into sharp angles by devotion.",
      source: "talent", class: "Crusader", treeId: "harmonic_inquisitor",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "chain",
      visualTheme: "holy", tags: ["passive", "ricochet", "chain", "crusader"]
    },
    rankUpgrades: [
      { description: "The chakram ricochets to 3 additional enemies and applies a 1d6 sacred burn for 2 rounds.", damageTypes: ["sacred"], primaryDamage: { dice: "1d6", flat: 0, procChance: 100 }, isDot: true, dotTick: "1d6", dotDuration: 2 },
      { description: "The chakram ricochets to 4 additional enemies and each struck enemy loses 3 Passive DR for 2 rounds." }
    ]
  },

  // ─── TIER 3 (y: 3.5) ───
  {
    id: "chi_t3_null_warding",
    name: "Null-Frequency Shroud",
    icon: "Force/Force Field",
    maxRanks: 3,
    position: { x: 1.5, y: 2 },
    requires: "chi_t2_spell_reprimand",
    spell: {
      name: "Null-Frequency Shroud",
      description: "Passive — You and allies within 15 ft take 20% less damage from Arcane, Wyrd, Ember, Rime, Storm, and Blight sources.",
      flavorText: "A frequency of perfect stillness surrounds the Inquisitor.",
      source: "talent", class: "Crusader", treeId: "harmonic_inquisitor",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", auraRadius: 15,
      visualTheme: "holy", tags: ["passive", "aura", "spell-resistance", "crusader"]
    },
    rankUpgrades: [
      { description: "The magic damage reduction becomes 30% and the aura reaches 20 ft." },
      { description: "The magic damage reduction becomes 40%, and resisting or saving against a spell grants +15 Fervor." }
    ]
  },
  {
    id: "chi_t3_acoustic_sever",
    name: "Acoustic Severing",
    icon: "Force/Sonic Boom",
    maxRanks: 3,
    position: { x: 3.5, y: 2 },
    requires: "chi_t2_ricochet_blade",
    spell: {
      name: "Acoustic Severing",
      description: "Passive — Critical hits with sacred or storm abilities purge 1 magical buff from the target (shields, haste, enchantments).",
      flavorText: "Cut the cord that connects the creature to its source.",
      source: "talent", class: "Crusader", treeId: "harmonic_inquisitor",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "single",
      visualTheme: "holy", tags: ["passive", "purge", "dispel", "crusader"]
    },
    rankUpgrades: [
      { description: "Your critical hits purge up to 2 magical buffs, and destroying a shield deals 200% of its value as sacred burst damage to adjacent enemies." },
      { description: "Purged enemies cannot cast spells for 1 round." }
    ]
  },

  // ─── TIER 4 (y: 5) ───
  {
    id: "chi_t4_pillars_of_judgment",
    name: "Pillars of the Harmonic Vigil",
    icon: "Radiant/Divine Trio",
    maxRanks: 3,
    position: { x: 1.5, y: 3 },
    requires: "chi_t3_null_warding",
    spell: {
      name: "Pillars of the Harmonic Vigil",
      description: "Spend 2 AP & 40 Fervor: drop 3 starlight monoliths in a 25 ft area within 45 ft for 4d8 sacred + 3d8 storm damage. The air between them becomes a Magic Deadzone: spells cost double mana and suffer Disadvantage to hit.",
      flavorText: "Three tuning forks driven into the bedrock cancel all corrupt chords.",
      source: "talent", class: "Crusader", treeId: "harmonic_inquisitor",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 2, targetingMode: "aoe", rangeType: "ranged", range: 45,
      aoeShape: "circle", aoeSize: 25,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 1, cooldownUnit: "rounds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 8 } },
      damageTypes: ["sacred", "storm"],
      primaryDamage: { dice: "4d8", flat: 0, procChance: 100 },
      secondaryDamage: { dice: "3d8", flat: 0, procChance: 100, damageType: "storm" },
      visualTheme: "holy", tags: ["aoe", "deadzone", "anti-magic", "control", "crusader"]
    },
    rankUpgrades: [
      { description: "Damage increases to 5d8 sacred + 4d8 storm and the area becomes 30 ft.", primaryDamage: { dice: "5d8", flat: 0, procChance: 100 }, secondaryDamage: { dice: "4d8", flat: 0, procChance: 100, damageType: "storm" } },
      { description: "Damage increases to 6d10 sacred + 5d8 storm; enemies inside cannot cast rank 3 or higher spells for 2 rounds.", primaryDamage: { dice: "6d10", flat: 0, procChance: 100 }, secondaryDamage: { dice: "5d8", flat: 0, procChance: 100, damageType: "storm" } }
    ]
  },
  {
    id: "chi_t4_rebound_resonance",
    name: "Reflective Resonance",
    icon: "Force/Absorb Energy",
    maxRanks: 2,
    position: { x: 4, y: 3 },
    requires: "chi_t3_acoustic_sever",
    spell: {
      name: "Reflective Resonance",
      description: "Passive — When you take magical spell damage, store 30% of it as Harmonic Charge. Your next melee or chakram attack discharges the charge as bonus sacred damage.",
      flavorText: "Drink the spell, purify the energy, strike with the converted light.",
      source: "talent", class: "Crusader", treeId: "harmonic_inquisitor",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["sacred"],
      primaryDamage: { dice: "1d8", flat: 0, procChance: 100 },
      visualTheme: "holy", tags: ["passive", "absorb", "discharge", "crusader"]
    },
    rankUpgrades: [
      { description: "Storage increases to 50% of magical damage taken, and the discharge also releases a 10 ft shockwave.", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 } }
    ]
  },

  // ─── TIER 5 (y: 6.5) ───
  {
    id: "chi_t5_supernova_purge",
    name: "Supernova Surge",
    icon: "Force/Explosion Burst",
    maxRanks: 3,
    position: { x: 0.5, y: 4 },
    requires: "chi_t4_pillars_of_judgment",
    spell: {
      name: "Supernova Surge",
      description: "Spend 2 AP & 50 Fervor: vent stored starlight in a 30 ft burst for 5d8 sacred + 4d6 storm damage, Blind all enemies for 1 round, and dispel magical terrain hazards (acid pools, rime zones, fire walls).",
      flavorText: "A momentary sun washes the battlefield clean.",
      source: "talent", class: "Crusader", treeId: "harmonic_inquisitor",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 2, targetingMode: "aoe", rangeType: "self-centered", range: 30,
      aoeShape: "circle", aoeSize: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 1, cooldownUnit: "rounds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { mana: { baseAmount: 9 } },
      damageTypes: ["sacred", "storm"],
      primaryDamage: { dice: "5d8", flat: 0, procChance: 100 },
      secondaryDamage: { dice: "4d6", flat: 0, procChance: 100, damageType: "storm" },
      visualTheme: "holy", tags: ["aoe", "blind", "hazard-clear", "crusader"]
    },
    rankUpgrades: [
      { description: "Damage increases to 7d8 sacred + 5d6 storm and the Blind lasts 2 rounds.", primaryDamage: { dice: "7d8", flat: 0, procChance: 100 }, secondaryDamage: { dice: "5d6", flat: 0, procChance: 100, damageType: "storm" } },
      { description: "Damage increases to 9d8 sacred + 6d6 storm; struck spellcasters also lose 20% of their maximum mana.", primaryDamage: { dice: "9d8", flat: 0, procChance: 100 }, secondaryDamage: { dice: "6d6", flat: 0, procChance: 100, damageType: "storm" } }
    ]
  },
  {
    id: "chi_t5_inquisitor_mobility",
    name: "Starlight Translocation",
    icon: "Lightning/Lightning Dash",
    maxRanks: 2,
    position: { x: 2, y: 4 },
    requires: "chi_t4_rebound_resonance",
    spell: {
      name: "Starlight Translocation",
      description: "Spend 1 AP: teleport instantly up to 30 ft to your Chakram of Aex or to any Consecrated Ground tile, and generate +15 Fervor.",
      flavorText: "Step along the starlight beam before it fades.",
      source: "talent", class: "Crusader", treeId: "harmonic_inquisitor",
      spellType: "ACTIVE", category: "utility",
      actionPoints: 1, targetingMode: "position", rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 1, cooldownUnit: "rounds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 4 } },
      visualTheme: "holy", tags: ["mobility", "teleport", "tactical", "crusader"]
    },
    rankUpgrades: [
      { description: "The teleport extends to 45 ft, and landing releases a 10 ft shockwave for 2d8 sacred damage.", damageTypes: ["sacred"], primaryDamage: { dice: "2d8", flat: 0, procChance: 100 } }
    ]
  },

  // ─── TIER 6 (y: 7.5) ───
  {
    id: "chi_t6_total_negation",
    name: "Total Mana Shatter",
    icon: "Lightning/Shock",
    maxRanks: 1,
    position: { x: 0, y: 5 },
    requires: "chi_t5_supernova_purge",
    spell: {
      name: "Total Mana Shatter",
      description: "Spend 2 AP & 60 Fervor: strike a caster in melee for 6d10 sacred + 4d8 storm damage. On a failed Wisdom save their focus shatters and they cannot cast spells for 2 rounds.",
      flavorText: "Break the instrument and the melody ceases.",
      source: "talent", class: "Crusader", treeId: "harmonic_inquisitor",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 2, targetingMode: "single", rangeType: "melee", range: 5,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 1, cooldownUnit: "rounds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 10 } },
      damageTypes: ["sacred", "storm"],
      primaryDamage: { dice: "6d10", flat: 0, procChance: 100 },
      secondaryDamage: { dice: "4d8", flat: 0, procChance: 100, damageType: "storm" },
      visualTheme: "holy", tags: ["melee", "silence", "mana-burn", "crusader"]
    },
    rankUpgrades: []
  },
  {
    id: "chi_t6_harmonic_mastery",
    name: "Harmonic Synchronicity",
    icon: "Lightning/Thunder",
    maxRanks: 2,
    position: { x: 1, y: 5 },
    requires: ["chi_t5_supernova_purge", "chi_t5_inquisitor_mobility"],
    spell: {
      name: "Harmonic Synchronicity",
      description: "Passive — You have 2 Reactions each combat round instead of 1, and using a Reaction refunds 1 AP on your next turn.",
      flavorText: "The tempo of the battlefield bends to the Inquisitor's meter.",
      source: "talent", class: "Crusader", treeId: "harmonic_inquisitor",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "holy", tags: ["passive", "extra-reaction", "ap-refund", "crusader"]
    },
    rankUpgrades: [
      { description: "You gain a 3rd Reaction per round while at 75+ Fervor, and all Reaction AP costs are reduced to 0." }
    ]
  },
  {
    id: "chi_t6_grand_verdict",
    name: "Grand Inquisitor's Verdict",
    icon: "Radiant/Enlightened Vision",
    maxRanks: 2,
    position: { x: 2, y: 5 },
    requires: "chi_t5_inquisitor_mobility",
    spell: {
      name: "Grand Inquisitor's Verdict",
      description: "Passive — Enemies you counterspell or strip of a magical buff are Judged for 1 round: they take +2d6 sacred damage from you and cannot regain mana.",
      flavorText: "Judgment is not a sentence. It is a frequency that follows you.",
      source: "talent", class: "Crusader", treeId: "harmonic_inquisitor",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "single", damageTypes: ["sacred"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      visualTheme: "holy", tags: ["passive", "judged", "anti-magic", "crusader"]
    },
    rankUpgrades: [
      { description: "Judgment lasts 2 rounds, and when a Judged enemy dies allies within 20 ft gain +10 Fervor.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } }
    ]
  },

  // ─── TIER 7 (y: 8) ───
  {
    id: "chi_t7_grand_inquisitor_avatar",
    name: "Avatar of the Grand Inquisitor",
    icon: "Radiant/Divine Entity",
    maxRanks: 1,
    position: { x: 0.75, y: 6 },
    requires: "chi_t6_total_negation",
    spell: {
      name: "Avatar of the Grand Inquisitor",
      description: "ULTIMATE — Spend 3 AP & 100 Fervor: become the Ultimate Arbiter of Starlight for 3 rounds. All enemy spellcasting within 60 ft is silenced. Every melee strike casts a free Chakram of Aex, and Starlight Bolt Reprimand costs no Reaction or cooldown.",
      flavorText: "In the presence of the Grand Inquisitor, magic is unmade and only the pure word stands.",
      source: "talent", class: "Crusader", treeId: "harmonic_inquisitor",
      spellType: "ACTIVE", category: "buff",
      actionPoints: 3, targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "once_per_combat", cooldownValue: 1, cooldownUnit: "combat",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: false, interruptible: false,
      resourceCosts: { mana: { baseAmount: 15 } },
      durationRounds: 3,
      visualTheme: "holy", tags: ["ultimate", "capstone", "silence-aura", "chakram-storm", "crusader"]
    },
    rankUpgrades: []
  },
  {
    id: "chi_t7_inquisitor_doctrine",
    name: "Inquisitor Doctrine",
    icon: "Radiant/Meditating Enlightened",
    maxRanks: 5,
    position: { x: 0, y: 6 },
    requires: "chi_t6_total_negation",
    spell: {
      name: "Inquisitor Doctrine",
      description: "Passive — Your counterspells and chakram strikes deal +1d6 sacred damage.",
      flavorText: "Every rank of the doctrine is a new note in the unwinding song.",
      source: "talent", class: "Crusader", treeId: "harmonic_inquisitor",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["sacred"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "holy", tags: ["passive", "doctrine", "counterspell", "crusader"]
    },
    rankUpgrades: [
      { description: "The bonus becomes +2d6 sacred damage and counterspelling a spell refunds 15 Fervor.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } },
      { description: "The bonus becomes +3d6 sacred damage and your first Reaction each round costs no Fervor.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } },
      { description: "The bonus becomes +4d6 sacred damage, and Judged enemies take an additional +2d6 from all of your attacks.", primaryDamage: { dice: "4d6", flat: 0, procChance: 100 } },
      { description: "The bonus becomes +5d6 sacred damage, and your counterspells also silence the caster for 1 round.", primaryDamage: { dice: "5d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "chi_t7_resonance_reservoir",
    name: "Resonance Reservoir",
    icon: "Lightning/Lightning Sphere",
    maxRanks: 3,
    position: { x: 2, y: 6 },
    requires: "chi_t6_harmonic_mastery",
    spell: {
      name: "Resonance Reservoir",
      description: "Passive — You enter combat with 20 Fervor, and your Reactions cost 10 less Fervor (minimum 0).",
      flavorText: "The fork stores every note it has ever carried.",
      source: "talent", class: "Crusader", treeId: "harmonic_inquisitor",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self",
      visualTheme: "holy", tags: ["passive", "reservoir", "reaction", "crusader"]
    },
    rankUpgrades: [
      { description: "You enter combat with 40 Fervor, and using a Reaction generates +10 Fervor." },
      { description: "You enter combat with 60 Fervor, and while at 50+ Fervor your Reaction cooldowns are reduced by 1 round." }
    ]
  },
  {
    id: "chi_t7_chord_of_final_resolution",
    name: "Chord of Final Resolution",
    icon: "Radiant/Golden Bell",
    maxRanks: 3,
    position: { x: 3.25, y: 6 },
    requires: "chi_t6_grand_verdict",
    spell: {
      name: "Chord of Final Resolution",
      description: "Passive — Whenever you counterspell or purge a buff, all allies within 30 ft gain +2 to hit and +3 damage on their next 2 attacks.",
      flavorText: "When the discord is resolved, the symphony sings.",
      source: "talent", class: "Crusader", treeId: "harmonic_inquisitor",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", auraRadius: 30,
      visualTheme: "holy", tags: ["passive", "capstone-row", "party-buff", "synergy", "crusader"]
    },
    rankUpgrades: [
      { description: "The party bonus becomes +4 to hit and +6 damage on their next 3 attacks." },
      { description: "Affected allies also gain +10 ft movement speed and +5 Fervor." }
    ]
  },
  {
    id: "chi_t7_silence_unending",
    name: "Unending Silence",
    icon: "General/Order",
    maxRanks: 3,
    position: { x: 4, y: 6 },
    requires: "chi_t6_grand_verdict",
    spell: {
      name: "Unending Silence",
      description: "Passive — Enemies within 15 ft suffer a -2 penalty on spell attack rolls, and your Reprimand and Chakram ranges increase by 10 ft.",
      flavorText: "The last note of the old world is the first note of the new.",
      source: "talent", class: "Crusader", treeId: "harmonic_inquisitor",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", auraRadius: 15,
      visualTheme: "holy", tags: ["passive", "capstone-row", "silence-aura", "anti-magic", "crusader"]
    },
    rankUpgrades: [
      { description: "The penalty becomes -3 and your Reprimand and Chakram ranges increase by 20 ft." },
      { description: "The penalty becomes -4, and enemies who miss a spell attack within your aura are silenced for 1 round." }
    ]
  }
];
