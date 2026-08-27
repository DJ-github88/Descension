// ============================================
// LUNARCH — HOLLOW SENTINEL (v2: talents are spells)
// Spec: Starlight Sockets, Precision Ranged Sniping, Armor Bypass, Full Moon Delirium Crits
// Resource: Lunar Phases (New Moon -> Waxing -> Full Moon -> Waning)
// ============================================

export const LUNARCH_HOLLOW_SENTINEL = [
  // ─── TIER 1 (y: 0) ───
  {
    id: "lhs_t1_starlight_sockets",
    name: "Starlight Sockets",
    icon: "ability_hunter_snipershot",
    maxRanks: 3,
    position: { x: 0.5, y: 0 },
    requires: null,
    spell: {
      name: "Starlight Sockets",
      description: "Passive: The parasite hollows out your eyes with condensed starlight. Your ranged attacks ignore 25% of the target's DR. During Full Moon, critical hits deal +2d6 bonus wyrd damage.",
      flavorText: "He sees through bone and stone into the soft marrow beneath.",
      source: "talent", class: "Lunarch", treeId: "hollow_sentinel",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["wyrd"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      visualTheme: "arcane", tags: ["passive", "armor-ignore", "crit-bonus", "lunarch"]
    },
    rankUpgrades: [
      { description: "Ranged attacks ignore 35% of target's DR; bonus wyrd damage on crits increases to +3d6.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } },
      { description: "Ranged attacks ignore 50% of target's DR; bonus wyrd damage on crits increases to +4d6 and reveals hidden targets.", primaryDamage: { dice: "4d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "lhs_t1_parasitic_bolt",
    name: "Parasitic Starlight Bolt",
    icon: "spell_arcane_starfire",
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    spell: {
      name: "Parasitic Starlight Bolt",
      description: "Spend 1 AP: Fire a high-velocity needle of parasitic light up to 60 ft: deals 1d10 piercing + 1d6 wyrd damage. Ignores half-cover.",
      flavorText: "The parasite calculates trajectory through non-Euclidean angles.",
      source: "talent", class: "Lunarch", treeId: "hollow_sentinel",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 1, targetingMode: "single", rangeType: "ranged", range: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 0, cooldownUnit: "round",
      damageTypes: ["stabbing", "wyrd"],
      primaryDamage: { dice: "1d10", flat: 0, procChance: 100 },
      secondaryDamage: { dice: "1d6", flat: 0, procChance: 100, damageType: "wyrd" },
      visualTheme: "arcane", tags: ["ranged", "needle", "builder", "lunarch"]
    },
    rankUpgrades: [
      { description: "Damage increases to 2d8 piercing + 1d8 wyrd, and range extends to 80 ft.", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 }, secondaryDamage: { dice: "1d8", flat: 0, procChance: 100, damageType: "wyrd" } },
      { description: "Damage increases to 2d10 piercing + 2d6 wyrd; critical hits grant an immediate free phase advance.", primaryDamage: { dice: "2d10", flat: 0, procChance: 100 }, secondaryDamage: { dice: "2d6", flat: 0, procChance: 100, damageType: "wyrd" } }
    ]
  },
  {
    id: "lhs_t1_phase_glimmer",
    name: "Cold-Silver Vision",
    icon: "spell_holy_mindvision",
    maxRanks: 2,
    position: { x: 3.5, y: 0 },
    requires: null,
    spell: {
      name: "Cold-Silver Vision",
      description: "Passive: Gain darkvision up to 90 ft. You can see invisible and concealed creatures within 30 ft as glowing silver outlines.",
      flavorText: "Darkness is merely starlight waiting to be catalogued.",
      source: "talent", class: "Lunarch", treeId: "hollow_sentinel",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self",
      visualTheme: "arcane", tags: ["passive", "truesight", "perception", "lunarch"]
    },
    rankUpgrades: [
      { description: "True sight range extends to 60 ft; you gain Advantage on all Perception and ranged attack rolls against obscured targets." }
    ]
  },

  // ─── TIER 2 (y: 1) ───
  {
    id: "lhs_t2_hollow_mark",
    name: "Hollow Mark",
    icon: "ability_hunter_snipershot",
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: "lhs_t1_starlight_sockets",
    spell: {
      name: "Hollow Mark",
      description: "Spend 1 AP: Mark an enemy within 60 ft for 3 rounds. The marked creature is visible through walls and takes +1d8 wyrd/ember damage from all your attacks.",
      flavorText: "The parasite fixes its gaze. There is nowhere left to hide.",
      source: "talent", class: "Lunarch", treeId: "hollow_sentinel",
      spellType: "ACTIVE", category: "debuff",
      actionPoints: 1, targetingMode: "single", rangeType: "ranged", range: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 1, cooldownUnit: "round",
      damageTypes: ["wyrd"],
      primaryDamage: { dice: "1d8", flat: 0, procChance: 100 },
      visualTheme: "arcane", tags: ["mark", "wall-hack", "damage-amp", "lunarch"]
    },
    rankUpgrades: [
      { description: "Bonus damage increases to +2d8 wyrd/ember, and marked targets suffer -2 to all saving throws.", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 } },
      { description: "Bonus damage increases to +3d8 wyrd/ember; attacks against marked targets have doubled critical threat range." }
    ]
  },
  {
    id: "lhs_t2_crescent_scalpel",
    name: "Crescent Scalpel",
    icon: "spell_arcane_starfire",
    maxRanks: 3,
    position: { x: 2.5, y: 1 },
    requires: "lhs_t1_parasitic_bolt",
    spell: {
      name: "Crescent Scalpel",
      description: "Spend 2 AP: Fire a curved crescent blade of condensed gravity 60 ft down a line: deals 3d8 slashing + 2d6 arcane damage, piercing through all enemies in its path.",
      flavorText: "A curved edge of vacuum that cuts between atoms.",
      source: "talent", class: "Lunarch", treeId: "hollow_sentinel",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 2, targetingMode: "line", rangeType: "ranged", range: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 1, cooldownUnit: "round",
      damageTypes: ["slicing", "arcane"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      secondaryDamage: { dice: "2d6", flat: 0, procChance: 100, damageType: "arcane" },
      visualTheme: "arcane", tags: ["line", "aoe", "piercing", "lunarch"]
    },
    rankUpgrades: [
      { description: "Damage increases to 4d8 slashing + 3d6 arcane, and applies a 1d8 Bleed for 2 rounds.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 }, secondaryDamage: { dice: "3d6", flat: 0, procChance: 100, damageType: "arcane" } },
      { description: "Damage increases to 5d10 slashing + 4d6 arcane; enemies hit have their movement speed halved for 2 rounds.", primaryDamage: { dice: "5d10", flat: 0, procChance: 100 }, secondaryDamage: { dice: "4d6", flat: 0, procChance: 100, damageType: "arcane" } }
    ]
  },

  // ─── TIER 3 (y: 2) ───
  {
    id: "lhs_t3_full_moon_delirium",
    name: "Sanity Erosion Execution",
    icon: "spell_shadow_mindflay",
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: "lhs_t2_hollow_mark",
    spell: {
      name: "Sanity Erosion Execution",
      description: "Passive: During Full Moon phase, your ranged critical strikes bypass 100% of physical and magical armor, dealing pure true damage.",
      flavorText: "When the moon is full, the skull is empty and the shot is absolute.",
      source: "talent", class: "Lunarch", treeId: "hollow_sentinel",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "arcane", tags: ["passive", "full-moon", "true-damage", "lunarch"]
    },
    rankUpgrades: [
      { description: "During Full Moon, your ranged critical strike chance is increased by +25%." },
      { description: "During Full Moon, your ranged critical strikes also stun the target for 1 round." }
    ]
  },
  {
    id: "lhs_t3_parasitic_stride",
    name: "Parasitic Phase Shift",
    icon: "spell_arcane_blink",
    maxRanks: 2,
    position: { x: 2.5, y: 2 },
    requires: "lhs_t2_crescent_scalpel",
    spell: {
      name: "Parasitic Phase Shift",
      description: "Spend 1 AP: Teleport instantly 30 ft along moonlight lines. You leave behind a decoy starlight clone that distracts enemies for 1 round.",
      flavorText: "Fold the distance between pulses of the symbiote.",
      source: "talent", class: "Lunarch", treeId: "hollow_sentinel",
      spellType: "ACTIVE", category: "utility",
      actionPoints: 1, targetingMode: "position", rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 2, cooldownUnit: "round",
      visualTheme: "arcane", tags: ["teleport", "decoy", "mobility", "lunarch"]
    },
    rankUpgrades: [
      { description: "Teleport range extends to 45 ft; when the decoy expires or is hit, it explodes for 3d8 wyrd damage in 10 ft.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } }
    ]
  },

  // ─── TIER 4 (y: 3) ───
  {
    id: "lhs_t4_orbital_lance",
    name: "Orbital Starlight Lance",
    icon: "spell_holy_searinglight",
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: "lhs_t3_full_moon_delirium",
    spell: {
      name: "Orbital Starlight Lance",
      description: "Spend 2 AP: Channel for a heartbeat, then fire a blinding starlight spear up to 100 ft: deals 5d10 piercing + 3d8 wyrd damage. Automatically scores a critical hit if target has Hollow Mark.",
      flavorText: "A pinpoint needle dropped from orbit through the target's crown.",
      source: "talent", class: "Lunarch", treeId: "hollow_sentinel",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 2, targetingMode: "single", rangeType: "ranged", range: 100,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 2, cooldownUnit: "round",
      damageTypes: ["stabbing", "wyrd"],
      primaryDamage: { dice: "5d10", flat: 0, procChance: 100 },
      secondaryDamage: { dice: "3d8", flat: 0, procChance: 100, damageType: "wyrd" },
      visualTheme: "arcane", tags: ["snipe", "auto-crit", "burst", "lunarch"]
    },
    rankUpgrades: [
      { description: "Damage increases to 7d10 piercing + 4d8 wyrd, and pierces through solid obstacles without losing damage.", primaryDamage: { dice: "7d10", flat: 0, procChance: 100 }, secondaryDamage: { dice: "4d8", flat: 0, procChance: 100, damageType: "wyrd" } },
      { description: "Damage increases to 9d10 piercing + 6d8 wyrd; targets killed by the lance evaporate into starlight dust.", primaryDamage: { dice: "9d10", flat: 0, procChance: 100 }, secondaryDamage: { dice: "6d8", flat: 0, procChance: 100, damageType: "wyrd" } }
    ]
  },
  {
    id: "lhs_t4_alien_geometry",
    name: "Alien Geometry Angles",
    icon: "spell_arcane_starfire",
    maxRanks: 3,
    position: { x: 2.5, y: 3 },
    requires: "lhs_t3_parasitic_stride",
    spell: {
      name: "Alien Geometry Angles",
      description: "Passive: Your ranged attacks can ricochet off terrain, walls, and obstacles at impossible 90-degree angles to hit targets behind full cover.",
      flavorText: "The parasite does not believe in corners.",
      source: "talent", class: "Lunarch", treeId: "hollow_sentinel",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self",
      visualTheme: "arcane", tags: ["passive", "ricochet", "cover-ignore", "lunarch"]
    },
    rankUpgrades: [
      { description: "Ricocheting attacks gain +2d6 bonus damage per bounce (up to 2 bounces).", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } },
      { description: "Ricocheting attacks gain +4d6 bonus damage per bounce and can ricochet up to 3 times.", primaryDamage: { dice: "4d6", flat: 0, procChance: 100 } }
    ]
  },

  // ─── TIER 5 (y: 4) ───
  {
    id: "lhs_t5_parasitic_execution",
    name: "Symbiote Overclock",
    icon: "spell_shadow_shadowform",
    maxRanks: 3,
    position: { x: 1, y: 4 },
    requires: "lhs_t4_orbital_lance",
    spell: {
      name: "Symbiote Overclock",
      description: "Passive: Landing a ranged critical hit reduces the cooldown on all Lunarch abilities by 1 round and grants +10 ft movement speed for 1 round.",
      flavorText: "The symbiote feeds on precise violence, pulsing endorphins into dead nerves.",
      source: "talent", class: "Lunarch", treeId: "hollow_sentinel",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "arcane", tags: ["passive", "cd-reduction", "speed", "lunarch"]
    },
    rankUpgrades: [
      { description: "Cooldown reduction increases to 2 rounds on critical hits." },
      { description: "Critical hits also refund 1 Action Point (once per round)." }
    ]
  },
  {
    id: "lhs_t5_waning_veil",
    name: "Waning Phase Invisibility",
    icon: "ability_stealth",
    maxRanks: 2,
    position: { x: 2.5, y: 4 },
    requires: "lhs_t4_alien_geometry",
    spell: {
      name: "Waning Phase Invisibility",
      description: "Passive: During Waning Moon phase, you become completely invisible while stationary and gain +50% critical strike chance on attacks breaking stealth.",
      flavorText: "When the moon wanes, the host fades into the shadow it casts.",
      source: "talent", class: "Lunarch", treeId: "hollow_sentinel",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "shadow", tags: ["passive", "stealth", "crit-opener", "lunarch"]
    },
    rankUpgrades: [
      { description: "Invisibility persists while moving at normal speed, and attacks breaking stealth deal +4d8 bonus wyrd damage.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 } }
    ]
  },

  // ─── TIER 6 (y: 5) ───
  {
    id: "lhs_t6_constellation_sniping",
    name: "Constellation Gridlock",
    icon: "spell_arcane_starfire",
    maxRanks: 3,
    position: { x: 1, y: 5 },
    requires: "lhs_t5_parasitic_execution",
    spell: {
      name: "Constellation Gridlock",
      description: "Spend 3 AP: Inscribe a starlight constellation across 5 targets within 60 ft: each target takes 6d8 wyrd + 4d6 piercing damage, and silver laser tethers bind them together dealing 2d6 wyrd damage whenever any target moves.",
      flavorText: "Draw lines between stars. The target is merely one of the nodes.",
      source: "talent", class: "Lunarch", treeId: "hollow_sentinel",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 3, targetingMode: "chain", rangeType: "ranged", range: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 3, cooldownUnit: "round",
      damageTypes: ["wyrd", "stabbing"],
      primaryDamage: { dice: "6d8", flat: 0, procChance: 100 },
      secondaryDamage: { dice: "4d6", flat: 0, procChance: 100, damageType: "stabbing" },
      visualTheme: "arcane", tags: ["multi-target", "tether", "burst", "lunarch"]
    },
    rankUpgrades: [
      { description: "Damage increases to 8d8 wyrd + 6d6 piercing, and tether damage increases to 3d6 wyrd.", primaryDamage: { dice: "8d8", flat: 0, procChance: 100 }, secondaryDamage: { dice: "6d6", flat: 0, procChance: 100, damageType: "stabbing" } },
      { description: "Damage increases to 10d8 wyrd + 8d6 piercing; killing any node immediately detonates the remaining nodes for 4d8 wyrd in 15 ft.", primaryDamage: { dice: "10d8", flat: 0, procChance: 100 }, secondaryDamage: { dice: "8d6", flat: 0, procChance: 100, damageType: "stabbing" } }
    ]
  },
  {
    id: "lhs_t6_phase_mastery",
    name: "Forced Lunar Transition",
    icon: "spell_holy_borrowedtime",
    maxRanks: 2,
    position: { x: 2.5, y: 5 },
    requires: "lhs_t5_waning_veil",
    spell: {
      name: "Forced Lunar Transition",
      description: "Spend 1 AP: Manually advance or rewind the Lunar Phase by 1 step without suffering transition shock damage.",
      flavorText: "Press hand against skull. Force the parasite to look at another star.",
      source: "talent", class: "Lunarch", treeId: "hollow_sentinel",
      spellType: "ACTIVE", category: "utility",
      actionPoints: 1, targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 2, cooldownUnit: "round",
      visualTheme: "arcane", tags: ["phase-control", "tactical", "lunarch"]
    },
    rankUpgrades: [
      { description: "Cooldown reduced to 1 round; manually entering Full Moon grants +2 AP on the current turn." }
    ]
  },

  // ─── TIER 7 (Capstone Row, y: 6) ───
  {
    id: "lhs_t7_avatar_of_the_hollow_eye",
    name: "Avatar of the Hollow Starlight Eye",
    icon: "spell_shadow_mindtwisting",
    maxRanks: 1,
    position: { x: 1, y: 6 },
    requires: "lhs_t6_constellation_sniping",
    spell: {
      name: "Avatar of the Hollow Starlight Eye",
      description: "CAPSTONE — Spend 3 AP: The parasite fully colonizes vision for 3 rounds. Gain infinite range on all ranged abilities, shoot through any thickness of walls or terrain without penalty, all ranged attacks become automatic critical hits, and targets hit take +50% true damage as they glimpse the cold cosmos.",
      flavorText: "There are no walls in the cosmos. There is only target and execution.",
      source: "talent", class: "Lunarch", treeId: "hollow_sentinel",
      spellType: "ACTIVE", category: "buff",
      actionPoints: 3, targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "once_per_combat", cooldownValue: 1, cooldownUnit: "combat",
      durationRounds: 3,
      visualTheme: "arcane", tags: ["capstone", "ultimate", "infinite-range", "auto-crit", "lunarch"]
    },
    rankUpgrades: []
  },
  {
    id: "lhs_t7_cosmic_singularity",
    name: "Cosmic Needle Collapse",
    icon: "spell_arcane_starfire",
    maxRanks: 2,
    position: { x: 2.5, y: 6 },
    requires: "lhs_t6_phase_mastery",
    spell: {
      name: "Cosmic Needle Collapse",
      description: "Passive: Scoring a killing blow with a ranged attack collapses the target into a gravitational singularity: pulls all enemies within 25 ft toward the corpse and deals 4d8 wyrd damage.",
      flavorText: "The wound leaves a hole in reality that the air rushes to fill.",
      source: "talent", class: "Lunarch", treeId: "hollow_sentinel",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "ground", damageTypes: ["wyrd"],
      primaryDamage: { dice: "4d8", flat: 0, procChance: 100 },
      visualTheme: "arcane", tags: ["passive", "capstone-row", "gravity-pull", "collapse", "lunarch"]
    },
    rankUpgrades: [
      { description: "Singularity radius extends to 35 ft, damage increases to 6d8 wyrd, and pulled enemies are knocked Prone.", primaryDamage: { dice: "6d8", flat: 0, procChance: 100 } }
    ]
  }
];
