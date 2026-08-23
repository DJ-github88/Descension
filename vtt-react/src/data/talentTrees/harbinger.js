// ============================================
// HARBINGER TALENT TREES (v3: full v2/v3 active/passive spec identity overhaul)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50 pts per tree.
//
// SPECS:
//   1. WILD PROPHET:  The Chaos Surge AoE Bombarder / Mayhem Conductor.
//   2. DEATH'S SEER:  The Single-Target Entropy Necromancer / Doom Marker.
//   3. FATE RIFT:     The Dimensional Tearer / Void Rift Weaver.
// ============================================

// ============================================
// 1. HARBINGER — WILD PROPHET
// ============================================
export const HARBINGER_WILD_PROPHET = [
  // ──────────────── TIER 1 (8 pts) ────────────────
  {
    id: "wp_t1_chaos_eruption",
    name: "Chaos Prophecy Eruption",
    icon: "spell_fire_fire",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Chaos Prophecy Eruption",
      description: "Cast an unstable chaos rune within 45 feet for 1 round: erupts dealing 2d6 random elemental damage (ember, rime, storm, or wyrd) to all enemies in a 20-foot area, generating 2 Mayhem.",
      flavorText: "The Wyrd-threads of Keth-Amar fray with every chaos pulse.",
      source: "talent", class: "Harbinger", treeId: "wild_prophet",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "ranged", range: 45, aoeShape: "circle", aoeSize: 20,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 6, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 4 } },
      damageTypes: ["ember", "rime", "storm"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      visualTheme: "wyrd", tags: ["aoe", "wild-magic", "mayhem-builder", "harbinger"]
    },
    rankUpgrades: [
      { description: "25-foot area deals 3d6 damage, generates 2 Mayhem, and has a 25 points chance to trigger a Wild Magic Surge.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 }, aoeSize: 25, cooldownValue: 8 },
      { description: "30-foot area deals 4d6 damage, generates 2 Mayhem, and 50 points chance to trigger Wild Magic Surge.", primaryDamage: { dice: "4d6", flat: 0, procChance: 100 }, aoeSize: 30, cooldownValue: 10 }
    ]
  },
  {
    id: "wp_t1_surge_attunement",
    name: "Surge Attunement",
    icon: "spell_nature_mirrorimage",
    maxRanks: 3,
    position: { x: 2.5, y: 0 },
    requires: null,
    spell: {
      name: "Surge Attunement",
      description: "Whenever a Wild Magic Surge triggers, you gain 2 Mayhem and deal 2d6 random damage to a random enemy within 30 feet.",
      flavorText: "Entropy spreads like cracks in the foundation of reality.",
      source: "talent", class: "Harbinger", treeId: "wild_prophet",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["ember"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      visualTheme: "wyrd", tags: ["passive", "surge-proc", "mayhem", "harbinger"]
    },
    rankUpgrades: [
      { description: "Gain 2 Mayhem on surge and deal 3d6 random damage." },
      { description: "Gain 2 Mayhem on surge, deal 4d6 random damage, and your next spell deals +10 points damage." }
    ]
  },
  {
    id: "wp_t1_area_mastery",
    name: "Expanding Prophecy",
    icon: "spell_fire_selfdestruct",
    maxRanks: 2,
    position: { x: 4, y: 0 },
    requires: null,
    spell: {
      name: "Expanding Prophecy",
      description: "All your area prophecy radii increase by +10 feet, and you gain 4 Damage Reduction from your own wild magic surges.",
      flavorText: "Wider visions encompass wider battlefields.",
      source: "talent", class: "Harbinger", treeId: "wild_prophet",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "aoe-range", "self-dr", "harbinger"]
    },
    rankUpgrades: [
      { description: "Radii +15 feet; immune to self-damage from your own surges and gain +1 Durability Step to equipped durability." }
    ]
  },

  // ──────────────── TIER 2 (6 pts) ────────────────
  {
    id: "wp_t2_wild_cascade",
    name: "Wild Magic Cascade",
    icon: "spell_arcane_arcanetorrent",
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: "wp_t1_chaos_eruption",
    spell: {
      name: "Wild Magic Cascade",
      description: "Spend 3 Mayhem: force 3 random Wild Magic Surges to detonate instantly on targets within 45 feet. Deals 2d8 damage per surge and knocks affected enemies prone.",
      flavorText: "Chaos chained into a triple lightning strike of fate.",
      source: "talent", class: "Harbinger", treeId: "wild_prophet",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "multi", rangeType: "ranged", range: 45,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 8, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mayhem: { baseAmount: 3 } },
      damageTypes: ["ember", "storm"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      debuffs: ["prone"], visualTheme: "wyrd", tags: ["multi-nuke", "surge-trigger", "knockdown", "harbinger"]
    },
    rankUpgrades: [
      { description: "Fires 3 surges dealing 3d8 damage each and stuns affected enemies for 1 round.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } },
      { description: "Fires 3 surges dealing 4d8 damage each, stuns for 1 round, and refunds 1 Mayhem.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "wp_t2_unstable_aura",
    name: "Unstable Wyrd Aura",
    icon: "spell_arcane_arcaneresilience",
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: "wp_t1_surge_attunement",
    spell: {
      name: "Unstable Wyrd Aura",
      description: "When hit in melee, there is a 15 points chance to negate the attack completely and deal 1d8 random elemental damage back to the attacker.",
      flavorText: "The Wyrd recoils from those who strike its champion.",
      source: "talent", class: "Harbinger", treeId: "wild_prophet",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["ember"],
      primaryDamage: { dice: "1d8", flat: 0, procChance: 100 },
      visualTheme: "wyrd", tags: ["passive", "negate-attack", "retaliation", "harbinger"]
    },
    rankUpgrades: [
      { description: "25 points chance to negate melee hits and deal 2d8 damage." },
      { description: "35 points chance to negate hits, deal 3d8 damage, and trigger a free Wild Cascade on attacker." }
    ]
  },

  // ──────────────── TIER 3 (6 pts) ────────────────
  {
    id: "wp_t3_overlapping_doom",
    name: "Overlapping Doom Vortex",
    icon: "spell_fire_fireball",
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: "wp_t2_wild_cascade",
    spell: {
      name: "Overlapping Doom Vortex",
      description: "Spend 4 Mayhem: place 2 overlapping prophecy circles within 50 feet for 3 rounds. The overlapping zone deals 2d6 chaotic wyrd damage per round and pulls enemies toward the center.",
      flavorText: "Where prophecy overlaps, reality collapses into violent certainty.",
      source: "talent", class: "Harbinger", treeId: "wild_prophet",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "ranged", range: 50, aoeShape: "circle", aoeSize: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 16, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mayhem: { baseAmount: 4 } },
      damageTypes: ["ember", "blight"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      isDot: true, dotDuration: 3, dotTick: "2d6",
      visualTheme: "wyrd", tags: ["vortex", "hazard", "overlap", "harbinger"]
    },
    rankUpgrades: [
      { description: "Deals 3d6 damage per round, silences enemies inside, and area expands to 35 feet.", dotTick: "3d6", aoeSize: 35 },
      { description: "Deals 4d6 damage per round, silences, prevents all dashes/teleports, and crits on 20+.", dotTick: "4d6", aoeSize: 40 }
    ]
  },
  {
    id: "wp_t3_surging_power",
    name: "Surging Power Escalation",
    icon: "spell_nature_mirrorimage",
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: "wp_t2_unstable_aura",
    spell: {
      name: "Surging Power Escalation",
      description: "Each Wild Magic Surge grants you +2 points spell damage (stacks up to 5 times, max +10 points) and +5ft movement speed.",
      flavorText: "Each chaos pulse feeds the next in an escalating spiral.",
      source: "talent", class: "Harbinger", treeId: "wild_prophet",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "stacking-damage", "speed", "harbinger"]
    },
    rankUpgrades: [
      { description: "+3 points damage per surge (stacks up to +15 points) and +1 Durability Step to equipped durability." },
      { description: "+4 points damage per surge (stacks up to +20 points), +2 Durability Steps to equipped durability, and spells ignore 4 Damage Reduction." }
    ]
  },

  // ──────────────── TIER 4 (5 pts) ────────────────
  {
    id: "wp_t4_cataclysm_beam",
    name: "Cataclysmic Disintegration Beam",
    icon: "spell_fire_fireball02",
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: "wp_t3_overlapping_doom",
    spell: {
      name: "Cataclysmic Disintegration Beam",
      description: "Spend 5 Mayhem: channel a 60-foot beam of pure unraveling chaos for 1 instant: deals 3d8 damage of 3 random elements simultaneously to all enemies in a line and burns them for 1d8 damage over 2 rounds.",
      flavorText: "Keth-Amar speaks the names of calamities yet to come.",
      source: "talent", class: "Harbinger", treeId: "wild_prophet",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 60, aoeShape: "line", aoeSize: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 20, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mayhem: { baseAmount: 5 } },
      damageTypes: ["ember", "storm", "blight"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      visualTheme: "wyrd", tags: ["line", "nuke", "multi-element", "harbinger"]
    },
    rankUpgrades: [
      { description: "70-foot beam deals 4d8 damage, burns for 2d8, and cooldown drops to 18s.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 }, cooldownValue: 18 },
      { description: "80-foot beam deals 5d8 damage, pierces 25 points of enemy shields/durability, and refunds 2 Mayhem.", primaryDamage: { dice: "5d8", flat: 0, procChance: 100 }, cooldownValue: 16 }
    ]
  },
  {
    id: "wp_t4_mayhem_overflow",
    name: "Mayhem Overload",
    icon: "spell_shadow_shadowbolt",
    maxRanks: 2,
    position: { x: 3.5, y: 3 },
    requires: "wp_t3_surging_power",
    spell: {
      name: "Mayhem Overload",
      description: "Your maximum Mayhem increases by 6. At 10+ Mayhem, all your spell casts automatically trigger a free Wild Magic Surge.",
      flavorText: "When Mayhem reaches its peak, reality begins to fray.",
      source: "talent", class: "Harbinger", treeId: "wild_prophet",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "mayhem-cap", "auto-surge", "harbinger"]
    },
    rankUpgrades: [
      { description: "Max Mayhem +8; auto-surges deal +1d8 bonus damage and grant 1 Action Point." }
    ]
  },

  // ──────────────── TIER 5 (5 pts) ────────────────
  {
    id: "wp_t5_apex_surge_nova",
    name: "Apex Surge Nova",
    icon: "spell_fire_selfdestruct",
    maxRanks: 2,
    position: { x: 1, y: 4 },
    requires: "wp_t4_cataclysm_beam",
    spell: {
      name: "Apex Surge Nova",
      description: "Spend 6 Mayhem: unleash a 40-foot supernova of wild magic. Deals 5d8 elemental damage, knocks all enemies back 20 feet, and applies random elemental weaknesses to all survivors for 2 rounds.",
      flavorText: "At the apex of entropy, the Wyrd consumes all.",
      source: "talent", class: "Harbinger", treeId: "wild_prophet",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 40,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 30, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { mayhem: { baseAmount: 6 } },
      damageTypes: ["ember", "rime", "storm"],
      primaryDamage: { dice: "5d8", flat: 0, procChance: 100 },
      debuffs: ["elemental-vulnerability"], visualTheme: "wyrd", tags: ["supernova", "nuke", "mass-vuln", "harbinger"]
    },
    rankUpgrades: [
      { description: "50-foot nova deals 6d8 damage, stuns all enemies for 1 round, and cooldown drops to 24s.", primaryDamage: { dice: "6d8", flat: 0, procChance: 100 }, aoeSize: 50, cooldownValue: 24 }
    ]
  },
  {
    id: "wp_t5_wild_sovereignty",
    name: "Wild Sovereignty",
    icon: "spell_nature_mirrorimage",
    maxRanks: 3,
    position: { x: 3, y: 4 },
    requires: "wp_t4_mayhem_overflow",
    spell: {
      name: "Wild Sovereignty",
      description: "All area prophecy damage dice are upgraded (d6 becomes d8, d8 becomes d10) and you heal for 30 points of all surge damage dealt.",
      flavorText: "Dominion over the chaos turning the predator's leak against it.",
      source: "talent", class: "Harbinger", treeId: "wild_prophet",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "dice-upgrade", "sustain", "harbinger"]
    },
    rankUpgrades: [
      { description: "Damage dice upgrade (d10 becomes d12) and heal for 30 points of surge damage dealt." },
      { description: "Heal for 35 points of surge damage; overheal becomes a 30-HP wyrd shield." }
    ]
  },

  // ──────────────── TIER 6 (5 pts) ────────────────
  {
    id: "wp_t6_cataclysm_incarnate",
    name: "Cataclysm Incarnate",
    icon: "spell_shadow_curseofsargeras",
    maxRanks: 1,
    position: { x: 1, y: 5 },
    requires: "wp_t5_apex_surge_nova",
    spell: {
      name: "Cataclysm Incarnate",
      description: "Spend 8 Mayhem: enter the Cataclysm State for 2 rounds: every single spell you cast triggers 2 guaranteed Wild Magic Surges, all surge damage is doubled, and all your area prophecies auto-detonate every round without cooldown.",
      flavorText: "Keth-Amar walks through you, and reality trembles.",
      source: "talent", class: "Harbinger", treeId: "wild_prophet",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 90, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { mayhem: { baseAmount: 8 } },
      durationRounds: 2, durationRealTime: 12, durationUnit: "seconds",
      buffs: ["cataclysm-incarnate"], visualTheme: "wyrd", tags: ["god-mode", "double-surges", "climax", "harbinger"]
    },
    rankUpgrades: []
  },
  {
    id: "wp_t6_chaos_criticality",
    name: "Chaotic Singularity Crits",
    icon: "spell_fire_fireball",
    maxRanks: 2,
    position: { x: 2.5, y: 5 },
    requires: "wp_t5_wild_sovereignty",
    spell: {
      name: "Chaotic Singularity Crits",
      description: "All chaos, wild magic, and prophecy spells score critical hits on 17+ and critical hits release a 4d8 shockwave to adjacent foes.",
      flavorText: "A critical tear in the probability weave.",
      source: "talent", class: "Harbinger", treeId: "wild_prophet",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["ember"],
      primaryDamage: { dice: "4d8", flat: 0, procChance: 100 },
      visualTheme: "wyrd", tags: ["passive", "crit", "crit-burst", "harbinger"]
    },
    rankUpgrades: [
      { description: "Critical hits on 16+; crits deal +1d8 bonus damage and shockwave deals 4d8 elemental damage." }
    ]
  },
  {
    id: "wp_t6_entropy_ward",
    name: "Chaotic Bastion",
    icon: "spell_holy_powerwordbarrier",
    maxRanks: 2,
    position: { x: 4, y: 5 },
    requires: "wp_t5_wild_sovereignty",
    spell: {
      name: "Chaotic Bastion",
      description: "While in combat, you gain +4 Durability Steps to equipped durability, 25 points elemental damage resistance, and whenever you take damage, you gain 2 Mayhem.",
      flavorText: "The chaotic cloak absorbs all incoming force.",
      source: "talent", class: "Harbinger", treeId: "wild_prophet",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "durability", "mayhem-on-hit", "harbinger"]
    },
    rankUpgrades: [
      { description: "Gain +5 Durability Steps to equipped durability, 6 Damage Reduction, gain 3 Mayhem on damage, and reflect 25 points damage back at attackers." }
    ]
  },

  // ──────────────── TIER 7 / CAPSTONE (15 pts) ────────────────
  {
    id: "wp_t7_avatar_of_keth_amar",
    name: "Avatar of the Chaos Void",
    icon: "spell_shadow_unholyfrenzy",
    maxRanks: 1,
    position: { x: 0.5, y: 6 },
    requires: "wp_t6_cataclysm_incarnate",
    spell: {
      name: "Avatar of the Chaos Void",
      description: "ULTIMATE: Spend 10 Mayhem: transform into the Living Herald of Keth-Amar for 1 minute: continuous elemental storms blanket the entire 60-foot battlefield dealing 8d10 damage per round, and all your attacks score critical hits on 18+.",
      flavorText: "Reality is unmade. In the center of the void stands the Prophet.",
      source: "talent", class: "Harbinger", treeId: "wild_prophet",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 180, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { mayhem: { baseAmount: 10 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      damageTypes: ["ember", "rime", "storm"],
      primaryDamage: { dice: "8d10", flat: 0, procChance: 100 },
      buffs: ["avatar-keth-amar"], visualTheme: "wyrd", tags: ["ultimate", "capstone", "harbinger"]
    },
    rankUpgrades: []
  },
  {
    id: "wp_t7_wild_prophet_doctrine",
    name: "Wild Prophet Doctrine",
    icon: "spell_nature_mirrorimage",
    maxRanks: 5,
    position: { x: 1.5, y: 6 },
    requires: "wp_t6_cataclysm_incarnate",
    spell: {
      name: "Wild Prophet Doctrine",
      description: "All wild magic, chaos, and elemental prophecy damage you deal is increased by +1d6 damage.",
      flavorText: "The words of the Prophet rewrite the world.",
      source: "talent", class: "Harbinger", treeId: "wild_prophet",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["ember", "rime", "storm"],
      visualTheme: "wyrd", tags: ["passive", "capstone", "damage", "harbinger"]
    },
    rankUpgrades: [
      { description: "All wild magic and prophecy damage increased by +1d6 damage." },
      { description: "All wild magic and prophecy damage increased by +1d6 damage." },
      { description: "All wild magic and prophecy damage increased by +1d8 damage." },
      { description: "All wild magic and prophecy damage increased by +1d8 damage, and Chaos Prophecy Eruption costs 0 mana." }
    ]
  },
  {
    id: "wp_t7_infinite_mayhem_engine",
    name: "Endless Mayhem Reservoir",
    icon: "spell_arcane_arcanetorrent",
    maxRanks: 3,
    position: { x: 2.5, y: 6 },
    requires: "wp_t6_chaos_criticality",
    spell: {
      name: "Endless Mayhem Reservoir",
      description: "Your maximum Mayhem increases by 8. You generate 2 Mayhem at the start of every combat round.",
      flavorText: "An inexhaustible spring of unraveling energy.",
      source: "talent", class: "Harbinger", treeId: "wild_prophet",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "capstone", "mayhem-engine", "harbinger"]
    },
    rankUpgrades: [
      { description: "Max Mayhem +10; generate 3 Mayhem per round and movement speed +10ft." },
      { description: "Max Mayhem +12; generate 4 Mayhem per round and abilities cost 1 fewer Mayhem." }
    ]
  },
  {
    id: "wp_t7_cataclysmic_cascades",
    name: "Perpetual Cascade Nova",
    icon: "spell_fire_selfdestruct",
    maxRanks: 3,
    position: { x: 3.5, y: 6 },
    requires: "wp_t6_chaos_criticality",
    spell: {
      name: "Perpetual Cascade Nova",
      description: "Whenever an enemy dies from your wild magic or prophecies, trigger an immediate free Wild Magic Cascade centered on their corpse.",
      flavorText: "Death only detonates another pocket of chaos.",
      source: "talent", class: "Harbinger", treeId: "wild_prophet",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "capstone", "chain-death", "harbinger"]
    },
    rankUpgrades: [
      { description: "Corpse cascade deals +25 points bonus damage and stuns survivors for 1 round." },
      { description: "Corpse cascade deals +35 points bonus damage, stuns survivors for 1 round, and refunds 3 Mayhem." }
    ]
  },
  {
    id: "wp_t7_chaos_rebirth",
    name: "Wild Surge Rebirth",
    icon: "spell_nature_astralrecal",
    maxRanks: 3,
    position: { x: 4.5, y: 6 },
    requires: "wp_t6_entropy_ward",
    spell: {
      name: "Wild Surge Rebirth",
      description: "While at 4+ Mayhem, lethal damage triggers a massive wild magic reset: prevents death, restores 24 Hit Points and 30 temporary health, and sets Mayhem to 5 (cooldown: 180s).",
      flavorText: "The universe refused the outcome, rewinding the fatal blow into an explosion.",
      source: "talent", class: "Harbinger", treeId: "wild_prophet",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "capstone", "cheat-death", "harbinger"]
    },
    rankUpgrades: [
      { description: "Survive lethal damage, restores 36 Hit Points, 40 temp HP, full Mayhem (cooldown: 120s)." },
      { description: "Survive lethal damage, restores 45 Hit Points, 50 temp HP (cooldown: 90s)." }
    ]
  }
];

