// ============================================
// PYROFIEND — WILDFIRE (v2: talents are spells)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50.
// The spread tree: fire that leaps, lingers, and multiplies.
// ============================================

export const PYROFIEND_WILDFIRE = [
  {
    id: "wf_t1_flame_spread",
    name: "Flame Spread",
    icon: "spell_fire_flare",
    maxRanks: 3,
    position: { x: 0, y: 8 },
    requires: null,
    spell: {
      name: "Flame Spread",
      description: "Abyssal fire hungers to consume all it touches. When you deal ember damage, roll 1d20: on 16+, the damage leaps to a nearby enemy for half damage.",
      flavorText: "Fire gossips.",
      source: "talent", class: "Pyrofiend", treeId: "wildfire",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["ember"],
      visualTheme: "fire", tags: ["passive", "spread", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "Abyssal fire hungers to consume all it touches. When you deal ember damage, roll 1d20: on 14+, the damage leaps to a nearby enemy for half damage." },
      { description: "Abyssal fire hungers to consume all it touches. When you deal ember damage, roll 1d20: on 12+, the damage leaps to a nearby enemy for half damage." }
    ]
  },
  {
    id: "wf_t1_ground_fire",
    name: "Ground Fire",
    icon: "spell_fire_moltenblood",
    maxRanks: 3,
    position: { x: 0.5, y: 8 },
    requires: null,
    spell: {
      name: "Ground Fire",
      description: "Where your hellfire touches the earth, it leaves a scar of living flame. Your ember spells create patches of ember terrain. Enemies entering take 1d8 ember damage.",
      flavorText: "The battlefield keeps a record of your visit.",
      source: "talent", class: "Pyrofiend", treeId: "wildfire",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["ember"],
      primaryDamage: { dice: "1d8", flat: 0, procChance: 100 },
      visualTheme: "fire", tags: ["passive", "terrain", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "Where your hellfire touches the earth, it leaves a scar of living flame. Your ember spells create patches of ember terrain. Enemies entering take 2d8 ember damage.", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 } },
      { description: "Where your hellfire touches the earth, it leaves a scar of living flame. Your ember spells create patches of ember terrain. Enemies entering take 3d8 ember damage.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "wf_t1_chain_reaction",
    name: "Chain Reaction",
    icon: "spell_fire_flare",
    maxRanks: 2,
    position: { x: 1, y: 8 },
    requires: null,
    spell: {
      name: "Chain Reaction",
      description: "Death is no end to Emberspire wildfire — only the next kindling. When a burning enemy dies, roll 1d6: on 4+, the nearest other enemy ignites (burns 1d6 ember per turn for 2 turns).",
      flavorText: "Inheritance planning, combustible edition.",
      source: "talent", class: "Pyrofiend", treeId: "wildfire",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["ember"],
      isDot: true, dotDuration: 2, dotTick: "1d6",
      visualTheme: "fire", tags: ["passive", "spread", "kill", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "Death is no end to Emberspire wildfire — only the next kindling. When a burning enemy dies, roll 1d6: on 2+, the nearest TWO enemies ignite (burn 1d6 ember per turn for 2 turns)." }
    ]
  },

  {
    id: "wf_t2_wild_growth",
    name: "Wild Growth",
    icon: "spell_fire_moltenblood",
    maxRanks: 3,
    position: { x: 0.5, y: 6.5 },
    requires: "wf_t1_flame_spread",
    spell: {
      name: "Wild Growth",
      description: "The Wyrd-touched blaze spreads without mercy. Your ground fire patches affect a 10-foot radius instead of 5.",
      flavorText: "Pruning was never on the agenda.",
      source: "talent", class: "Pyrofiend", treeId: "wildfire",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "fire", tags: ["passive", "terrain", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "The Wyrd-touched blaze spreads without mercy. Your ground fire patches affect a 15-foot radius instead of 5." },
      { description: "The Wyrd-touched blaze spreads without mercy. Your ground fire patches affect a 20-foot radius instead of 5, and each patch grows 5 feet per round as it burns." }
    ]
  },
  {
    id: "wf_t2_searing_heat",
    name: "Searing Heat",
    icon: "spell_fire_incinerate",
    maxRanks: 3,
    position: { x: 1.5, y: 6.5 },
    requires: "wf_t1_ground_fire",
    spell: {
      name: "Searing Heat",
      description: "Hellfire compounds upon itself. Enemies take 1d6 additional ember damage when they take ember damage while already burning.",
      flavorText: "Layering, the Abyssal way.",
      source: "talent", class: "Pyrofiend", treeId: "wildfire",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["ember"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "fire", tags: ["passive", "burning", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "Hellfire compounds upon itself. Enemies take 2d6 additional ember damage when they take ember damage while already burning.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } },
      { description: "Hellfire compounds upon itself. Enemies take 3d6 additional ember damage when they take ember damage while already burning.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "wf_t3_conflagration",
    name: "Conflagration",
    icon: "spell_fire_sealoffire",
    maxRanks: 3,
    position: { x: 0.5, y: 5 },
    requires: "wf_t2_wild_growth",
    spell: {
      name: "Conflagration",
      description: "The Abyss breathes out, and everything within reach is claimed. Ignite all enemies in a 25-foot radius within 60 feet: they burn for 2d6 ember damage per round for 4 rounds.",
      flavorText: "One breath. Claimed.",
      source: "talent", class: "Pyrofiend", treeId: "wildfire",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "ranged", range: 60, aoeShape: "circle", aoeSize: 25,
      castTimeType: "short", castTimeValue: 1.5,
      cooldownCategory: "medium", cooldownValue: 20, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: true,
      resourceCosts: { mana: { baseAmount: 20 } },
      damageTypes: ["ember"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      isDot: true, dotDuration: 4, dotTick: "2d6",
      visualTheme: "fire", tags: ["aoe", "dot", "ignite", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "The Abyss breathes out, and everything within reach is claimed. Ignite all enemies in a 25-foot radius within 60 feet: they burn for 3d6 ember damage per round for 4 rounds.", dotTick: "3d6" },
      { description: "The Abyss breathes out, and everything within reach is claimed. Ignite all enemies in a 35-foot radius within 60 feet: they burn for 3d6 ember damage per round for 5 rounds.", dotTick: "3d6", dotDuration: 5 }
    ]
  },
  {
    id: "wf_t3_pandemic",
    name: "Pandemic",
    icon: "spell_fire_flare",
    maxRanks: 3,
    position: { x: 2, y: 5 },
    requires: "wf_t2_searing_heat",
    spell: {
      name: "Pandemic",
      description: "Your fire spreads like a Wyrd-touched contagion. When one of your ember damage-over-time effects ticks, roll 1d6: on 4+, it infects a nearby enemy with the same burn.",
      flavorText: "Contagious is an understatement. It is ambitious.",
      source: "talent", class: "Pyrofiend", treeId: "wildfire",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", damageTypes: ["ember"],
      visualTheme: "fire", tags: ["passive", "spread", "dot", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "Your fire spreads like a Wyrd-touched contagion. When one of your ember damage-over-time effects ticks, roll 1d6: on 3+, it infects a nearby enemy with the same burn." },
      { description: "Your fire spreads like a Wyrd-touched contagion. When one of your ember damage-over-time effects ticks, roll 1d6: on 2+, it infects a nearby enemy with the same burn." }
    ]
  },

  {
    id: "wf_t4_lingering_flames",
    name: "Lingering Flames",
    icon: "spell_fire_burnout",
    maxRanks: 3,
    position: { x: 1, y: 3.5 },
    requires: "wf_t3_conflagration",
    spell: {
      name: "Lingering Flames",
      description: "Hellfire clings to the soul. Your ember damage-over-time effects reduce enemy movement speed by 5 feet.",
      flavorText: "Leaving was an option. Not anymore.",
      source: "talent", class: "Pyrofiend", treeId: "wildfire",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", damageTypes: ["ember"],
      visualTheme: "fire", tags: ["passive", "slow", "dot", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "Hellfire clings to the soul. Your ember damage-over-time effects reduce enemy movement speed by 10 feet." },
      { description: "Hellfire clings to the soul. Your ember damage-over-time effects reduce enemy movement speed by 15 feet and impose disadvantage on their Dexterity saves." }
    ]
  },
  {
    id: "wf_t4_burn_out",
    name: "Burn Out",
    icon: "spell_fire_burnout",
    maxRanks: 2,
    position: { x: 3, y: 3.5 },
    requires: "wf_t3_pandemic",
    spell: {
      name: "Burn Out",
      description: "Even as the flame dies, it takes one last vengeful breath. When your ember DoT effects expire on an enemy, roll 1d6: on 5+, the target explodes for 2d6 ember damage.",
      flavorText: "The goodbye tour is explosive.",
      source: "talent", class: "Pyrofiend", treeId: "wildfire",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["ember"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      visualTheme: "fire", tags: ["passive", "explosion", "dot", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "Even as the flame dies, it takes one last vengeful breath. When your ember DoT effects expire on an enemy, roll 1d6: on 3+, the target explodes for 3d6 ember damage.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "wf_t5_firestorm",
    name: "Firestorm",
    icon: "spell_fire_selfdestruct",
    maxRanks: 3,
    position: { x: 1.5, y: 2 },
    requires: "wf_t4_lingering_flames",
    spell: {
      name: "Firestorm",
      description: "Emberspire rains destruction from above. Call a storm of fire in a 30-foot radius within 90 feet: it deals 3d8 ember damage per round for 3 rounds.",
      flavorText: "Weather advisory: everything.",
      source: "talent", class: "Pyrofiend", treeId: "wildfire",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "ranged", range: 90, aoeShape: "circle", aoeSize: 30,
      castTimeType: "short", castTimeValue: 2,
      cooldownCategory: "long", cooldownValue: 40, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: true,
      resourceCosts: { mana: { baseAmount: 30 } },
      durationRounds: 3, durationRealTime: 18, durationUnit: "seconds",
      damageTypes: ["ember"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      isDot: true, dotDuration: 3, dotTick: "3d8",
      visualTheme: "fire", tags: ["aoe", "storm", "dot", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "Emberspire rains destruction from above. Call a storm of fire in a 40-foot radius within 90 feet: it deals 4d8 ember damage per round for 3 rounds.", dotTick: "4d8" },
      { description: "Emberspire rains destruction from above. Call a storm of fire in a 40-foot radius within 90 feet: it deals 4d8 ember damage per round for 4 rounds, and the ground it scorches becomes ember terrain.", dotTick: "4d8", dotDuration: 4 }
    ]
  },
  {
    id: "wf_t5_world_fire",
    name: "World on Fire",
    icon: "spell_fire_moltenblood",
    maxRanks: 2,
    position: { x: 3.5, y: 2 },
    requires: "wf_t4_burn_out",
    spell: {
      name: "World on Fire",
      description: "Emberspire's domain is a single unbroken sea of flame. All your ground fire patches are connected: moving between patches costs enemies double movement and deals 1d8 ember damage.",
      flavorText: "One carpet. Wall to wall.",
      source: "talent", class: "Pyrofiend", treeId: "wildfire",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", damageTypes: ["ember"],
      primaryDamage: { dice: "1d8", flat: 0, procChance: 100 },
      visualTheme: "fire", tags: ["passive", "terrain", "zone", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "Emberspire's domain is a single unbroken sea of flame. All your ground fire patches are connected: moving between patches costs enemies triple movement and deals 2d8 ember damage.", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "wf_t6_calamity",
    name: "Calamity",
    icon: "spell_fire_selfdestruct",
    maxRanks: 1,
    position: { x: 1, y: 1 },
    requires: "wf_t5_firestorm",
    spell: {
      name: "Calamity",
      description: "The Abyss yawns open, spilling its infinite wrath. Once per combat, create a field of endless flame in a 50-foot radius for 1 minute: enemies take 3d6 ember damage per round.",
      flavorText: "Reserved seating. Everyone attends.",
      source: "talent", class: "Pyrofiend", treeId: "wildfire",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 50,
      castTimeType: "short", castTimeValue: 2,
      cooldownCategory: "long", cooldownValue: 120, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: false, interruptible: true,
      resourceCosts: { mana: { baseAmount: 40 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      damageTypes: ["ember"],
      primaryDamage: { dice: "3d6", flat: 0, procChance: 100 },
      isDot: true, dotDuration: 6, dotTick: "3d6",
      visualTheme: "fire", tags: ["field", "aoe", "pyrofiend"]
    }
  },
  {
    id: "wf_t6_combustion_wave",
    name: "Combustion Wave",
    icon: "spell_fire_incinerate",
    maxRanks: 2,
    position: { x: 2.5, y: 1 },
    requires: "wf_t5_firestorm",
    spell: {
      name: "Combustion Wave",
      description: "A wall of Abyssal fire surges forward. Unleash a 60-foot line of flame dealing 6d6 ember damage; enemies hit also burn for 2d6 ember per turn for 3 rounds.",
      flavorText: "The tide, but opinionated.",
      source: "talent", class: "Pyrofiend", treeId: "wildfire",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 60, aoeShape: "line", aoeSize: 60,
      castTimeType: "short", castTimeValue: 1.5,
      cooldownCategory: "long", cooldownValue: 30, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: true,
      resourceCosts: { mana: { baseAmount: 25 } },
      damageTypes: ["ember"],
      primaryDamage: { dice: "6d6", flat: 0, procChance: 100 },
      isDot: true, dotDuration: 3, dotTick: "2d6",
      visualTheme: "fire", tags: ["line", "aoe", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "A wall of Abyssal fire surges forward. Unleash a 60-foot line of flame dealing 8d6 ember damage; enemies hit also burn for 3d6 ember per turn for 3 rounds and are knocked prone.", primaryDamage: { dice: "8d6", flat: 0, procChance: 100 }, dotTick: "3d6" }
    ]
  },
  {
    id: "wf_t6_eternal_flame",
    name: "Eternal Flame",
    icon: "spell_fire_twilightflamebreath",
    maxRanks: 2,
    position: { x: 4, y: 1 },
    requires: "wf_t5_world_fire",
    spell: {
      name: "Eternal Flame",
      description: "A Wyrd-touched pact not even the spirits can break. Your fire effects cannot be extinguished by any means; they persist until their duration ends naturally.",
      flavorText: "'Put it out' was a request. Denied.",
      source: "talent", class: "Pyrofiend", treeId: "wildfire",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["ember"],
      visualTheme: "fire", tags: ["passive", "persistence", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "A Wyrd-touched pact not even the spirits can break. Your fire effects cannot be extinguished by any means, and their durations are increased by 1 round." }
    ]
  },

  {
    id: "wf_t7_apocalypse",
    name: "Apocalypse",
    icon: "spell_fire_soulburn",
    maxRanks: 1,
    position: { x: 1, y: 0 },
    requires: "wf_t6_calamity",
    spell: {
      name: "Apocalypse",
      description: "ULTIMATE: The Abyss claims all — Emberspire's final judgment raining hellfire upon reality. Transform the battlefield into a hellscape for 1 minute: all enemies within 100 feet take 4d8 ember damage per round, and ember terrain blooms under every square yard.",
      flavorText: "After this, maps need updating.",
      source: "talent", class: "Pyrofiend", treeId: "wildfire",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 100,
      castTimeType: "short", castTimeValue: 3,
      cooldownCategory: "long", cooldownValue: 300, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: false, interruptible: true,
      resourceCosts: { mana: { baseAmount: 50 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      damageTypes: ["ember"],
      primaryDamage: { dice: "4d8", flat: 0, procChance: 100 },
      isDot: true, dotDuration: 6, dotTick: "4d8",
      visualTheme: "fire", tags: ["ultimate", "capstone", "battlefield", "pyrofiend"]
    }
  },
  {
    id: "wf_t7_ash_everywhere",
    name: "Ash Everywhere",
    icon: "spell_fire_moltenblood",
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: "wf_t6_combustion_wave",
    spell: {
      name: "Ash Everywhere",
      description: "What burns stays burned. The radius of all your ember terrain and zones is increased by 25%.",
      flavorText: "Renovation by fire. Permanent collection.",
      source: "talent", class: "Pyrofiend", treeId: "wildfire",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "fire", tags: ["passive", "capstone", "terrain", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "What burns stays burned. The radius of all your ember terrain and zones is increased by 50%." },
      { description: "What burns stays burned. The radius of all your ember terrain and zones is increased by 75%." },
      { description: "What burns stays burned. The radius of all your ember terrain and zones is increased by 100%." },
      { description: "What burns stays burned. The radius of all your ember terrain and zones is doubled, and their durations are increased by 1 round." }
    ]
  },
  {
    id: "wf_t7_second_combustion",
    name: "Second Combustion",
    icon: "spell_fire_burnout",
    maxRanks: 3,
    position: { x: 3, y: 0 },
    requires: "wf_t6_combustion_wave",
    spell: {
      name: "Second Combustion",
      description: "Ash rekindles on command. Once per turn when an enemy resists or avoids your ember damage, they take 25% of it anyway as unavoidable scorching.",
      flavorText: "Dodging only works the first time.",
      source: "talent", class: "Pyrofiend", treeId: "wildfire",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["ember"],
      visualTheme: "fire", tags: ["passive", "capstone", "pierce", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "Ash rekindles on command. Once per turn when an enemy resists or avoids your ember damage, they take 50% of it anyway as unavoidable scorching." },
      { description: "Ash rekindles on command. When an enemy resists or avoids your ember damage, they take 50% of it anyway as unavoidable scorching, and scorching ignites them (1d6 ember/turn, 2 turns).", isDot: true, dotDuration: 2, dotTick: "1d6" }
    ]
  },
  {
    id: "wf_t7_draft_of_the_abyss",
    name: "Draft of the Abyss",
    icon: "spell_fire_flare",
    maxRanks: 3,
    position: { x: 4, y: 0 },
    requires: "wf_t6_eternal_flame",
    spell: {
      name: "Draft of the Abyss",
      description: "The Abyss exhales through your works. All your ember damage-over-time effects tick one additional time over their duration.",
      flavorText: "Interest, compounded in fire.",
      source: "talent", class: "Pyrofiend", treeId: "wildfire",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["ember"],
      visualTheme: "fire", tags: ["passive", "capstone", "dot", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "The Abyss exhales through your works. All your ember damage-over-time effects tick one additional time, and each tick deals 10% more damage." },
      { description: "The Abyss exhales through your works. All your ember damage-over-time effects tick two additional times, and each tick deals 10% more damage." }
    ]
  },
  {
    id: "wf_t7_ember_leap",
    name: "Ember Leap",
    icon: "spell_fire_selfdestruct",
    maxRanks: 3,
    position: { x: 0.5, y: 0.5 },
    requires: "wf_t6_eternal_flame",
    spell: {
      name: "Ember Leap",
      description: "Flame Spread leaps farther and bites harder. Flame Spread can leap to enemies up to 30 feet away and the leapt damage increases to 75% of the original.",
      flavorText: "Six degrees of separation, combustible version.",
      source: "talent", class: "Pyrofiend", treeId: "wildfire",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["ember"],
      visualTheme: "fire", tags: ["passive", "capstone", "spread", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "Flame Spread leaps farther and bites harder. Flame Spread can leap to enemies up to 45 feet away, and the leapt damage increases to 100% of the original." },
      { description: "Flame Spread leaps farther and bites harder. Flame Spread can leap twice per trigger — each new victim can seed the next leap at 75% damage." }
    ]
  }
];
