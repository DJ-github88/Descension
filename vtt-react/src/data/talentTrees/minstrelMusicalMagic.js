// ============================================
// MINSTREL — MUSICAL MAGIC (v3: spec identity redesign)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50.
//
// SPEC IDENTITY: The Dissonant Virtuoso / Sonic Disruptor.
// You wield the forbidden chords, wrong notes, and screeching acoustic discord.
// Where Soulsinger heals and Battlechoir buffs, Dissonance directly assaults
// enemy nervous systems: deafening casters, causing friendly fire, silencing verbal spells,
// and dealing high-burst wyrd and storm damage.
//
// SIGNATURE ACTIVES:
//   - Dissonant Shriek (t1):       Acoustic cone that deafens and damages
//   - Tritone Discord (t2):        Forbidden interval that damages and causes confusion
//   - Deceptive Cadence (t3):      Resolution fake-out that stuns targets and causes friendly fire
//   - Sonic Feedback (t4):         Reaction to reflect enemy spells back at their casters
//   - Mind Shatter (t5):           Channeled psychic disruption that silences and destroys concentration
//   - Deafening Crescendo (t6):    AoE sonic stun across entire battlefield
//   - Symphony of Ruin (t7):       ULTIMATE — Catastrophic dissonant cacophony tearing reality
// ============================================