// ============================================
// 2. HARBINGER — DEATH'S SEER
// ============================================
export const HARBINGER_DEATHS_SEER = [
  // ──────────────── TIER 1 (8 pts) ────────────────
  {
    id: "ds_t1_death_mark_strike",
    name: "Death Mark Strike",
    icon: "spell_shadow_chilltouch",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Death Mark Strike",
      description: "Brand a target within 45 feet with a Doom Mark for 1 minute: deals 2d8 blight damage, reduces target durability by 2, and generates 2 Mayhem.",
      flavorText: "The entropy of the Wyrd begins with the smallest touch of decay.",
      source: "talent", class: "Harbinger", treeId: "deaths_seer",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "ranged", range: 45,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 6, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 4 } },
      damageTypes: ["blight"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      debuffs: ["doom-mark"], visualTheme: "wyrd", tags: ["single-nuke", "durability-sunder", "doom-mark", "harbinger"]
    },
    rankUpgrades: [
      { description: "Deals 3d8 blight damage, reduces durability by 3, and causes bleed for 1d6 blight per round.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } },
      { description: "Deals 3d8 blight damage, reduces durability by 4, bleeds for 1d6, and attacks against the marked target score critical hits on 19+.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 }, cooldownValue: 10 }
    ]
  },
  {
    id: "ds_t1_decay_wave",
    name: "Necrotic Decay Aura",
    icon: "spell_shadow_shadowwordpain",
    maxRanks: 3,
    position: { x: 2.5, y: 0 },
    requires: null,
    spell: {
      name: "Necrotic Decay Aura",
      description: "All your single-target blight and doom spells deal +10 points increased damage, and your attacks ignore 10 points of enemy durability.",
      flavorText: "The entropy of Keth-Amar spreads like a plague.",
      source: "talent", class: "Harbinger", treeId: "deaths_seer",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["blight"],
      visualTheme: "wyrd", tags: ["passive", "necrotic-amp", "penetration", "harbinger"]
    },
    rankUpgrades: [
      { description: "+15 points blight damage and ignores 20 points of enemy durability." },
      { description: "+20 points blight damage, ignores 30 points of enemy durability, and kills grant +2 Mayhem." }
    ]
  },
  {
    id: "ds_t1_entropy_shield",
    name: "Shroud of Inevitable Decay",
    icon: "spell_arcane_arcaneresilience",
    maxRanks: 2,
    position: { x: 4, y: 0 },
    requires: null,
    spell: {
      name: "Shroud of Inevitable Decay",
      description: "You gain +2 Durability Steps to equipped durability and take 25 points less blight damage. Attackers who strike you take 1d6 blight damage in retaliation.",
      flavorText: "Keth-Amar shrouds its prophets in an aura of decay.",
      source: "talent", class: "Harbinger", treeId: "deaths_seer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["blight"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "wyrd", tags: ["passive", "retaliation", "durability", "harbinger"]
    },
    rankUpgrades: [
      { description: "Gain +3 Durability Steps to equipped durability, take 25 points less blight damage, retaliate for 2d6 blight, and heal for 25 points of retaliation damage." }
    ]
  },

  // ──────────────── TIER 2 (6 pts) ────────────────
  {
    id: "ds_t2_organ_collapse",
    name: "Decay Organ Collapse",
    icon: "spell_shadow_chilltouch",
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: "ds_t1_death_mark_strike",
    spell: {
      name: "Decay Organ Collapse",
      description: "Spend 2 Mayhem: cause internal organs of a marked enemy within 45 feet to rapidly decay. Deals 2d8 blight damage, stuns the target for 1 round, and reduces their durability by 2.",
      flavorText: "The Wyrd gnaws at the core of life itself.",
      source: "talent", class: "Harbinger", treeId: "deaths_seer",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "ranged", range: 45,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 8, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mayhem: { baseAmount: 2 } },
      damageTypes: ["blight"],
primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      debuffs: ["stun"], visualTheme: "wyrd", tags: ["single-nuke", "stun", "organ-collapse", "harbinger"]
    },
    rankUpgrades: [
      { description: "Deals 3d8 blight damage and reduces target's next attack by 25%.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } },
      { description: "Deals 4d8 blight damage, stuns for 1 round, and reduces target's durability by 3.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "ds_t2_deep_rot",
    name: "Deep Rotting Wounds",
    icon: "spell_shadow_shadowwordpain",
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: "ds_t1_decay_wave",
    spell: {
      name: "Deep Rotting Wounds",
      description: "Enemies with Doom Marks suffer +1d6 bonus damage from all sources, and their movement speed is reduced by 10 feet.",
      flavorText: "Flesh softens and rots under the gaze of the Seer.",
      source: "talent", class: "Harbinger", treeId: "deaths_seer",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "vulnerability", "slow", "harbinger"]
    },
    rankUpgrades: [
      { description: "Marked foes suffer +1d6 bonus damage and speed reduced by 15 feet." },
      { description: "Marked foes suffer +1d6 bonus damage, speed reduced by 20 feet, and your attacks against them score critical hits on 19+." }
    ]
  },

  // ──────────────── TIER 3 (6 pts) ────────────────
  {
    id: "ds_t3_reap_soul",
    name: "Soul Reaping Harvest",
    icon: "spell_shadow_lifedrain02",
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: "ds_t2_organ_collapse",
    spell: {
      name: "Soul Reaping Harvest",
      description: "Spend 3 Mayhem: rip the soul essence from a marked target within 50 feet. Deals 3d8 blight damage, heals you for 1d6 health, and grants 15 temporary health.",
      flavorText: "Harvesting the unmade soul to sustain the vessel.",
      source: "talent", class: "Harbinger", treeId: "deaths_seer",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "ranged", range: 50,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 14, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mayhem: { baseAmount: 3 } },
      damageTypes: ["blight"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      healing: { dice: "1d6", flat: 0 },
      visualTheme: "wyrd", tags: ["single-nuke", "lifesteal", "temp-hp", "harbinger"]
    },
    rankUpgrades: [
      { description: "Deals 4d8 blight damage, heals for 2d6, grants 20 temp HP.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 }, healing: { dice: "2d6", flat: 0 } },
      { description: "Deals 5d8 blight damage, heals for 2d8, grants 30 temp HP, and silences the target for 1 round.", primaryDamage: { dice: "5d8", flat: 0, procChance: 100 }, healing: { dice: "2d8", flat: 0 } }
    ]
  },
  {
    id: "ds_t3_unmaking_criticality",
    name: "Corrupting Blows",
    icon: "ability_rogue_deadliness",
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: "ds_t2_deep_rot",
    spell: {
      name: "Corrupting Blows",
      description: "All single-target blight spells score critical hits on 19+ and critical hits cause the target to explode for 2d8 blight damage to all nearby foes.",
      flavorText: "Corruption flows through the Wyrd like blood through dying veins.",
      source: "talent", class: "Harbinger", treeId: "deaths_seer",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["blight"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      visualTheme: "wyrd", tags: ["passive", "crit", "corpse-nova", "harbinger"]
    },
    rankUpgrades: [
      { description: "Crits on 18+; explosion deals 3d8 blight damage." },
      { description: "Crits on 18+; explosion deals 4d8 blight, and crits refund 2 Mayhem." }
    ]
  },

  // ──────────────── TIER 4 (5 pts) ────────────────
  {
    id: "ds_t4_unmake_entity",
    name: "Unmake Entity",
    icon: "spell_shadow_shadowwordpain",
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: "ds_t3_reap_soul",
    spell: {
      name: "Unmake Entity",
      description: "Spend 4 Mayhem: target an enemy within 45 feet. Deals 4d8 blight damage (deals +30 points damage if target is below half maximum Hit Points). If the target dies, raise them as a decaying revenant servant for 1 minute.",
      flavorText: "The Wyrd unmakes what it once created, claiming its due.",
      source: "talent", class: "Harbinger", treeId: "deaths_seer",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "ranged", range: 45,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 20, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mayhem: { baseAmount: 4 } },
      damageTypes: ["blight"],
      primaryDamage: { dice: "4d8", flat: 0, procChance: 100 },
      visualTheme: "wyrd", tags: ["execute", "raise-dead", "harbinger"]
    },
    rankUpgrades: [
      { description: "Deals 5d8 blight damage; revenant lasts 2 minutes and deals 1d8 blight on attack.", primaryDamage: { dice: "5d8", flat: 0, procChance: 100 }, cooldownValue: 18 },
      { description: "Deals 6d8 blight damage; kills refund 3 Mayhem.", primaryDamage: { dice: "6d8", flat: 0, procChance: 100 }, cooldownValue: 16 }
    ]
  },
  {
    id: "ds_t4_death_siphon",
    name: "Soul Harvest Economy",
    icon: "spell_arcane_arcanetorrent",
    maxRanks: 2,
    position: { x: 3.5, y: 3 },
    requires: "ds_t3_unmaking_criticality",
    spell: {
      name: "Soul Harvest Economy",
      description: "Whenever an enemy dies from your spells or while marked, you gain 4 Mayhem, restore 15 mana, and heal for 10 points max HP.",
      flavorText: "Death pays the greatest dividend.",
      source: "talent", class: "Harbinger", treeId: "deaths_seer",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "sustain", "mayhem-on-kill", "harbinger"]
    },
    rankUpgrades: [
      { description: "Kills grant 6 Mayhem, restore 30 mana, and heal for 15 points max HP." }
    ]
  },

  // ──────────────── TIER 5 (5 pts) ────────────────
  {
    id: "ds_t5_eternal_decay",
    name: "Oblivion's Black Sun",
    icon: "spell_shadow_shadowbolt",
    maxRanks: 2,
    position: { x: 1, y: 4 },
    requires: "ds_t4_unmake_entity",
    spell: {
      name: "Oblivion's Black Sun",
      description: "Spend 5 Mayhem: summon an abyssal black sun over the battlefield for 3 rounds. Deals 3d6 blight damage per round to all marked enemies and prevents them from receiving healing.",
      flavorText: "The black sun that casts no shadow.",
      source: "talent", class: "Harbinger", treeId: "deaths_seer",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 30, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { mayhem: { baseAmount: 5 } },
      damageTypes: ["blight"],
      primaryDamage: { dice: "3d6", flat: 0, procChance: 100 },
      isDot: true, dotDuration: 3, dotTick: "3d6",
      visualTheme: "wyrd", tags: ["black-sun", "heal-block", "harbinger"]
    },
    rankUpgrades: [
      { description: "Deals 4d6 blight per round, silences all marked enemies, and lasts 4 rounds.", dotTick: "4d6", cooldownValue: 24 }
    ]
  },
  {
    id: "ds_t5_undead_mastery",
    name: "Army of the Fallen Wyrd",
    icon: "spell_shadow_chilltouch",
    maxRanks: 3,
    position: { x: 3, y: 4 },
    requires: "ds_t4_death_siphon",
    spell: {
      name: "Army of the Fallen Wyrd",
      description: "You can maintain up to 3 revenant servants simultaneously. Revenants have +25 points health and +2 Durability Steps to equipped durability.",
      flavorText: "Keth-Amar defies even death, raising what it consumes.",
      source: "talent", class: "Harbinger", treeId: "deaths_seer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "pet-cap", "undead-buff", "harbinger"]
    },
    rankUpgrades: [
      { description: "Maintain up to 4 revenants; revenants explode for 3d8 blight on death." },
      { description: "Maintain up to 5 revenants; revenants explode for 4d8 blight on death." }
    ]
  },

  // ──────────────── TIER 6 (5 pts) ────────────────
  {
    id: "ds_t6_death_incarnate",
    name: "Death Incarnate",
    icon: "spell_shadow_curseofsargeras",
    maxRanks: 1,
    position: { x: 1, y: 5 },
    requires: "ds_t5_eternal_decay",
    spell: {
      name: "Death Incarnate",
      description: "Spend 6 Mayhem: become the Living Incarnation of Death for 1 minute: your single-target blight spells deal +1d8 bonus damage to marked enemies, execute non-boss targets below half maximum Hit Points instantly, and you gain +2 Durability Steps to equipped durability.",
      flavorText: "The final seer of mortality takes the throne.",
      source: "talent", class: "Harbinger", treeId: "deaths_seer",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 90, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { mayhem: { baseAmount: 6 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      buffs: ["death-incarnate"], visualTheme: "wyrd", tags: ["god-mode", "instant-execute", "maximize", "harbinger"]
    },
    rankUpgrades: []
  },
  {
    id: "ds_t6_doom_penetration",
    name: "Absolute Oblivion",
    icon: "spell_shadow_shadowwordpain",
    maxRanks: 2,
    position: { x: 2.5, y: 5 },
    requires: "ds_t5_undead_mastery",
    spell: {
      name: "Absolute Oblivion",
      description: "All your blight spells ignore 30 points of enemy durability and resistance.",
      flavorText: "Oblivion recognizes no armor.",
      source: "talent", class: "Harbinger", treeId: "deaths_seer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["blight"],
      visualTheme: "wyrd", tags: ["passive", "true-damage", "penetration", "harbinger"]
    },
    rankUpgrades: [
      { description: "Blight spells ignore 35 points of enemy durability and resistance and score critical hits on 18+." }
    ]
  },
  {
    id: "ds_t6_undying_shroud",
    name: "Phylactery Shroud",
    icon: "spell_holy_powerwordbarrier",
    maxRanks: 2,
    position: { x: 4, y: 5 },
    requires: "ds_t5_undead_mastery",
    spell: {
      name: "Phylactery Shroud",
      description: "While you maintain at least 1 active revenant, 35 points of damage you take is redirected into your revenant instead.",
      flavorText: "The servant absorbs the fatal wound.",
      source: "talent", class: "Harbinger", treeId: "deaths_seer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "damage-redirect", "defense", "harbinger"]
    },
    rankUpgrades: [
      { description: "Redirect 35 points of damage into revenants, and when a revenant dies from redirected damage, you gain 3 Mayhem." }
    ]
  },

  // ──────────────── TIER 7 / CAPSTONE (15 pts) ────────────────
  {
    id: "ds_t7_avatar_of_the_reaper",
    name: "Avatar of the Black Reaper",
    icon: "spell_shadow_shadowwordpain",
    maxRanks: 1,
    position: { x: 0.5, y: 6 },
    requires: "ds_t6_death_incarnate",
    spell: {
      name: "Avatar of the Black Reaper",
      description: "ULTIMATE: Spend 10 Mayhem: summon the Great Scythe of Keth-Amar for 1 minute: all marked enemies take 8d10 blight damage every round, any target below half maximum Hit Points is executed instantly, and each death raises a giant undead behemoth for 1 minute.",
      flavorText: "The harvest is complete. No seed remains ungathered.",
      source: "talent", class: "Harbinger", treeId: "deaths_seer",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 180, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { mayhem: { baseAmount: 10 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      damageTypes: ["blight"],
      primaryDamage: { dice: "8d10", flat: 0, procChance: 100 },
      buffs: ["black-reaper"], visualTheme: "wyrd", tags: ["ultimate", "capstone", "mass-execute", "harbinger"]
    },
    rankUpgrades: []
  },
  {
    id: "ds_t7_deaths_seer_doctrine",
    name: "Death's Seer Doctrine",
    icon: "spell_shadow_chilltouch",
    maxRanks: 5,
    position: { x: 1.5, y: 6 },
    requires: "ds_t6_death_incarnate",
    spell: {
      name: "Death's Seer Doctrine",
      description: "All single-target blight and doom damage you deal is increased by +1d6 damage.",
      flavorText: "The gaze of the Seer is the end of the journey.",
      source: "talent", class: "Harbinger", treeId: "deaths_seer",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["blight"],
      visualTheme: "wyrd", tags: ["passive", "capstone", "damage", "harbinger"]
    },
    rankUpgrades: [
      { description: "All single-target blight damage increased by +1d6 damage." },
      { description: "All single-target blight damage increased by +1d6 damage." },
      { description: "All single-target blight damage increased by +1d8 damage." },
      { description: "All single-target blight damage increased by +1d8 damage, and Death Mark Strike costs 0 mana." }
    ]
  },
  {
    id: "ds_t7_infinite_doom_engine",
    name: "Endless Soul Siphon Reservoir",
    icon: "spell_shadow_lifedrain02",
    maxRanks: 3,
    position: { x: 2.5, y: 6 },
    requires: "ds_t6_doom_penetration",
    spell: {
      name: "Endless Soul Siphon Reservoir",
      description: "Your maximum Mayhem increases by 8. Whenever an enemy dies from your blight damage, generate 1 Mayhem.",
      flavorText: "Every cut pays a royalty in dark energy.",
      source: "talent", class: "Harbinger", treeId: "deaths_seer",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "capstone", "mayhem-engine", "harbinger"]
    },
    rankUpgrades: [
      { description: "Max Mayhem +10; generate 2 Mayhem per kill and movement speed +10ft." },
      { description: "Max Mayhem +12; generate 3 Mayhem per kill and abilities cost 1 fewer Mayhem." }
    ]
  },
  {
    id: "ds_t7_guaranteed_execution",
    name: "Certain Death Principle",
    icon: "ability_rogue_shadowdance",
    maxRanks: 3,
    position: { x: 3.5, y: 6 },
    requires: "ds_t6_doom_penetration",
    spell: {
      name: "Certain Death Principle",
      description: "Your attacks against marked targets deal +1d6 bonus damage and score critical hits on 19+.",
      flavorText: "What the Seer writes, fate cannot erase.",
      source: "talent", class: "Harbinger", treeId: "deaths_seer",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "capstone", "execute", "harbinger"]
    },
    rankUpgrades: [
      { description: "Attacks against marked targets deal +1d6 bonus damage and execute non-boss targets below half maximum Hit Points." },
      { description: "Attacks against marked targets deal +1d8 bonus damage, execute below half maximum Hit Points, and kills refund 3 Mayhem." }
    ]
  },
  {
    id: "ds_t7_death_rebirth",
    name: "Necrotic Ascendance Rebirth",
    icon: "spell_holy_resurrection",
    maxRanks: 3,
    position: { x: 4.5, y: 6 },
    requires: "ds_t6_undying_shroud",
    spell: {
      name: "Necrotic Ascendance Rebirth",
      description: "While at 3+ Mayhem, lethal damage dissolves you into necrotic mist instead: prevents death, restores 24 Hit Points and 30 temp HP, and sets Mayhem to 5 (cooldown: 180s).",
      flavorText: "Death cannot claim its own master.",
      source: "talent", class: "Harbinger", treeId: "deaths_seer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "capstone", "cheat-death", "harbinger"]
    },
    rankUpgrades: [
      { description: "Survive lethal damage, restores 36 Hit Points, 40 temp HP, full Mayhem (cooldown: 120s)." },
      { description: "Survive lethal damage, restores 45 Hit Points, 50 temp HP (cooldown: 90s)." }
    ]
  }
];

// ============================================
// 3. HARBINGER — FATE RIFT
// ============================================
export const HARBINGER_FATE_RIFT = [
  // ──────────────── TIER 1 (8 pts) ────────────────
  {
    id: "fr_t1_void_tear",
    name: "Void Tear Strike",
    icon: "spell_arcane_blast",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Void Tear Strike",
      description: "Tear open a dimensional void rift at a target location within 45 feet: deals 2d6 wyrd damage to all enemies in a 15-foot area and generates 1 Mayhem.",
      flavorText: "Ripping the fabric of space to reveal the hungry abyss behind it.",
      source: "talent", class: "Harbinger", treeId: "fate_rift",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "ranged", range: 45, aoeShape: "circle", aoeSize: 15,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 6, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 4 } },
      damageTypes: ["arcane", "wyrd"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      visualTheme: "wyrd", tags: ["rift", "aoe", "mayhem-builder", "harbinger"]
    },
    rankUpgrades: [
      { description: "20-foot rift deals 3d6 wyrd damage, pulls enemies 10ft inward, and generates 1 Mayhem.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 }, aoeSize: 20 },
      { description: "25-foot rift deals 3d6 wyrd damage, pulls 15ft inward, and generates 2 Mayhem.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 }, aoeSize: 25, cooldownValue: 8 }
    ]
  },
  {
    id: "fr_t1_spatial_instability",
    name: "Spatial Instability",
    icon: "spell_arcane_blink",
    maxRanks: 3,
    position: { x: 2.5, y: 0 },
    requires: null,
    spell: {
      name: "Spatial Instability",
      description: "All your void and force spells deal +5 points increased damage, and your movement speed increases by +10 feet.",
      flavorText: "Space bends easily to those who know where it is torn.",
      source: "talent", class: "Harbinger", treeId: "fate_rift",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["arcane"],
      visualTheme: "wyrd", tags: ["passive", "void-amp", "speed", "harbinger"]
    },
    rankUpgrades: [
      { description: "+8 points void damage, speed +15 feet, and you can teleport 10ft as a bonus action." },
      { description: "+10 points void damage, speed +20 feet, and attacks ignore 2 Damage Reduction." }
    ]
  },
  {
    id: "fr_t1_rift_insulation",
    name: "Rift Phasing",
    icon: "spell_arcane_arcaneresilience",
    maxRanks: 2,
    position: { x: 4, y: 0 },
    requires: null,
    spell: {
      name: "Rift Phasing",
      description: "While standing within 20 feet of any active void rift, you gain +2 Durability Steps to equipped durability and take 15 points less magical damage.",
      flavorText: "Half-phased into the spaces between worlds.",
      source: "talent", class: "Harbinger", treeId: "fate_rift",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "rift-defense", "durability", "harbinger"]
    },
    rankUpgrades: [
      { description: "Gain +3 Durability Steps to equipped durability, 6 Damage Reduction against magical, and heal 1d8 per round near rifts." }
    ]
  },

  // ──────────────── TIER 2 (6 pts) ────────────────
  {
    id: "fr_t2_rift_collapse",
    name: "Gravitational Singularity Collapse",
    icon: "spell_shadow_mindtwisting",
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: "fr_t1_void_tear",
    spell: {
      name: "Gravitational Singularity Collapse",
      description: "Spend 3 Mayhem: violently collapse an active void rift within 50 feet. Deals 3d8 arcane damage to all enemies within 25 feet and pulls them to the singularity epicenter.",
      flavorText: "The rift snaps shut like an iron jaw.",
      source: "talent", class: "Harbinger", treeId: "fate_rift",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "ranged", range: 50, aoeShape: "circle", aoeSize: 25,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 8, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mayhem: { baseAmount: 3 } },
      damageTypes: ["arcane"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      debuffs: ["singularity-pull"], visualTheme: "wyrd", tags: ["aoe", "vortex", "nuke", "harbinger"]
    },
    rankUpgrades: [
      { description: "30-foot collapse deals 4d8 arcane damage and stuns all victims for 1 round.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 }, aoeSize: 30 },
      { description: "35-foot collapse deals 4d8 arcane damage, stuns for 1 round, and immediately opens 2 new rifts.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 }, aoeSize: 35 }
    ]
  },
  {
    id: "fr_t2_rift_synergy",
    name: "Resonating Rifts",
    icon: "spell_arcane_arcanetorrent",
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: "fr_t1_spatial_instability",
    spell: {
      name: "Resonating Rifts",
      description: "Whenever an enemy is within 15 feet of multiple active rifts, they take +5 points increased damage from all sources per rift.",
      flavorText: "Torn space amplifies every vibration.",
      source: "talent", class: "Harbinger", treeId: "fate_rift",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "rift-overlap", "vulnerability", "harbinger"]
    },
    rankUpgrades: [
      { description: "Take +8 points increased damage per rift and have -1 to saving throws." },
      { description: "Take +10 points increased damage per rift and -2 to saving throws." }
    ]
  },

  // ──────────────── TIER 3 (6 pts) ────────────────
  {
    id: "fr_t3_dimensional_shred",
    name: "Dimensional Shredder",
    icon: "spell_arcane_blast",
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: "fr_t2_rift_collapse",
    spell: {
      name: "Dimensional Shredder",
      description: "Spend 4 Mayhem: link two active rifts with a 40-foot laser wire of hyper-dense void energy. Deals 4d8 arcane damage to all enemies crossing the line and shears 25 points of their durability.",
      flavorText: "A wire cut directly from the edge of reality.",
      source: "talent", class: "Harbinger", treeId: "fate_rift",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "line", aoeSize: 40,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 14, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { mayhem: { baseAmount: 4 } },
      damageTypes: ["arcane"],
      primaryDamage: { dice: "4d8", flat: 0, procChance: 100 },
      debuffs: ["armor-sunder"], visualTheme: "wyrd", tags: ["line", "wire", "sunder", "harbinger"]
    },
    rankUpgrades: [
      { description: "50-foot wire deals 5d8 arcane damage, shears 30 points of enemy durability, cooldown drops to 12s.", primaryDamage: { dice: "5d8", flat: 0, procChance: 100 }, cooldownValue: 12 },
      { description: "60-foot wire deals 6d8 arcane damage, shears 35 points of enemy durability, and silences targets for 1 round.", primaryDamage: { dice: "6d8", flat: 0, procChance: 100 }, cooldownValue: 10 }
    ]
  },
  {
    id: "fr_t3_void_overflow",
    name: "Void Leech",
    icon: "spell_shadow_lifedrain",
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: "fr_t2_rift_synergy",
    spell: {
      name: "Void Leech",
      description: "All void and rift damage you deal heals you and all allies for 10 points of the damage dealt. Overheal grants temporary health up to 20.",
      flavorText: "The empty space feeds the flesh.",
      source: "talent", class: "Harbinger", treeId: "fate_rift",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "lifesteal", "party-heal", "harbinger"]
    },
    rankUpgrades: [
      { description: "Heal for 15 points of void damage; temp HP caps at 30." },
      { description: "Heal for 20 points of void damage; temp HP caps at 40 and grants +2 Durability Steps to equipped durability." }
    ]
  },

  // ──────────────── TIER 4 (5 pts) ────────────────
  {
    id: "fr_t4_void_nova",
    name: "Fate Rift Super-Singularity",
    icon: "spell_arcane_starfire",
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: "fr_t3_dimensional_shred",
    spell: {
      name: "Fate Rift Super-Singularity",
      description: "Spend 5 Mayhem: create a colossal 35-foot black hole within 60 feet for 3 rounds: deals 3d6 arcane damage per round to all enemies inside, and pulls in all enemies across the battlefield.",
      flavorText: "An event horizon summoned on mortal ground.",
      source: "talent", class: "Harbinger", treeId: "fate_rift",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "ranged", range: 60, aoeShape: "circle", aoeSize: 35,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 20, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mayhem: { baseAmount: 5 } },
      damageTypes: ["arcane"],
      primaryDamage: { dice: "3d6", flat: 0, procChance: 100 },
      isDot: true, dotDuration: 3, dotTick: "3d6",
      visualTheme: "wyrd", tags: ["black-hole", "mass-pull", "nuke", "harbinger"]
    },
    rankUpgrades: [
      { description: "40-foot singularity deals 4d6 per round and silences enemies inside.", dotTick: "4d6", aoeSize: 40 },
      { description: "45-foot singularity deals 5d6 per round, silences, and shatters for 4d6 upon collapsing.", dotTick: "5d6", aoeSize: 45 }
    ]
  },
  {
    id: "fr_t4_multi_rift_capacity",
    name: "Endless Rift Network",
    icon: "spell_arcane_portalshattrath",
    maxRanks: 2,
    position: { x: 3.5, y: 3 },
    requires: "fr_t3_void_overflow",
    spell: {
      name: "Endless Rift Network",
      description: "You may maintain up to 4 active void rifts simultaneously, and rifts last 2 minutes without expiring.",
      flavorText: "Turning the battlefield into a perforated sheet of space.",
      source: "talent", class: "Harbinger", treeId: "fate_rift",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "rift-cap", "harbinger"]
    },
    rankUpgrades: [
      { description: "Maintain up to 7 rifts simultaneously; you and allies can teleport between any active rifts as a free action." }
    ]
  },

  // ──────────────── TIER 5 (5 pts) ────────────────
  {
    id: "fr_t5_event_horizon_implosion",
    name: "Event Horizon Implosion",
    icon: "spell_shadow_mindtwisting",
    maxRanks: 2,
    position: { x: 1, y: 4 },
    requires: "fr_t4_void_nova",
    spell: {
      name: "Event Horizon Implosion",
      description: "Spend 6 Mayhem: detonate ALL active void rifts simultaneously in a cataclysmic chain reaction. Deals 4d8 arcane damage per rift to all nearby enemies and sunders 25 points of enemy durability and wards.",
      flavorText: "All holes in reality collapsing inward together.",
      source: "talent", class: "Harbinger", treeId: "fate_rift",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 30, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { mayhem: { baseAmount: 6 } },
      damageTypes: ["arcane"],
      primaryDamage: { dice: "4d8", flat: 0, procChance: 100 },
      debuffs: ["ward-strip"], visualTheme: "wyrd", tags: ["chain-detonate", "mass-nuke", "dispel", "harbinger"]
    },
    rankUpgrades: [
      { description: "Deals 5d8 damage per rift, stuns all enemies for 1 round, and cooldown drops to 24s.", primaryDamage: { dice: "5d8", flat: 0, procChance: 100 }, cooldownValue: 24 }
    ]
  },
  {
    id: "fr_t5_spatial_sovereignty",
    name: "Void Entity Dominion",
    icon: "spell_arcane_arcaneresilience",
    maxRanks: 3,
    position: { x: 3, y: 4 },
    requires: "fr_t4_multi_rift_capacity",
    spell: {
      name: "Void Entity Dominion",
      description: "Your maximum Mayhem increases by 6. At 5+ Mayhem, you can phase through solid walls, gain 4 Damage Reduction, and your attacks cannot be parried.",
      flavorText: "Existing partially beyond physical space.",
      source: "talent", class: "Harbinger", treeId: "fate_rift",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "noclip", "dr", "harbinger"]
    },
    rankUpgrades: [
      { description: "Max Mayhem +8; gain 6 Damage Reduction, and attacks ignore 20 points of enemy durability." },
      { description: "Max Mayhem +10; gain 6 Damage Reduction, attacks ignore 30 points of enemy durability and score crits on 19+." }
    ]
  },

  // ──────────────── TIER 6 (5 pts) ────────────────
  {
    id: "fr_t6_the_abyssal_rift",
    name: "The Abyssal Riftway",
    icon: "spell_arcane_portalshattrath",
    maxRanks: 1,
    position: { x: 1, y: 5 },
    requires: "fr_t5_event_horizon_implosion",
    spell: {
      name: "The Abyssal Riftway",
      description: "Spend 7 Mayhem: tear a massive gateway into the Deep Void for 1 minute: all enemies within 60 feet are pulled 15ft toward the gateway each round and take 4d6 arcane damage per round, while all allies gain +30 points movement speed.",
      flavorText: "The doors to the deep dark are thrown wide open.",
      source: "talent", class: "Harbinger", treeId: "fate_rift",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 90, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { mayhem: { baseAmount: 7 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      damageTypes: ["arcane"],
      primaryDamage: { dice: "4d6", flat: 0, procChance: 100 },
      buffs: ["abyssal-riftway"], visualTheme: "wyrd", tags: ["mass-pull", "climax", "harbinger"]
    },
    rankUpgrades: []
  },
  {
    id: "fr_t6_void_criticality",
    name: "Singularity Overload Crits",
    icon: "spell_arcane_blast",
    maxRanks: 2,
    position: { x: 2.5, y: 5 },
    requires: "fr_t5_spatial_sovereignty",
    spell: {
      name: "Singularity Overload Crits",
      description: "All void and force spells score critical hits on 18+ and critical hits instantly open a new void rift at the target's feet.",
      flavorText: "A wound in the target that opens a wound in space.",
      source: "talent", class: "Harbinger", treeId: "fate_rift",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["arcane"],
      visualTheme: "wyrd", tags: ["passive", "crit", "auto-rift", "harbinger"]
    },
    rankUpgrades: [
      { description: "Critical hits on 17+ and crits deal +1d8 bonus damage." }
    ]
  },
  {
    id: "fr_t6_rift_sanctuary",
    name: "Spatial Distortion Shell",
    icon: "spell_holy_powerwordbarrier",
    maxRanks: 2,
    position: { x: 4, y: 5 },
    requires: "fr_t5_spatial_sovereignty",
    spell: {
      name: "Spatial Distortion Shell",
      description: "You and all allies gain a permanent 40-damage void ward that regenerates 10 points every round.",
      flavorText: "Bent space absorbing the edge of every strike.",
      source: "talent", class: "Harbinger", treeId: "fate_rift",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "regenerating-shield", "defense", "harbinger"]
    },
    rankUpgrades: [
      { description: "Ward capacity 60 temp HP, regenerates 15 points per round, and reflects 25 points damage." }
    ]
  },

  // ──────────────── TIER 7 / CAPSTONE (15 pts) ────────────────
  {
    id: "fr_t7_avatar_of_the_void_weaver",
    name: "Avatar of the Singularity Sovereign",
    icon: "spell_shadow_mindtwisting",
    maxRanks: 1,
    position: { x: 0.5, y: 6 },
    requires: "fr_t6_the_abyssal_rift",
    spell: {
      name: "Avatar of the Singularity Sovereign",
      description: "ULTIMATE: Spend 10 Mayhem: collapse all dimensional boundaries for 1 minute: 10 void rifts open across the arena, dealing 8d10 arcane damage every round divided among enemies, you gain 8 Damage Reduction, and your spells cast instantly.",
      flavorText: "You are the center of the singularity. Nothing escapes.",
      source: "talent", class: "Harbinger", treeId: "fate_rift",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 180, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { mayhem: { baseAmount: 10 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      damageTypes: ["arcane"],
      primaryDamage: { dice: "8d10", flat: 0, procChance: 100 },
      buffs: ["singularity-sovereign"], visualTheme: "wyrd", tags: ["ultimate", "capstone", "damage-reduction", "harbinger"]
    },
    rankUpgrades: []
  },
  {
    id: "fr_t7_fate_rift_doctrine",
    name: "Fate Rift Doctrine",
    icon: "spell_arcane_blast",
    maxRanks: 5,
    position: { x: 1.5, y: 6 },
    requires: "fr_t6_the_abyssal_rift",
    spell: {
      name: "Fate Rift Doctrine",
      description: "All void, force, and rift damage you deal is increased by +1d6 damage.",
      flavorText: "The fabric of space tears obediently.",
      source: "talent", class: "Harbinger", treeId: "fate_rift",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["arcane"],
      visualTheme: "wyrd", tags: ["passive", "capstone", "damage", "harbinger"]
    },
    rankUpgrades: [
      { description: "All void and rift damage increased by +1d6 damage." },
      { description: "All void and rift damage increased by +1d6 damage." },
      { description: "All void and rift damage increased by +1d8 damage." },
      { description: "All void and rift damage increased by +1d8 damage, and Void Tear Strike costs 0 mana." }
    ]
  },
  {
    id: "fr_t7_infinite_rift_engine",
    name: "Perpetual Void Generator",
    icon: "spell_arcane_portalshattrath",
    maxRanks: 3,
    position: { x: 2.5, y: 6 },
    requires: "fr_t6_void_criticality",
    spell: {
      name: "Perpetual Void Generator",
      description: "Your maximum Mayhem increases by 8. Whenever an active rift deals damage to an enemy, generate 1 Mayhem (once per round per rift).",
      flavorText: "An endless siphon from the extra-dimensional depths.",
      source: "talent", class: "Harbinger", treeId: "fate_rift",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "capstone", "mayhem-engine", "harbinger"]
    },
    rankUpgrades: [
      { description: "Max Mayhem +10; generate 2 Mayhem per rift per round and movement speed +10ft." },
      { description: "Max Mayhem +12; generate 2 Mayhem per rift per round and rift abilities cost 1 fewer Mayhem." }
    ]
  },
  {
    id: "fr_t7_hyper_spatial_crush",
    name: "Hyper-Spatial Crush",
    icon: "spell_shadow_mindtwisting",
    maxRanks: 3,
    position: { x: 3.5, y: 6 },
    requires: "fr_t6_void_criticality",
    spell: {
      name: "Hyper-Spatial Crush",
      description: "When enemies are pulled into a void rift, they are crushed for an additional 3d8 arcane damage.",
      flavorText: "Gravity so dense it flattens bone to foil.",
      source: "talent", class: "Harbinger", treeId: "fate_rift",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["arcane"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      visualTheme: "wyrd", tags: ["passive", "capstone", "pull-crush", "harbinger"]
    },
    rankUpgrades: [
      { description: "Crush deals 4d8 arcane damage and stuns for 1 round." },
      { description: "Crush deals 5d8 arcane damage, stuns for 1 round, and refunds 2 Mayhem." }
    ]
  },
  {
    id: "fr_t7_rift_rebirth",
    name: "Dimensional Shift Rebirth",
    icon: "spell_arcane_blink",
    maxRanks: 3,
    position: { x: 4.5, y: 6 },
    requires: "fr_t6_rift_sanctuary",
    spell: {
      name: "Dimensional Shift Rebirth",
      description: "While at 3+ Mayhem, lethal damage shifts your body into an active void rift: prevents death, restores 24 Hit Points and 30 temp HP, sets Mayhem to 5, and teleports you 40 feet away (cooldown: 180s).",
      flavorText: "You slipped into the rift before the executioner finished the swing.",
      source: "talent", class: "Harbinger", treeId: "fate_rift",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "wyrd", tags: ["passive", "capstone", "cheat-death", "harbinger"]
    },
    rankUpgrades: [
      { description: "Survive lethal damage, restores 36 Hit Points, 40 temp HP, full Mayhem (cooldown: 120s)." },
      { description: "Survive lethal damage, restores 45 Hit Points, 50 temp HP (cooldown: 90s)." }
    ]
  }
];
