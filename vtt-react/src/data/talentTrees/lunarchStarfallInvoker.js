// ============================================
// LUNARCH — STARFALL INVOKER (v3: spec identity redesign)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50.
//
// SPEC IDENTITY: The Celestial Artillery / Lunar Bombardment Archmage.
// While Moonlight Sentinel fights with radiant blades and Moonwell Guardian nurtures,
// Starfall Invoker calls down orbital catastrophes: raining meteors, anchoring gravity
// wells, detonating supernovas, and manipulating lunar phases to maximize area devastation.
//
// SIGNATURE ACTIVES:
//   - Starfall (t1):              Call down lunar meteors in a target area
//   - Celestial Beam (t2):        Orbital pillar of lunar fire searing a line of foes
//   - Gravity Singularity (t3):   Collapsing star vortex pulling enemies to its center
//   - Cosmic Flare (t4):          Blinding burst of radiant starlight disorienting all foes
//   - Cosmic Overload (t5):       Overcharge the sky to detonate 3 simultaneous Starfalls
//   - Meteor Cataclysm (t6):      Gigantic apocalyptic meteor strike
//   - Supernova Ascent (t7):      ULTIMATE — Transform into a living star raining endless orbital bombardment
// ============================================

export const LUNARCH_STARFALL_INVOKER = [
  // ──────────────── TIER 1 (8 pts) ────────────────
  {
    id: "sf_t1_starfall",
    name: "Starfall",
    icon: "spell_nature_starfall",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Starfall",
      description: "Call down a barrage of lunar meteors on a 20-foot area within 90 feet: deals 1d6 sacred/arcane damage and slows enemies by 10ft for 1 round.",
      flavorText: "The sky throws stones. You chose where.",
      source: "talent", class: "Lunarch", treeId: "starfall_invoker",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "ranged", range: 90, aoeShape: "circle", aoeSize: 20,
      castTimeType: "short", castTimeValue: 1,
      cooldownCategory: "short", cooldownValue: 8, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: true,
      resourceCosts: { mana: { baseAmount: 6 } },
damageTypes: ["sacred", "arcane"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "arcane", tags: ["aoe", "meteor", "lunarch"]
    },
    rankUpgrades: [
      { description: "25-foot area deals 1d8 sacred/arcane damage and knocks enemies prone.", primaryDamage: { dice: "1d8", flat: 0, procChance: 100 }, aoeSize: 25, debuffs: ["prone"] },
      { description: "30-foot area deals 2d6 damage, knocks prone, and leaves a starlight burn dealing 1d6 per round for 2 rounds.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 }, aoeSize: 30 }
    ]
  },
  {
    id: "sf_t1_cosmic_attunement",
    name: "Cosmic Amplification",
    icon: "spell_arcane_starfire",
    maxRanks: 3,
    position: { x: 2.5, y: 0 },
    requires: null,
    spell: {
      name: "Cosmic Amplification",
      description: "All your area-of-effect spells have their radius increased by +10 feet and their casting ranges increased by +20 feet.",
      flavorText: "You and the firmament exchange letters.",
      source: "talent", class: "Lunarch", treeId: "starfall_invoker",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "aoe-radius", "lunarch"]
    },
    rankUpgrades: [
      { description: "AoE radius +15 feet, range +30 feet, and AoE spells deal +15 points bonus damage." },
      { description: "AoE radius +20 feet, range +40 feet, +25 points bonus damage, and ignores 4 Damage Reduction against magical." }
    ]
  },
  {
    id: "sf_t1_meteor_shower",
    name: "Stellar Shrapnel",
    icon: "spell_fire_meteorstorm",
    maxRanks: 2,
    position: { x: 4, y: 0 },
    requires: null,
    spell: {
      name: "Stellar Shrapnel",
      description: "Whenever an enemy takes damage from Starfall, 2 secondary meteors break off, dealing 1d6 arcane damage to adjacent foes.",
      flavorText: "Why one crater when several are available?",
      source: "talent", class: "Lunarch", treeId: "starfall_invoker",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["arcane"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "arcane", tags: ["passive", "shrapnel", "chain", "lunarch"]
    },
    rankUpgrades: [
      { description: "4 secondary meteors break off for 2d6 arcane damage each, and their critical hits grant you 5 mana.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } }
    ]
  },

  // ──────────────── TIER 2 (6 pts) ────────────────
  {
    id: "sf_t2_celestial_beam",
    name: "Celestial Beam",
    icon: "spell_arcane_starfire",
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: "sf_t1_starfall",
    spell: {
      name: "Celestial Beam",
      description: "Channel a focused orbital beam of pure lunar energy in a 40-foot line: deals 2d6 sacred damage to all enemies in the beam and burns them for 1d6 per round for 2 rounds.",
      flavorText: "A column of light that leaves glass where soil once was.",
      source: "talent", class: "Lunarch", treeId: "starfall_invoker",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "line", aoeSize: 40,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 10, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 8 } },
      damageTypes: ["sacred"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      visualTheme: "arcane", tags: ["line", "orbital-beam", "burn", "lunarch"]
    },
    rankUpgrades: [
      { description: "50-foot beam deals 2d8 sacred damage, ignores up to 4 points of enemy Armor/resistance, and burns for 1d6 per round.", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 }, aoeSize: 50 },
      { description: "60-foot beam deals 3d8 sacred damage, pierces 10 Damage Reduction, and blinds all enemies struck for 1 round.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 }, aoeSize: 60 }
    ]
  },
  {
    id: "sf_t2_astral_bind",
    name: "Astral Gravity",
    icon: "spell_nature_astralrecal",
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: "sf_t1_cosmic_attunement",
    spell: {
      name: "Astral Gravity",
      description: "Enemies struck by your celestial spells are weighed down by gravitational forces: movement speed is reduced by 15 feet and they cannot take dash or teleport actions for 1 round.",
      flavorText: "Constellations are just chains that glitter.",
      source: "talent", class: "Lunarch", treeId: "starfall_invoker",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "slow", "anti-teleport", "lunarch"]
    },
    rankUpgrades: [
      { description: "Speed reduced by 25 feet, no teleport/dash, and enemies have -2 on Dexterity saving throws." },
      { description: "Speed reduced by 35 feet, no reactions, -3 on Dexterity saves, and flying creatures are brought to the ground." }
    ]
  },

  // ──────────────── TIER 3 (6 pts) ────────────────
  {
    id: "sf_t3_gravity_singularity",
    name: "Gravity Singularity",
    icon: "spell_shadow_mindtwisting",
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: "sf_t2_celestial_beam",
    spell: {
      name: "Gravity Singularity",
      description: "Summon a dense gravitational core at a target location within 70 feet: pulls all enemies within 30 feet to its center and crushes them for 2d8 arcane damage.",
      flavorText: "The sky bends inward. Everything follows.",
      source: "talent", class: "Lunarch", treeId: "starfall_invoker",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "ranged", range: 70, aoeShape: "circle", aoeSize: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 18, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 10 } },
      damageTypes: ["arcane"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      debuffs: ["pull"], visualTheme: "arcane", tags: ["pull", "vortex", "aoe", "lunarch"]
    },
    rankUpgrades: [
      { description: "Pulls enemies within 35 feet, deals 3d8 arcane damage, and roots enemies in the center for 1 round.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 }, aoeSize: 35 },
      { description: "Pulls within 40 feet, deals 4d8 arcane damage, roots for 1 round, and automatically casts a free Starfall on the center.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 }, aoeSize: 40 }
    ]
  },
  {
    id: "sf_t3_cosmic_eruption",
    name: "Supernova Chain",
    icon: "spell_fire_flamebolt",
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: "sf_t2_astral_bind",
    spell: {
      name: "Supernova Chain",
      description: "When an enemy dies from your celestial spells, they detonate in a supernova: deals 3d8 sacred/arcane damage to all enemies within 15 feet.",
      flavorText: "The exit wound is astronomical.",
      source: "talent", class: "Lunarch", treeId: "starfall_invoker",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["sacred", "arcane"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      visualTheme: "arcane", tags: ["passive", "death-burst", "chain", "lunarch"]
    },
    rankUpgrades: [
      { description: "Supernova deals 4d8 damage within 20 feet and can chain to other dying enemies.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 } },
      { description: "Supernova deals 6d8 damage within 25 feet, chains infinitely, and grants you 5 mana per kill.", primaryDamage: { dice: "6d8", flat: 0, procChance: 100 } }
    ]
  },

  // ──────────────── TIER 4 (5 pts) ────────────────
  {
    id: "sf_t4_cosmic_flare",
    name: "Cosmic Flare",
    icon: "spell_holy_holybolt",
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: "sf_t3_gravity_singularity",
    spell: {
      name: "Cosmic Flare",
      description: "Detonate a blinding burst of starlight in a 30-foot radius around yourself: deals 4d8 sacred damage, blinds all enemies for 2 rounds, and pushes them 15 feet away.",
      flavorText: "A brief glance at the heart of a sun.",
      source: "talent", class: "Lunarch", treeId: "starfall_invoker",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 16, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { mana: { baseAmount: 8 } },
      damageTypes: ["sacred"],
      primaryDamage: { dice: "4d8", flat: 0, procChance: 100 },
      debuffs: ["blind", "knockback"], visualTheme: "arcane", tags: ["aoe", "blind", "peel", "lunarch"]
    },
    rankUpgrades: [
      { description: "35-foot radius deals 6d8 sacred damage, blinds for 2 rounds, and grants you 30 temporary health.", primaryDamage: { dice: "6d8", flat: 0, procChance: 100 }, aoeSize: 35 },
      { description: "40-foot radius deals 8d8 sacred damage, blinds for 3 rounds, grants 50 temp HP, and resets Celestial Beam cooldown.", primaryDamage: { dice: "8d8", flat: 0, procChance: 100 }, aoeSize: 40 }
    ]
  },
  {
    id: "sf_t4_lunar_phase_mastery",
    name: "Eclipse Alignment",
    icon: "spell_arcane_starfire",
    maxRanks: 2,
    position: { x: 3.5, y: 3 },
    requires: "sf_t3_cosmic_eruption",
    spell: {
      name: "Eclipse Alignment",
      description: "During Full Moon, your celestial AoE spells deal +1d8 bonus damage. During New Moon, all your celestial spell cooldowns recover 50 points faster.",
      flavorText: "The sky shows off through you, regardless of the tide.",
      source: "talent", class: "Lunarch", treeId: "starfall_invoker",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "phases", "cdr", "damage", "lunarch"]
    },
    rankUpgrades: [
      { description: "Full Moon grants +60 points AoE damage; New Moon grants 100 points faster cooldown recovery and +20 points spell crit." }
    ]
  },

  // ──────────────── TIER 5 (5 pts) ────────────────
  {
    id: "sf_t5_cosmic_overload",
    name: "Cosmic Overload",
    icon: "spell_nature_starfall",
    maxRanks: 2,
    position: { x: 1, y: 4 },
    requires: "sf_t4_cosmic_flare",
    spell: {
      name: "Cosmic Overload",
      description: "Spend 12 mana: overload the firmament. Instantly call down THREE overlapping Starfalls across the battlefield, dealing 3d8 sacred/arcane damage across a massive 60-foot zone.",
      flavorText: "Spend the whole sky at once.",
      source: "talent", class: "Lunarch", treeId: "starfall_invoker",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "ranged", range: 100, aoeShape: "circle", aoeSize: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 30, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 12 } },
      damageTypes: ["sacred", "arcane"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      visualTheme: "arcane", tags: ["mass-bombardment", "nuke", "aoe", "lunarch"]
    },
    rankUpgrades: [
      { description: "Calls down 5 overlapping Starfalls dealing 6d8 damage across an 80-foot zone and stunning all enemies for 1 round.", primaryDamage: { dice: "6d8", flat: 0, procChance: 100 }, aoeSize: 80, cooldownValue: 24 }
    ]
  },
  {
    id: "sf_t5_orbital_resonance",
    name: "Orbital Battery",
    icon: "spell_fire_meteorstorm",
    maxRanks: 3,
    position: { x: 3, y: 4 },
    requires: "sf_t4_lunar_phase_mastery",
    spell: {
      name: "Orbital Battery",
      description: "Whenever you cast an active celestial spell, an orbital satellite stores kinetic starlight. At 3 charges, it automatically fires an orbital bolt dealing 3d8 sacred damage to the strongest enemy in range.",
      flavorText: "An automated battery in high orbit.",
      source: "talent", class: "Lunarch", treeId: "starfall_invoker",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["sacred"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      visualTheme: "arcane", tags: ["passive", "turret", "auto-fire", "lunarch"]
    },
    rankUpgrades: [
      { description: "Orbital bolt deals 5d8 sacred damage, pierces 6 Damage Reduction, and restores 5 mana.", primaryDamage: { dice: "5d8", flat: 0, procChance: 100 } },
      { description: "Orbital bolt deals 7d8 sacred damage, pierces 10 Damage Reduction, and triggers at 2 charges instead of 3.", primaryDamage: { dice: "7d8", flat: 0, procChance: 100 } }
    ]
  },

  // ──────────────── TIER 6 (5 pts) ────────────────
  {
    id: "sf_t6_meteor_cataclysm",
    name: "Meteor Cataclysm",
    icon: "spell_fire_meteorstorm",
    maxRanks: 1,
    position: { x: 1, y: 5 },
    requires: "sf_t5_cosmic_overload",
    spell: {
      name: "Meteor Cataclysm",
      description: "Spend 16 mana: drop a colossal apocalyptic asteroid on a 40-foot zone within 100 feet. Deals 10d10 sacred/ember damage, destroys terrain, knocks all enemies back 30 feet, and leaves molten craters for 1 minute.",
      flavorText: "The extinction event, scheduled on demand.",
      source: "talent", class: "Lunarch", treeId: "starfall_invoker",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "ranged", range: 100, aoeShape: "circle", aoeSize: 40,
      castTimeType: "short", castTimeValue: 1.5,
      cooldownCategory: "long", cooldownValue: 60, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: true,
      resourceCosts: { mana: { baseAmount: 16 } },
      damageTypes: ["sacred", "ember"],
      primaryDamage: { dice: "10d10", flat: 0, procChance: 100 },
      debuffs: ["knockback"], visualTheme: "ember", tags: ["nuke", "cataclysm", "extinction", "lunarch"]
    },
    rankUpgrades: []
  },
  {
    id: "sf_t6_astral_penetration",
    name: "Pure Starlight",
    icon: "spell_holy_pureofheart",
    maxRanks: 2,
    position: { x: 2.5, y: 5 },
    requires: "sf_t5_orbital_resonance",
    spell: {
      name: "Pure Starlight",
      description: "All your sacred and arcane damage completely ignores magical resistance, shields, and damage reduction effects.",
      flavorText: "Starlight does not negotiate with armor.",
      source: "talent", class: "Lunarch", treeId: "starfall_invoker",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "true-damage", "penetration", "lunarch"]
    },
    rankUpgrades: [
      { description: "Ignores all resistance/shields, and your celestial spells deal +30 points bonus damage to bosses and elite foes." }
    ]
  },
  {
    id: "sf_t6_stellar_crit",
    name: "Celestial Criticality",
    icon: "spell_arcane_starfire",
    maxRanks: 2,
    position: { x: 4, y: 5 },
    requires: "sf_t5_orbital_resonance",
    spell: {
      name: "Celestial Criticality",
      description: "All your celestial spells score critical hits on 18+ and critical hits reduce all your active cooldowns by 3 seconds.",
      flavorText: "Stars aligned for maximum ruin.",
      source: "talent", class: "Lunarch", treeId: "starfall_invoker",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "crit", "cdr", "lunarch"]
    },
    rankUpgrades: [
      { description: "Critical hits on 17+; criticals reduce cooldowns by 5 seconds and refund 50 points mana cost." }
    ]
  },

  // ──────────────── TIER 7 / CAPSTONE (15 pts) ────────────────
  {
    id: "sf_t7_supernova_ascent",
    name: "Supernova Ascent",
    icon: "spell_nature_starfall",
    maxRanks: 1,
    position: { x: 0.5, y: 6 },
    requires: "sf_t6_meteor_cataclysm",
    spell: {
      name: "Supernova Ascent",
      description: "ULTIMATE: Spend 20 mana: transform into a blazing Supernova for 1 minute: gain flight, become immune to all crowd control, all your spell cast times become INSTANT, and Starfall automatically strikes the area around you every round for free.",
      flavorText: "You are the star that fell.",
      source: "talent", class: "Lunarch", treeId: "starfall_invoker",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 180, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { mana: { baseAmount: 20 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      buffs: ["supernova-ascent"], visualTheme: "arcane", tags: ["ultimate", "capstone", "avatar", "lunarch"]
    },
    rankUpgrades: []
  },
  {
    id: "sf_t7_starfall_doctrine",
    name: "Starfall Doctrine",
    icon: "spell_arcane_starfire",
    maxRanks: 5,
    position: { x: 1.5, y: 6 },
    requires: "sf_t6_meteor_cataclysm",
    spell: {
      name: "Starfall Doctrine",
      description: "The heavens obey. All sacred, fire, and arcane AoE damage you deal is increased by +1d6 damage.",
      flavorText: "A sky with no limits.",
      source: "talent", class: "Lunarch", treeId: "starfall_invoker",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["sacred", "arcane", "ember"],
      visualTheme: "arcane", tags: ["passive", "capstone", "damage", "lunarch"]
    },
    rankUpgrades: [
      { description: "All celestial AoE damage increased by +1d8 damage." },
      { description: "All celestial AoE damage increased by +1d8 damage." },
      { description: "All celestial AoE damage increased by +2d8 damage." },
      { description: "All celestial AoE damage increased by +2d8 damage, and Starfall mana cost is reduced to 0." }
    ]
  },
  {
    id: "sf_t7_infinite_orbit",
    name: "Infinite Orbital Array",
    icon: "spell_fire_meteorstorm",
    maxRanks: 3,
    position: { x: 2.5, y: 6 },
    requires: "sf_t6_astral_penetration",
    spell: {
      name: "Infinite Orbital Array",
      description: "Orbital Battery fires twice as many bolts, and each bolt creates a 10-foot Starfall crater upon impact.",
      flavorText: "The sky is never empty.",
      source: "talent", class: "Lunarch", treeId: "starfall_invoker",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "capstone", "turret-boost", "lunarch"]
    },
    rankUpgrades: [
      { description: "Orbital Battery fires 3 bolts with Starfall craters and restores 15 mana per trigger." },
      { description: "Orbital Battery fires 4 bolts, craters deal double damage, and triggers on EVERY celestial spell cast." }
    ]
  },
  {
    id: "sf_t7_event_horizon",
    name: "Event Horizon",
    icon: "spell_shadow_mindtwisting",
    maxRanks: 3,
    position: { x: 3.5, y: 6 },
    requires: "sf_t6_stellar_crit",
    spell: {
      name: "Event Horizon",
      description: "Whenever you land a critical hit with an AoE spell, all enemies in the area are pulled to its epicenter and silenced for 1 round.",
      flavorText: "No sound escapes the horizon.",
      source: "talent", class: "Lunarch", treeId: "starfall_invoker",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "capstone", "crit-pull", "silence", "lunarch"]
    },
    rankUpgrades: [
      { description: "Crit pull silences for 2 rounds and deals an extra 4d10 crushing damage." },
      { description: "Crit pull silences for 2 rounds, deals 6d10 crushing damage, and resets Gravity Singularity cooldown." }
    ]
  },
  {
    id: "sf_t7_firmament_rebirth",
    name: "Firmament Rebirth",
    icon: "spell_holy_resurrection",
    maxRanks: 3,
    position: { x: 4.5, y: 6 },
    requires: "sf_t6_stellar_crit",
    spell: {
      name: "Firmament Rebirth",
      description: "When you suffer lethal damage, a star crashes down upon you: prevents death, restores 30 Hit Points/mana, and deals 6d10 sacred damage to all enemies within 30 feet (cooldown: 120s).",
      flavorText: "Even falling stars leave a massive impact.",
      source: "talent", class: "Lunarch", treeId: "starfall_invoker",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["sacred"],
      primaryDamage: { dice: "6d10", flat: 0, procChance: 100 },
      visualTheme: "arcane", tags: ["passive", "capstone", "cheat-death", "lunarch"]
    },
    rankUpgrades: [
      { description: "Survive lethal damage, restores 45 Hit Points/mana, blast deals 8d10 damage and knocks all enemies prone (cooldown: 90s)." },
      { description: "Survive lethal damage, restores 60 Hit Points/mana, blast deals 12d10 damage, and immediately activates Supernova Ascent for free (cooldown: 60s)." }
    ]
  }
];