export const MINSTREL_MUSICAL_MAGIC = [
  // ──────────────── TIER 1 (8 pts) ────────────────
  {
    id: "mm_t1_dissonant_shriek",
    name: "Dissonant Shriek",
    icon: "spell_arcane_arcanetorrent",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Dissonant Shriek",
      description: "Unleash a piercing shriek of pure acoustic discord in a 25-foot cone: deals 2d6 wyrd damage, deafens enemies for 2 rounds, and generates 1 Note VII (Leading Tone) and 1 Note II (Supertonic).",
      flavorText: "A gull of ill omen through the gathering dark.",
      source: "talent", class: "Minstrel", treeId: "musical_magic",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 25, aoeShape: "cone", aoeSize: 25,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 6, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 4 } },
      damageTypes: ["wyrd"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      debuffs: ["deafened"], visualTheme: "arcane", tags: ["cone", "wyrd", "deafened", "minstrel"]
    },
    rankUpgrades: [
      { description: "30-foot cone deals 2d6 wyrd damage, deafens for 2 rounds, and interrupts verbal spellcasting.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 }, range: 30, aoeSize: 30 },
      { description: "35-foot cone deals 2d6 wyrd damage, deafens for 3 rounds, interrupts casting, and generates 2 Note VII.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 }, range: 35, aoeSize: 35 }
    ]
  },
  {
    id: "mm_t1_unsettling_vibration",
    name: "Unsettling Discord",
    icon: "spell_arcane_arcaneresilience",
    maxRanks: 3,
    position: { x: 2.5, y: 0 },
    requires: null,
    spell: {
      name: "Unsettling Discord",
      description: "Whenever you generate Note II (Supertonic) or Note VII (Leading Tone), all enemies within 15 feet take 1d6 wyrd damage and have disadvantage on their next attack roll.",
      flavorText: "The tide shivers at the discord. So does everyone else.",
      source: "talent", class: "Minstrel", treeId: "musical_magic",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["wyrd"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "arcane", tags: ["passive", "notes", "aura", "minstrel"]
    },
    rankUpgrades: [
      { description: "Discord aura deals 2d6 wyrd damage and reduces enemy spell DCs by -2.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } },
      { description: "Discord aura deals 3d6 wyrd damage, reduces spell DCs by -3, and enemies taking damage have a 30 points chance to be silenced for 1 round.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "mm_t1_echoing_tension",
    name: "Acoustic Strain",
    icon: "spell_holy_divineprovidence",
    maxRanks: 2,
    position: { x: 4, y: 0 },
    requires: null,
    spell: {
      name: "Acoustic Strain",
      description: "All your crowd-control and dissonance spells have their save DCs increased by +2 and ignore 10 points of enemy magical resistances.",
      flavorText: "The mind cannot easily resist the wrong note.",
      source: "talent", class: "Minstrel", treeId: "musical_magic",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "dc-boost", "penetration", "minstrel"]
    },
    rankUpgrades: [
      { description: "Save DCs increased by +3, ignores 2 Damage Reduction, and enemies failing saves against you take 1d6 wyrd backlash." }
    ]
  },

  // ──────────────── TIER 2 (6 pts) ────────────────
  {
    id: "mm_t2_tritone_discord",
    name: "Tritone Discord",
    icon: "spell_shadow_mindtwisting",
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: "mm_t1_dissonant_shriek",
    spell: {
      name: "Tritone Discord",
      description: "Spend 2 notes: strike the forbidden tritone interval on a target within 45 feet. Deals 3d8 wyrd damage, confuses the target (must save or attack random adjacent creature on its turn), and lasts 1 round.",
      flavorText: "The devil's chord. Always effective.",
      source: "talent", class: "Minstrel", treeId: "musical_magic",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "ranged", range: 45,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 10, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { notes: { baseAmount: 2 } },
      damageTypes: ["wyrd"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      debuffs: ["confusion"], visualTheme: "arcane", tags: ["confusion", "wyrd", "single-target", "minstrel"]
    },
    rankUpgrades: [
      { description: "Deals 4d8 wyrd damage, confusion lasts 2 rounds, and target attacks its allies with advantage.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 } },
      { description: "Deals 4d8 wyrd damage, confuses up to 2 targets in range, and refunds 1 note if the confused target hits its ally.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "mm_t2_dissonant_spread",
    name: "Dissonant Resonance",
    icon: "spell_arcane_arcaneresilience",
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: "mm_t1_unsettling_vibration",
    spell: {
      name: "Dissonant Resonance",
      description: "Whenever an enemy fails a saving throw against any of your spells, all enemies within 15 feet of it take 2d6 wyrd damage and are slowed by 10ft.",
      flavorText: "Contagion in the key of discord.",
      source: "talent", class: "Minstrel", treeId: "musical_magic",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["wyrd"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      visualTheme: "arcane", tags: ["passive", "aoe-proc", "slow", "minstrel"]
    },
    rankUpgrades: [
      { description: "Failure ripples 3d6 wyrd damage within 20 feet and slows enemies by 15ft.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } },
      { description: "Failure ripples 4d6 wyrd damage within 25 feet, slows by 20ft, and silences victims for 1 round.", primaryDamage: { dice: "4d6", flat: 0, procChance: 100 } }
    ]
  },

  // ──────────────── TIER 3 (6 pts) ────────────────
  {
    id: "mm_t3_deceptive_cadence",
    name: "Deceptive Cadence",
    icon: "spell_arcane_arcanetorrent",
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: "mm_t2_tritone_discord",
    spell: {
      name: "Deceptive Cadence",
      description: "Spend 4 notes (V to VI progression): feign a resolution, only to violently subvert it. Target within 45 feet takes 3d8 wyrd damage, is stunned for 1 round, and all enemies within 15 feet take 2d8 collateral damage.",
      flavorText: "They thought it resolved. It did not.",
      source: "talent", class: "Minstrel", treeId: "musical_magic",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "ranged", range: 45, aoeShape: "circle", aoeSize: 15,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 12, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { notes: { baseAmount: 4 } },
      damageTypes: ["wyrd"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      debuffs: ["stun"], visualTheme: "arcane", tags: ["cadence", "nuke", "stun", "minstrel"]
    },
    rankUpgrades: [
      { description: "Deals 4d8 wyrd to primary and 3d8 to collateral. Stun duration remains 1 round.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 } },
      { description: "Deals 5d8 wyrd to primary and 4d8 to collateral. Stuns for 1 round and forces primary target to drop its weapons.", primaryDamage: { dice: "5d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "mm_t3_half_cadence_shield",
    name: "Suspended Resonance",
    icon: "spell_arcane_portalshattrath",
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: "mm_t2_dissonant_spread",
    spell: {
      name: "Suspended Resonance",
      description: "Whenever you hold at least 3 notes, an oscillating acoustic barrier surrounds you: gain +3 Durability Steps to equipped durability and attackers who strike you take 2d8 wyrd damage.",
      flavorText: "The unsaid chord guards the doorway.",
      source: "talent", class: "Minstrel", treeId: "musical_magic",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["wyrd"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      visualTheme: "arcane", tags: ["passive", "shield", "retaliation", "minstrel"]
    },
    rankUpgrades: [
      { description: "Gain +5 Durability Steps to equipped durability, attackers take 3d8 wyrd damage and are pushed 10ft back.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } },
      { description: "Gain +6 Durability Steps to equipped durability, attackers take 4d8 wyrd, are pushed 15ft, and become deafened for 2 rounds.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 } }
    ]
  },

  // ──────────────── TIER 4 (5 pts) ────────────────
  {
    id: "mm_t4_sonic_feedback",
    name: "Sonic Feedback",
    icon: "spell_arcane_blink",
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: "mm_t3_deceptive_cadence",
    spell: {
      name: "Sonic Feedback",
      description: "Reaction (spend 3 notes): when an enemy casts a spell targeting you or an ally within 30 feet, invert the sonic frequency. Counter the spell completely and reflect 25 points of its damage back at the caster.",
      flavorText: "Their own voice, shoved back down their throat.",
      source: "talent", class: "Minstrel", treeId: "musical_magic",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "single", rangeType: "ranged", range: 45,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 20, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { notes: { baseAmount: 3 } },
      visualTheme: "arcane", tags: ["counterspell", "reflect", "reaction", "minstrel"]
    },
    rankUpgrades: [
      { description: "Counters spell, reflects 25 points of damage back at caster, and silences the caster for 1 round.", cooldownValue: 16 },
      { description: "Counters spell, reflects 25 points damage, silences caster for 2 rounds, and refunds 2 notes on successful reflection.", cooldownValue: 12 }
    ]
  },
  {
    id: "mm_t4_discordant_amplification",
    name: "Discordant Strain",
    icon: "spell_shadow_mindsteal",
    maxRanks: 2,
    position: { x: 3.5, y: 3 },
    requires: "mm_t3_half_cadence_shield",
    spell: {
      name: "Discordant Strain",
      description: "All wyrd and dissonance damage you deal ignores 6 Damage Reduction, and critical strikes with dissonance abilities double in damage multiplier.",
      flavorText: "Clean disharmony pierces every shield.",
      source: "talent", class: "Minstrel", treeId: "musical_magic",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["wyrd"],
      visualTheme: "arcane", tags: ["passive", "penetration", "crit-boost", "minstrel"]
    },
    rankUpgrades: [
      { description: "Ignores 6 Damage Reduction; critical strikes triple in damage multiplier and cause the victim to bleed psychic energy for 3d8 over 2 rounds." }
    ]
  },

  // ──────────────── TIER 5 (5 pts) ────────────────
  {
    id: "mm_t5_mind_shatter",
    name: "Mind Shatter",
    icon: "spell_shadow_unholyfrenzy",
    maxRanks: 2,
    position: { x: 1, y: 4 },
    requires: "mm_t4_sonic_feedback",
    spell: {
      name: "Mind Shatter",
      description: "Spend 4 notes: channel an excruciating acoustic frequency at a target within 50 feet for 3 rounds. Deals 4d8 wyrd damage per round, destroys all enemy concentration, and silences the target for the full duration.",
      flavorText: "The pitch where thoughts simply break apart.",
      source: "talent", class: "Minstrel", treeId: "musical_magic",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "ranged", range: 50,
      castTimeType: "channeled", castTimeValue: 3,
      cooldownCategory: "medium", cooldownValue: 30, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: false,
      resourceCosts: { notes: { baseAmount: 4 } },
      damageTypes: ["wyrd"],
      primaryDamage: { dice: "4d8", flat: 0, procChance: 100 },
      debuffs: ["silence"], visualTheme: "arcane", tags: ["channel", "nuke", "silence", "minstrel"]
    },
    rankUpgrades: [
      { description: "Deals 6d8 wyrd per round, silences target, and collateral shockwaves deal 3d8 wyrd to all adjacent enemies.", primaryDamage: { dice: "6d8", flat: 0, procChance: 100 }, cooldownValue: 24 }
    ]
  },
  {
    id: "mm_t5_cacophony_engine",
    name: "Cacophony Engine",
    icon: "spell_arcane_arcanetorrent",
    maxRanks: 3,
    position: { x: 3, y: 4 },
    requires: "mm_t4_discordant_amplification",
    spell: {
      name: "Cacophony Engine",
      description: "Whenever an enemy takes damage from your dissonance or wrong-note abilities, you have a 40 points chance to generate 1 Note VII and 1 Note II.",
      flavorText: "Chaos generates its own raw materials.",
      source: "talent", class: "Minstrel", treeId: "musical_magic",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "engine", "notes", "minstrel"]
    },
    rankUpgrades: [
      { description: "60 points chance to generate notes on dissonance damage, and Note VII attacks deal +2d6 bonus damage." },
      { description: "100 points chance to generate Note VII and Note II on dissonance damage; your note bank maximum increases by 3." }
    ]
  },

  // ──────────────── TIER 6 (5 pts) ────────────────
  {
    id: "mm_t6_deafening_crescendo",
    name: "Deafening Crescendo",
    icon: "spell_shadow_mindtwisting",
    maxRanks: 1,
    position: { x: 1, y: 5 },
    requires: "mm_t5_mind_shatter",
    spell: {
      name: "Deafening Crescendo",
      description: "Spend 5 notes: detonate a massive 40-foot sonic shockwave. Deals 6d10 wyrd damage to all enemies in range, stuns all enemies for 1 round, and permanently deafens them for the encounter.",
      flavorText: "Silence, achieved through overwhelming noise.",
      source: "talent", class: "Minstrel", treeId: "musical_magic",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 40,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 60, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { notes: { baseAmount: 5 } },
      damageTypes: ["wyrd"],
      primaryDamage: { dice: "6d10", flat: 0, procChance: 100 },
      debuffs: ["stun", "deafened"], visualTheme: "arcane", tags: ["aoe", "mass-stun", "nuke", "minstrel"]
    },
    rankUpgrades: []
  },
  {
    id: "mm_t6_dissonant_echoes",
    name: "Permanent Discord",
    icon: "spell_shadow_curseofsargeras",
    maxRanks: 2,
    position: { x: 2.5, y: 5 },
    requires: "mm_t5_cacophony_engine",
    spell: {
      name: "Permanent Discord",
      description: "Enemies deafened or confused by your abilities suffer +1d6 bonus damage from ALL party members and cannot take reactions.",
      flavorText: "They cannot coordinate in the noise.",
      source: "talent", class: "Minstrel", treeId: "musical_magic",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "vulnerability", "no-reaction", "minstrel"]
    },
    rankUpgrades: [
      { description: "Deafened/confused enemies suffer +2d6 bonus damage from all sources, lose all reactions, and their movement speed is halved." }
    ]
  },
  {
    id: "mm_t6_psychic_bleed",
    name: "Psychic Resonance Bleed",
    icon: "spell_shadow_shadowwordpain",
    maxRanks: 2,
    position: { x: 4, y: 5 },
    requires: "mm_t5_cacophony_engine",
    spell: {
      name: "Psychic Resonance Bleed",
      description: "Whenever a target takes damage from your dissonance spells, they bleed 2d6 wyrd damage per round for 3 rounds. Stacks up to 3 times.",
      flavorText: "The ringing in their ears refuses to cease.",
      source: "talent", class: "Minstrel", treeId: "musical_magic",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["wyrd"],
      isDot: true, dotDuration: 3, dotTick: "2d6",
      visualTheme: "arcane", tags: ["passive", "dot", "wyrd", "minstrel"]
    },
    rankUpgrades: [
      { description: "Bleed ticks for 3d6 wyrd per round, stacks up to 5 times, and enemies at max stacks are blinded.", dotTick: "3d6" }
    ]
  },

  // ──────────────── TIER 7 / CAPSTONE (15 pts) ────────────────
  {
    id: "mm_t7_symphony_of_ruin",
    name: "Symphony of Ruin",
    icon: "spell_shadow_deathanddecay",
    maxRanks: 1,
    position: { x: 0.5, y: 6 },
    requires: "mm_t6_deafening_crescendo",
    spell: {
      name: "Symphony of Ruin",
      description: "ULTIMATE: Spend 6 notes: conduct the Acoustic Apocalypse for 1 minute: a 50-foot zone of reality-tearing dissonance erupts. Deals 5d10 wyrd damage per round to all enemies inside, completely prevents all enemy spellcasting, and causes enemies inside to attack each other on their turns.",
      flavorText: "The final chord that dissolves the theater.",
      source: "talent", class: "Minstrel", treeId: "musical_magic",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 50,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 180, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { notes: { baseAmount: 6 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      damageTypes: ["wyrd"],
      primaryDamage: { dice: "5d10", flat: 0, procChance: 100 },
      buffs: ["symphony-ruin"], visualTheme: "arcane", tags: ["ultimate", "capstone", "aoe-ruin", "minstrel"]
    },
    rankUpgrades: []
  },
  {
    id: "mm_t7_dissonance_doctrine",
    name: "Dissonance Doctrine",
    icon: "spell_shadow_darkritual",
    maxRanks: 5,
    position: { x: 1.5, y: 6 },
    requires: "mm_t6_deafening_crescendo",
    spell: {
      name: "Dissonance Doctrine",
      description: "The wrong note is the truest note. All wyrd damage you deal across all spells and cadences is increased by +1d6 damage.",
      flavorText: "Harmony was always a compromise. Discord is pure.",
      source: "talent", class: "Minstrel", treeId: "musical_magic",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["wyrd"],
      visualTheme: "arcane", tags: ["passive", "capstone", "damage", "minstrel"]
    },
    rankUpgrades: [
      { description: "All wyrd damage increased by +1d8 damage." },
      { description: "All wyrd damage increased by +1d8 damage." },
      { description: "All wyrd damage increased by +2d8 damage." },
      { description: "All wyrd damage increased by +2d8 damage, and Dissonant Shriek costs 0 mana." }
    ]
  },
  {
    id: "mm_t7_acoustic_overload",
    name: "Acoustic Singularity",
    icon: "spell_arcane_arcanetorrent",
    maxRanks: 3,
    position: { x: 2.5, y: 6 },
    requires: "mm_t6_dissonant_echoes",
    spell: {
      name: "Acoustic Singularity",
      description: "Whenever a target dies while under the effect of your dissonance or confusion, it implodes: pulls all enemies within 25 feet toward its corpse and deals 4d8 wyrd damage to them.",
      flavorText: "The vacuum left by silenced thoughts.",
      source: "talent", class: "Minstrel", treeId: "musical_magic",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["wyrd"],
      primaryDamage: { dice: "4d8", flat: 0, procChance: 100 },
      visualTheme: "arcane", tags: ["passive", "capstone", "pull", "death-burst", "minstrel"]
    },
    rankUpgrades: [
      { description: "Implosion pulls within 30 feet, deals 6d8 wyrd damage, and knocks all pulled enemies prone.", primaryDamage: { dice: "6d8", flat: 0, procChance: 100 } },
      { description: "Implosion deals 8d8 wyrd damage, stuns all pulled enemies for 1 round, and restores 3 notes to your bank.", primaryDamage: { dice: "8d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "mm_t7_cacophonous_reflex",
    name: "Master of Discord",
    icon: "spell_arcane_blast",
    maxRanks: 3,
    position: { x: 3.5, y: 6 },
    requires: "mm_t6_psychic_bleed",
    spell: {
      name: "Master of Discord",
      description: "Sonic Feedback can be used twice per round and costs 1 fewer note.",
      flavorText: "Every counter is an opening movement.",
      source: "talent", class: "Minstrel", treeId: "musical_magic",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "capstone", "counter", "minstrel"]
    },
    rankUpgrades: [
      { description: "Sonic Feedback costs 2 fewer notes and can be used on ranged weapon attacks as well as spells." },
      { description: "Sonic Feedback is FREE, can be used 3 times per round on ANY attack or spell, and reflected damage is doubled." }
    ]
  },
  {
    id: "mm_t7_infinite_cacophony",
    name: "Living Discord",
    icon: "spell_shadow_unholyfrenzy",
    maxRanks: 3,
    position: { x: 4.5, y: 6 },
    requires: "mm_t6_psychic_bleed",
    spell: {
      name: "Living Discord",
      description: "You are immune to silence, deafness, and all mental control effects. Whenever an enemy attempts to charm or silence you, it takes 5d8 wyrd damage in feedback.",
      flavorText: "You cannot silence what is already pure noise.",
      source: "talent", class: "Minstrel", treeId: "musical_magic",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["wyrd"],
      primaryDamage: { dice: "5d8", flat: 0, procChance: 100 },
      visualTheme: "arcane", tags: ["passive", "capstone", "immunity", "retaliation", "minstrel"]
    },
    rankUpgrades: [
      { description: "Immunity to mental control; feedback deals 7d8 wyrd damage and confuses the attacker for 1 round.", primaryDamage: { dice: "7d8", flat: 0, procChance: 100 } },
      { description: "Immunity; feedback deals 10d8 wyrd damage, stuns the attacker for 2 rounds, and immediately gives you full notes.", primaryDamage: { dice: "10d8", flat: 0, procChance: 100 } }
    ]
  }
];
