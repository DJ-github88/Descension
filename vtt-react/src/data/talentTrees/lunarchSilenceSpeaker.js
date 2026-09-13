// ============================================
// LUNARCH — SILENCE SPEAKER (v2: talents are spells)
// Spec: Silence Rend, Cosmic Void Debuffs, Anti-Magic, Mental Erosion, Star Sickness
// Resource: Lunar Phases (New Moon -> Waxing -> Full Moon -> Waning)
// ============================================

export const LUNARCH_SILENCE_SPEAKER = [
  // ─── TIER 1 (y: 0) ───
  {
    id: "lss_t1_silence_rend",
    name: "Silence Rend",
    icon: "Chaos/Chaotic Rupture",
    maxRanks: 3,
    position: { x: 0.5, y: 0 },
    requires: null,
    spell: {
      name: "Silence Rend",
      description: "Spend 1 AP: Tear open a seam of dead-moon silence 30 ft away: deals 1d8 wyrd + 1d6 blight damage and inflicts Star Sickness (-2 to spellcasting checks and saving throws for 2 rounds).",
      flavorText: "A rip in the air where sound forgets how to travel.",
      source: "talent", class: "Lunarch", treeId: "silence_speaker",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 1, targetingMode: "single", rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 1, cooldownUnit: "round",
      resourceCosts: { mana: { baseAmount: 3 } },
      damageTypes: ["wyrd", "blight"],
      primaryDamage: { dice: "1d8", flat: 0, procChance: 100 },
      secondaryDamage: { dice: "1d6", flat: 0, procChance: 100, damageType: "blight" },
      visualTheme: "shadow", tags: ["ranged", "builder", "star-sickness", "lunarch"]
    },
    rankUpgrades: [
      { description: "Damage increases to 2d8 wyrd + 1d8 blight, and Star Sickness penalty increases to -3.", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 }, secondaryDamage: { dice: "1d8", flat: 0, procChance: 100, damageType: "blight" } },
      { description: "Damage increases to 2d10 wyrd + 2d6 blight; target is Silenced for 1 round on a failed Will save.", primaryDamage: { dice: "2d10", flat: 0, procChance: 100 }, secondaryDamage: { dice: "2d6", flat: 0, procChance: 100, damageType: "blight" } }
    ]
  },
  {
    id: "lss_t1_void_resonance",
    name: "Voice of the Dead Moon",
    icon: "Psychic/Psychic Emanation",
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    spell: {
      name: "Voice of the Dead Moon",
      description: "Passive: Your vocal chords vibrate with vacuum frequencies. Enemies within 15 ft suffer -2 on Concentration checks and have spell ranges reduced by 10 ft.",
      flavorText: "To hear the silence is to lose the ability to speak.",
      source: "talent", class: "Lunarch", treeId: "silence_speaker",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", auraRadius: 15,
      visualTheme: "shadow", tags: ["passive", "aura", "anti-caster", "lunarch"]
    },
    rankUpgrades: [
      { description: "Aura radius extends to 20 ft and reduces enemy spell ranges by 15 ft." },
      { description: "Enemies attempting to cast spells within the aura take 2d6 wyrd damage automatically.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 }, damageTypes: ["wyrd"] }
    ]
  },
  {
    id: "lss_t1_delirium_tolerance",
    name: "Symbiotic Sanity Buffer",
    icon: "Psychic/Focused Mind",
    maxRanks: 2,
    position: { x: 3.5, y: 0 },
    requires: null,
    spell: {
      name: "Symbiotic Sanity Buffer",
      description: "Passive: Gain +3 on saving throws against Madness, Psychic, and Charm effects. The parasite absorbs mental attacks, converting them into +10 temporary HP.",
      flavorText: "You cannot drive a mind mad when something else is already eating it.",
      source: "talent", class: "Lunarch", treeId: "silence_speaker",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "shadow", tags: ["passive", "mind-ward", "temp-hp", "lunarch"]
    },
    rankUpgrades: [
      { description: "Gain complete immunity to Charm and Fear effects; mental attacks convert into +25 temporary HP." }
    ]
  },

  // ─── TIER 2 (y: 1) ───
  {
    id: "lss_t2_star_sickness_epidemic",
    name: "Star Sickness Bloom",
    icon: "Void/Mold Entity",
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: "lss_t1_silence_rend",
    spell: {
      name: "Star Sickness Bloom",
      description: "Spend 2 AP: Detonate all active Star Sickness afflictions within 40 ft: each afflicted target takes 3d8 wyrd damage and spreads Star Sickness to all adjacent creatures.",
      flavorText: "The cosmic mold blooms from one skull to the next.",
      source: "talent", class: "Lunarch", treeId: "silence_speaker",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 2, targetingMode: "aoe", rangeType: "ranged", range: 40,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 1, cooldownUnit: "round",
      resourceCosts: { mana: { baseAmount: 6 } },
      damageTypes: ["wyrd"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["aoe", "detonate", "spread", "lunarch"]
    },
    rankUpgrades: [
      { description: "Damage increases to 4d8 wyrd and afflicted enemies are Slowed by 50% for 2 rounds.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 } },
      { description: "Damage increases to 5d8 wyrd; targets afflicted take +25% damage from all spell sources.", primaryDamage: { dice: "5d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "lss_t2_null_vacuum",
    name: "Aura of Total Silence",
    icon: "Void/Black Hole",
    maxRanks: 3,
    position: { x: 2.5, y: 1 },
    requires: "lss_t1_void_resonance",
    spell: {
      name: "Aura of Total Silence",
      description: "Spend 2 AP: Create a 20 ft dome of absolute silence lasting 2 rounds. No sound or verbal spells can be cast inside or through the dome.",
      flavorText: "Sound ceases. Magic dies at the throat.",
      source: "talent", class: "Lunarch", treeId: "silence_speaker",
      spellType: "ACTIVE", category: "debuff",
      actionPoints: 2, targetingMode: "aoe", rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 3, cooldownUnit: "round",
      resourceCosts: { mana: { baseAmount: 6 } },
      visualTheme: "shadow", tags: ["dome", "silence", "anti-magic", "zone-control", "lunarch"]
    },
    rankUpgrades: [
      { description: "Dome radius extends to 25 ft and lasts 3 rounds." },
      { description: "Enemies inside the dome take 2d8 wyrd damage at the start of each of their turns.", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 }, damageTypes: ["wyrd"] }
    ]
  },

  // ─── TIER 3 (y: 2) ───
  {
    id: "lss_t3_silence_beam",
    name: "Silence Beam",
    icon: "Force/Diagonal Energy Beam",
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: "lss_t2_star_sickness_epidemic",
    spell: {
      name: "Silence Beam",
      description: "Spend 2 AP: Channel a continuous beam of void starlight 40 ft down a line: deals 4d8 wyrd damage and shreds 4 Passive DR from all enemies in the beam.",
      flavorText: "A beam of anti-matter that erases resonance.",
      source: "talent", class: "Lunarch", treeId: "silence_speaker",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 2, targetingMode: "line", rangeType: "ranged", range: 40,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 2, cooldownUnit: "round",
      resourceCosts: { mana: { baseAmount: 8 } },
      damageTypes: ["wyrd"],
      primaryDamage: { dice: "4d8", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["line", "beam", "armor-shred", "lunarch"]
    },
    rankUpgrades: [
      { description: "Damage increases to 5d8 wyrd, and beam width widens to 10 ft.", primaryDamage: { dice: "5d8", flat: 0, procChance: 100 } },
      { description: "Damage increases to 7d8 wyrd; enemies caught in the beam are Silenced for 1 round.", primaryDamage: { dice: "7d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "lss_t3_symbiote_memory_drain",
    name: "Amnesiac Siphon",
    icon: "Psychic/Mind Read",
    maxRanks: 3,
    position: { x: 2.5, y: 2 },
    requires: "lss_t2_null_vacuum",
    spell: {
      name: "Amnesiac Siphon",
      description: "Passive: During Waning Moon phase, your damaging abilities siphon memories from foes: targets lose 1 Action Point on their next turn (once per combat per enemy).",
      flavorText: "The parasite takes the memories the host lost and extracts them from the enemy instead.",
      source: "talent", class: "Lunarch", treeId: "silence_speaker",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "single",
      visualTheme: "shadow", tags: ["passive", "ap-drain", "waning-moon", "lunarch"]
    },
    rankUpgrades: [
      { description: "Siphoned AP is transferred to you (gain +1 AP on your next turn)." },
      { description: "The siphon deepens: each drained target also surrenders 2d6 wyrd damage that the parasite knits into temporary HP, and the drain triggers on every ability that hits (no longer once per combat per enemy).", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 }, damageTypes: ["wyrd"] }
    ]
  },

  // ─── TIER 4 (y: 3) ───
  {
    id: "lss_t4_binding_horror",
    name: "Binding Horror Tendrils",
    icon: "Chaos/Tendrils Chaos",
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: "lss_t3_silence_beam",
    spell: {
      name: "Binding Horror Tendrils",
      description: "Spend 2 AP: Erupt cosmic shadow tentacles in a 20 ft radius within 45 ft: deals 3d8 wyrd + 2d8 blight damage and Restrains all enemies (STR save negates Restrain).",
      flavorText: "Black starlight cords anchor the victims to the dead star.",
      source: "talent", class: "Lunarch", treeId: "silence_speaker",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 2, targetingMode: "aoe", rangeType: "ranged", range: 45,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 3, cooldownUnit: "round",
      resourceCosts: { mana: { baseAmount: 10 } },
      damageTypes: ["wyrd", "blight"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      secondaryDamage: { dice: "2d8", flat: 0, procChance: 100, damageType: "blight" },
      visualTheme: "shadow", tags: ["aoe", "restrain", "tentacles", "control", "lunarch"]
    },
    rankUpgrades: [
      { description: "Damage increases to 4d8 wyrd + 3d8 blight, and restrains last 2 rounds.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 }, secondaryDamage: { dice: "3d8", flat: 0, procChance: 100, damageType: "blight" } },
      { description: "Damage increases to 6d8 wyrd + 4d8 blight; restrained enemies take 2d8 wyrd damage whenever they attempt an action.", primaryDamage: { dice: "6d8", flat: 0, procChance: 100 }, secondaryDamage: { dice: "4d8", flat: 0, procChance: 100, damageType: "blight" } }
    ]
  },
  {
    id: "lss_t4_mind_fracture",
    name: "Cerebral Collapse",
    icon: "Psychic/Psionic Blast",
    maxRanks: 2,
    position: { x: 2.5, y: 3 },
    requires: "lss_t3_symbiote_memory_drain",
    spell: {
      name: "Cerebral Collapse",
      description: "Passive: Whenever an enemy fails a saving throw against your abilities, their Mind defense is fractured: they take +30% psychic/wyrd damage for the next 2 rounds.",
      flavorText: "Cracks in the consciousness through which the cold leaks.",
      source: "talent", class: "Lunarch", treeId: "silence_speaker",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "single",
      visualTheme: "shadow", tags: ["passive", "mind-fracture", "damage-amp", "lunarch"]
    },
    rankUpgrades: [
      { description: "Bonus damage increases to +50%; the target suffers Disadvantage on all Will saves and takes 2d6 wyrd damage at the start of each of its turns.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 }, damageTypes: ["wyrd"] }
    ]
  },

  // ─── TIER 5 (y: 4) ───
  {
    id: "lss_t5_silence_supernova",
    name: "Silence Supernova",
    icon: "Chaos/Chaotic Shadow Storm",
    maxRanks: 3,
    position: { x: 1, y: 4 },
    requires: "lss_t4_binding_horror",
    spell: {
      name: "Silence Supernova",
      description: "Spend 3 AP: Vent the parasite's void pressure in a 30 ft radius: 6d8 wyrd + 4d8 blight damage to all enemies, inflicting Mass Delirium (enemies attack random nearby creatures for 1 round).",
      flavorText: "A flash of negative light that swallows color, sound, and reason.",
      source: "talent", class: "Lunarch", treeId: "silence_speaker",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 3, targetingMode: "aoe", rangeType: "self-centered", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 3, cooldownUnit: "round",
      resourceCosts: { mana: { baseAmount: 12 } },
      damageTypes: ["wyrd", "blight"],
      primaryDamage: { dice: "6d8", flat: 0, procChance: 100 },
      secondaryDamage: { dice: "4d8", flat: 0, procChance: 100, damageType: "blight" },
      visualTheme: "shadow", tags: ["aoe", "confusion", "mass-delirium", "supernova", "lunarch"]
    },
    rankUpgrades: [
      { description: "Damage increases to 8d8 wyrd + 6d8 blight, and confusion lasts 2 rounds.", primaryDamage: { dice: "8d8", flat: 0, procChance: 100 }, secondaryDamage: { dice: "6d8", flat: 0, procChance: 100, damageType: "blight" } },
      { description: "Damage increases to 10d8 wyrd + 8d8 blight; dispels all magical buffs from all struck enemies.", primaryDamage: { dice: "10d8", flat: 0, procChance: 100 }, secondaryDamage: { dice: "8d8", flat: 0, procChance: 100, damageType: "blight" } }
    ]
  },
  {
    id: "lss_t5_cosmic_haze",
    name: "Void Shroud",
    icon: "Void/Crimson Void Hood",
    maxRanks: 2,
    position: { x: 2.5, y: 4 },
    requires: "lss_t4_mind_fracture",
    spell: {
      name: "Void Shroud",
      description: "Passive: You are shrouded in silence-light. Ranged attacks and spells targeting you from beyond 30 ft suffer Disadvantage.",
      flavorText: "To look from a distance is to see only a hole in the horizon.",
      source: "talent", class: "Lunarch", treeId: "silence_speaker",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "shadow", tags: ["passive", "ranged-defense", "blur", "lunarch"]
    },
    rankUpgrades: [
      { description: "Threshold lowers to beyond 15 ft, and you gain +4 Passive DR against magical spell damage." }
    ]
  },

  // ─── TIER 6 (y: 5) ───
  {
    id: "lss_t6_skyhole_invocation",
    name: "Skyhole Rifting",
    icon: "Void/Crimson Void Shards",
    maxRanks: 3,
    position: { x: 1, y: 5 },
    requires: "lss_t5_silence_supernova",
    spell: {
      name: "Skyhole Rifting",
      description: "Spend 3 AP: Tear open a permanent 20 ft hole to the dead moon overhead for 3 rounds. Starlight vacuum rain falls inside the zone: 8d8 wyrd damage/round and all magic within the zone is dispelled.",
      flavorText: "The sky peels open. The dead moon looks down through the hole.",
      source: "talent", class: "Lunarch", treeId: "silence_speaker",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 3, targetingMode: "aoe", rangeType: "ranged", range: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 4, cooldownUnit: "round",
      resourceCosts: { mana: { baseAmount: 14 } },
      damageTypes: ["wyrd"],
      primaryDamage: { dice: "8d8", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["aoe", "skyhole", "deadzone", "zone-denial", "lunarch"]
    },
    rankUpgrades: [
      { description: "Damage increases to 10d8 wyrd per round, and radius extends to 30 ft.", primaryDamage: { dice: "10d8", flat: 0, procChance: 100 } },
      { description: "Damage increases to 12d8 wyrd per round; enemies caught in the zone cannot leave it (vacuum barrier).", primaryDamage: { dice: "12d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "lss_t6_elder_parasite_communion",
    name: "Brood-Sibling Communion",
    icon: "Psychic/Telepathic Arcane",
    maxRanks: 2,
    position: { x: 2.5, y: 5 },
    requires: "lss_t5_cosmic_haze",
    spell: {
      name: "Brood-Sibling Communion",
      description: "Passive: The parasite communicates with its brood-siblings across the fallen star. Whenever an ally or enemy casts a spell, gain +5% bonus spell power on your next ability (stacks up to +50%).",
      flavorText: "Thousands of minds connected across the fog share the computation.",
      source: "talent", class: "Lunarch", treeId: "silence_speaker",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "shadow", tags: ["passive", "spell-power", "stacking-buff", "lunarch"]
    },
    rankUpgrades: [
      { description: "Cap increases to +100% bonus spell power, and at max stacks your next ability costs 0 Action Points." }
    ]
  },

  // ─── TIER 7 (Capstone Row, y: 6) ───
  {
    id: "lss_t7_avatar_of_absolute_silence",
    name: "Avatar of Absolute Silence",
    icon: "Necrotic/Cosmic Entity",
    maxRanks: 1,
    position: { x: 1, y: 6 },
    requires: "lss_t6_skyhole_invocation",
    spell: {
      name: "Avatar of Absolute Silence",
      description: "CAPSTONE — Spend 3 AP: Transfigure into the Embodiment of Void for 3 rounds. The entire battlefield (100 ft radius) falls into dead-moon silence: all enemy spells are countered instantly, enemies take 4d8 wyrd damage at the start of their turns, and every attack you make inflicts Star Sickness and removes 2 Action Points from the target.",
      flavorText: "The universe was silent before creation. For three rounds, it is silent again.",
      source: "talent", class: "Lunarch", treeId: "silence_speaker",
      spellType: "ACTIVE", category: "buff",
      actionPoints: 3, targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "once_per_combat", cooldownValue: 1, cooldownUnit: "combat",
      resourceCosts: { mana: { baseAmount: 15 } },
      durationRounds: 3,
      visualTheme: "shadow", tags: ["capstone", "ultimate", "universal-silence", "void", "lunarch"]
    },
    rankUpgrades: []
  },
  {
    id: "lss_t7_star_devourer_accord",
    name: "Accord of the Fallen Star",
    icon: "Necrotic/Devour",
    maxRanks: 3,
    position: { x: 2.5, y: 6 },
    requires: "lss_t6_elder_parasite_communion",
    spell: {
      name: "Accord of the Fallen Star",
      description: "Passive: All wyrd and blight damage dealt by your abilities permanently reduces the target's maximum health by the damage amount for the rest of combat.",
      flavorText: "Wounds eaten by the parasite cannot heal because the tissue was never there.",
      source: "talent", class: "Lunarch", treeId: "silence_speaker",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self",
      visualTheme: "shadow", tags: ["passive", "capstone-row", "max-hp-drain", "lunarch"]
    },
    rankUpgrades: [
      { description: "Targets whose maximum health drops below 50% from this effect are immediately executed and dissolve into starlight." },
      { description: "The execution threshold rises to 65% of maximum health, and each execution feeds you 50 temporary HP as the stolen vitality is folded into the brood." }
    ]
  },
  {
    id: "lss_t7_brood_moon_ascendant",
    name: "Brood Moon Ascendant",
    icon: "Void/Maw Gripping Fear",
    maxRanks: 5,
    position: { x: 0, y: 6 },
    requires: ["lss_t6_elder_parasite_communion", "lss_t6_skyhole_invocation"],
    spell: {
      name: "Brood Moon Ascendant",
      description: "Passive: The parasite's hunger takes lunar shape behind your ribs. Whenever you deal wyrd or blight damage, you heal 10% of the damage dealt and bank a Brood Charge (maximum 3). Your next silence ability spends every charge to deal +1d6 bonus wyrd damage per charge.",
      flavorText: "There is a second moon now, and it is inside you, and it is always hungry.",
      source: "talent", class: "Lunarch", treeId: "silence_speaker",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["wyrd"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["passive", "capstone", "lunar-hunger", "brood-charges", "lunarch"]
    },
    rankUpgrades: [
      { description: "Healing rises to 15% of damage dealt, and each Brood Charge adds +2d6 bonus wyrd damage (maximum 3 charges).", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } },
      { description: "Healing rises to 20% of damage dealt, each Brood Charge adds +3d6 bonus wyrd damage, and charges persist until spent (maximum 4).", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } },
      { description: "Healing rises to 25% of damage dealt, each Brood Charge adds +4d6 bonus wyrd damage, and at maximum charges your next silence ability also Stuns its targets for 1 round.", primaryDamage: { dice: "4d6", flat: 0, procChance: 100 } },
      { description: "Healing rises to 30% of damage dealt, each Brood Charge adds +5d6 bonus wyrd damage, and spending charges refunds 1 Action Point.", primaryDamage: { dice: "5d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "lss_t7_eclipse_of_the_dead_moon",
    name: "Eclipse of the Dead Moon",
    icon: "Arcane/Crescent Moon",
    maxRanks: 3,
    position: { x: 1.5, y: 6 },
    requires: "lss_t6_skyhole_invocation",
    spell: {
      name: "Eclipse of the Dead Moon",
      description: "Castable only during the Waning Moon. Spend 3 AP & 15 mana: Drag the dead moon across the sun and drown a 40 ft radius within 80 ft in the silence between stars: deals 6d8 wyrd + 4d8 blight damage, Silences all enemies for 1 round, and inflicts Star Sickness.",
      flavorText: "Daylight is a rumor the dead moon refuses to believe.",
      source: "talent", class: "Lunarch", treeId: "silence_speaker",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 3, targetingMode: "aoe", rangeType: "ranged", range: 80,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 5, cooldownUnit: "round",
      resourceCosts: { mana: { baseAmount: 15 }, lunar_phase: { baseAmount: 1, cost: 1, phaseRequired: "waning" } },
      damageTypes: ["wyrd", "blight"],
      primaryDamage: { dice: "6d8", flat: 0, procChance: 100 },
      secondaryDamage: { dice: "4d8", flat: 0, procChance: 100, damageType: "blight" },
      visualTheme: "shadow", tags: ["aoe", "eclipse", "silence", "star-sickness", "capstone", "lunarch"]
    },
    rankUpgrades: [
      { description: "The eclipse widens to a 50 ft radius and deals 8d8 wyrd + 5d8 blight damage; enemies caught at the center are knocked Prone.", primaryDamage: { dice: "8d8", flat: 0, procChance: 100 }, secondaryDamage: { dice: "5d8", flat: 0, procChance: 100, damageType: "blight" } },
      { description: "Radius reaches 60 ft, damage rises to 10d8 wyrd + 6d8 blight, Silence lasts 2 rounds, and Star Sickness spreads to enemies within 20 ft of every victim.", primaryDamage: { dice: "10d8", flat: 0, procChance: 100 }, secondaryDamage: { dice: "6d8", flat: 0, procChance: 100, damageType: "blight" } }
    ]
  },
  {
    id: "lss_t7_apotheosis_of_the_star_plague",
    name: "Apotheosis of the Star Plague",
    icon: "Chaos/Chaotic Corruption",
    maxRanks: 3,
    position: { x: 3, y: 6 },
    requires: "lss_t6_elder_parasite_communion",
    spell: {
      name: "Apotheosis of the Star Plague",
      description: "Passive: Your Star Sickness becomes a living plague. Whenever an afflicted enemy dies, its skull bursts: enemies within 30 ft are afflicted with Star Sickness and take 4d8 wyrd damage.",
      flavorText: "The mold does not mourn its dead. It enrolls them.",
      source: "talent", class: "Lunarch", treeId: "silence_speaker",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["wyrd"],
      primaryDamage: { dice: "4d8", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["passive", "capstone", "star-sickness", "contagion", "lunarch"]
    },
    rankUpgrades: [
      { description: "Burst radius extends to 40 ft, damage rises to 6d8 wyrd, and enemies already afflicted take double damage from the burst.", primaryDamage: { dice: "6d8", flat: 0, procChance: 100 } },
      { description: "Burst radius extends to 50 ft, damage rises to 8d8 wyrd, a burst that kills another afflicted enemy chain-bursts from it, and this Star Sickness imposes -4 on saving throws.", primaryDamage: { dice: "8d8", flat: 0, procChance: 100 } }
    ]
  }
];
