// ============================================
// ANIMIST TALENT TREES (v3: full v2/v3 active/passive spec identity overhaul)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50 pts per tree.
//
// SPECS:
//   1. THORNWARDEN:  The Swamp Shaman / Bone Bastion / Zone Controller.
//   2. SPIRIT BINDER: The Ancestral Pack Summoner / Soul Harvester.
//   3. STORMSCRIBE:   The Galvanic Runic Totemist / Storm Inscriber.
// ============================================

// ============================================
// 1. ANIMIST — THORNWARDEN
// ============================================
export const ANIMIST_THORNWARDEN = [
  // ──────────────── TIER 1 (8 pts) ────────────────
  {
    id: "tw_t1_bone_barricade",
    name: "Bone Barricade",
    icon: "spell_nature_stranglevines",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Bone Barricade",
      description: "Erupt a 20-foot wall of petrified bone and mycelium within 40 feet for 1 minute: blocks movement and line of sight. Enemies adjacent to the wall take 2d6 piercing damage per turn.",
      flavorText: "Fungal growths burst from hallowed earth to form razor barricades.",
      source: "talent", class: "Animist", treeId: "thornwarden",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "aoe", rangeType: "ranged", range: 40, aoeShape: "line", aoeSize: 20,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 8, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 4 } },
      damageTypes: ["smashing"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      visualTheme: "primal", tags: ["wall", "terrain", "hazard", "animist"]
    },
    rankUpgrades: [
      { description: "30-foot wall deals 3d6 piercing damage and grants adjacent allies +2 Durability Steps to equipped durability.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 }, aoeSize: 30 },
      { description: "40-foot wall deals 4d6 piercing damage, grants +3 Durability Steps to equipped durability, and roots enemies touching it for 1 round.", primaryDamage: { dice: "4d6", flat: 0, procChance: 100 }, aoeSize: 40 }
    ]
  },
  {
    id: "tw_t1_calcified_skeleton",
    name: "Calcified Skeleton",
    icon: "ability_warrior_shieldwall",
    maxRanks: 3,
    position: { x: 2.5, y: 0 },
    requires: null,
    spell: {
      name: "Calcified Skeleton",
      description: "Bryngloom fungal threads weave through bone to fortify the frame. Gain +2 Durability Steps to equipped durability and 10 points physical damage resistance.",
      flavorText: "The swamp's bone remembers the ancient weight.",
      source: "talent", class: "Animist", treeId: "thornwarden",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "durability", "dr", "animist"]
    },
    rankUpgrades: [
      { description: "Gain +4 Durability Steps to equipped durability and 4 Damage Reduction against physical." },
      { description: "Gain +6 Durability Steps to equipped durability, 6 Damage Reduction against physical, and +4 Damage Reduction to all magical damage." }
    ]
  },
  {
    id: "tw_t1_swamp_anchor",
    name: "Swamp Anchor",
    icon: "spell_holy_borrowedtime",
    maxRanks: 2,
    position: { x: 4, y: 0 },
    requires: null,
    spell: {
      name: "Swamp Anchor",
      description: "You cannot be knocked down or forcibly moved. When standing near a totem or bone wall, you gain 1 Resonance per turn.",
      flavorText: "Rooted where the deep bog drinks.",
      source: "talent", class: "Animist", treeId: "thornwarden",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "immunity", "resonance", "animist"]
    },
    rankUpgrades: [
      { description: "Immune to displacement; gain 2 Resonance per turn near totems and +10 points maximum health." }
    ]
  },

  // ──────────────── TIER 2 (6 pts) ────────────────
  {
    id: "tw_t2_ribcage_prison",
    name: "Ribcage Prison",
    icon: "spell_shadow_stranglevines",
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: "tw_t1_bone_barricade",
    spell: {
      name: "Ribcage Prison",
      description: "Spend 2 Resonance: erupt a cage of jagged ribs around a target within 45 feet for 2 rounds. Target is locked down (incapacitated and immobilized) and takes 3d8 piercing damage.",
      flavorText: "Spirits of the deep mire ensnare the living in bone.",
      source: "talent", class: "Animist", treeId: "thornwarden",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "single", rangeType: "ranged", range: 45,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 10, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { resonance: { baseAmount: 2 } },
      damageTypes: ["smashing"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      debuffs: ["lockdown"], visualTheme: "primal", tags: ["cc", "lockdown", "nuke", "animist"]
    },
    rankUpgrades: [
      { description: "Deals 4d8 piercing damage, lockdown lasts 2 rounds, and target takes -4 Durability Steps to target's durability while caged.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 } },
      { description: "Deals 6d8 piercing damage, lockdown lasts 3 rounds, and cage reflects 50 points damage dealt to it onto trapped foe.", primaryDamage: { dice: "6d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "tw_t2_thorn_reaction",
    name: "Spore Barbs",
    icon: "spell_nature_thorns",
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: "tw_t1_calcified_skeleton",
    spell: {
      name: "Spore Barbs",
      description: "Attackers who strike you or allies near your bone walls take 2d6 piercing and blight damage in retaliation.",
      flavorText: "Every thorn is hollow and thirsty.",
      source: "talent", class: "Animist", treeId: "thornwarden",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["smashing", "blight"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      visualTheme: "primal", tags: ["passive", "thorns", "retaliation", "animist"]
    },
    rankUpgrades: [
      { description: "Thorns deal 3d6 piercing/blight damage and slow attackers by 10ft.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } },
      { description: "Thorns deal 4d6 piercing/blight damage, slow by 20ft, and restore 1 Resonance to you on proc.", primaryDamage: { dice: "4d6", flat: 0, procChance: 100 } }
    ]
  },

  // ──────────────── TIER 3 (6 pts) ────────────────
  {
    id: "tw_t3_thorn_eruption",
    name: "Thorn Eruption",
    icon: "spell_fire_selfdestruct",
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: "tw_t2_ribcage_prison",
    spell: {
      name: "Thorn Eruption",
      description: "Spend 3 Resonance: cause all your active bone walls and cages to violently detonate in a hail of razor shards. Deals 5d10 piercing damage to all enemies within 20 feet of any structure.",
      flavorText: "The structure collapses outward with lethal speed.",
      source: "talent", class: "Animist", treeId: "thornwarden",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 20,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 16, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { resonance: { baseAmount: 3 } },
      damageTypes: ["smashing"],
      primaryDamage: { dice: "5d10", flat: 0, procChance: 100 },
      visualTheme: "primal", tags: ["shatter", "aoe", "nuke", "animist"]
    },
    rankUpgrades: [
      { description: "Deals 7d10 piercing damage across 25 feet and bleeds all victims for 2d6 per round.", primaryDamage: { dice: "7d10", flat: 0, procChance: 100 } },
      { description: "Deals 9d10 piercing damage across 30 feet, bleeds for 3d6, and immediately resets Bone Barricade cooldown.", primaryDamage: { dice: "9d10", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "tw_t3_scarred_domain",
    name: "Scarred Domain",
    icon: "inv_misc_scalesofjustice",
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: "tw_t2_thorn_reaction",
    spell: {
      name: "Scarred Domain",
      description: "The area within 25 feet of your totems and bone walls becomes corrupt bogland: enemies inside have -2 Durability Steps to target's durability and take 15% more damage from all sources.",
      flavorText: "The Bryngloom's corruption chokes enemy momentum.",
      source: "talent", class: "Animist", treeId: "thornwarden",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "zone-debuff", "sunder", "animist"]
    },
    rankUpgrades: [
      { description: "Enemies in zone take -4 Durability Steps to target's durability and +25% damage from all sources." },
      { description: "Enemies take -6 Durability Steps to target's durability, +35% damage, and cannot regain health while within the domain." }
    ]
  },

  // ──────────────── TIER 4 (5 pts) ────────────────
  {
    id: "tw_t4_mycelial_colossus",
    name: "Mycelial Fortification",
    icon: "ability_warrior_defensivestance",
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: "tw_t3_thorn_eruption",
    spell: {
      name: "Mycelial Fortification",
      description: "Spend 4 Resonance: fortify yourself and all allies within 30 feet with petrified bark for 2 rounds: gain +5 Durability Steps to equipped durability, 6 Damage Reduction against all-damage, and immunity to critical hits.",
      flavorText: "Flesh becomes petrified ironwood.",
      source: "talent", class: "Animist", treeId: "thornwarden",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 24, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { resonance: { baseAmount: 4 } },
      durationRounds: 2, durationRealTime: 12, durationUnit: "seconds",
      buffs: ["petrified-bark"], visualTheme: "primal", tags: ["party-buff", "defense", "durability", "animist"]
    },
    rankUpgrades: [
      { description: "Gain +7 Durability Steps to equipped durability, 8 Damage Reduction, crit immunity for 3 rounds, and grants 30 temporary health.", cooldownValue: 20 },
      { description: "Gain +9 Durability Steps to equipped durability, 10 Damage Reduction, 50 temp HP, and reflects 30 points of absorbed damage back at attackers.", cooldownValue: 16 }
    ]
  },
  {
    id: "tw_t4_earthen_siphon",
    name: "Root Siphon",
    icon: "spell_shadow_lifedrain01",
    maxRanks: 2,
    position: { x: 3.5, y: 3 },
    requires: "tw_t3_scarred_domain",
    spell: {
      name: "Root Siphon",
      description: "Whenever an enemy takes damage from your bone walls, cages, or thorns, you and the lowest-health ally heals for for 2d6 Hit Points.",
      flavorText: "Roots drink deep from the suffering above.",
      source: "talent", class: "Animist", treeId: "thornwarden",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "sustain", "party-heal", "animist"]
    },
    rankUpgrades: [
      { description: "heals for for 3d8 Hit Points, and overheal grants temporary health up to 40." }
    ]
  },

  // ──────────────── TIER 5 (5 pts) ────────────────
  {
    id: "tw_t5_swamp_cataclysm",
    name: "Bog Quake",
    icon: "spell_nature_earthquake",
    maxRanks: 2,
    position: { x: 1, y: 4 },
    requires: "tw_t4_mycelial_colossus",
    spell: {
      name: "Bog Quake",
      description: "Spend 4 Resonance: shatter the ground across a 40-foot radius. Deals 6d10 physical/earth damage, knocks all enemies prone, and covers the entire area in petrified briars for 1 minute.",
      flavorText: "The swamp roars from its bedrock.",
      source: "talent", class: "Animist", treeId: "thornwarden",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 40,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 30, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { resonance: { baseAmount: 4 } },
      damageTypes: ["smashing"],
      primaryDamage: { dice: "6d10", flat: 0, procChance: 100 },
      debuffs: ["knockdown"], visualTheme: "primal", tags: ["aoe", "earthquake", "terrain", "animist"]
    },
    rankUpgrades: [
      { description: "Deals 8d10 damage across 50 feet, stuns all enemies for 1 round, and cooldown drops to 24s.", primaryDamage: { dice: "8d10", flat: 0, procChance: 100 }, cooldownValue: 24 }
    ]
  },
  {
    id: "tw_t5_unyielding_totemist",
    name: "Living Bulwark",
    icon: "inv_misc_scalesofjustice",
    maxRanks: 3,
    position: { x: 3, y: 4 },
    requires: "tw_t4_earthen_siphon",
    spell: {
      name: "Living Bulwark",
      description: "While at 5 or more Resonance, your equipped durability durability cannot be degraded, you gain 6 Damage Reduction from all sources, and you generate 1 free Resonance per turn.",
      flavorText: "An unbroken wall of ancient peat.",
      source: "talent", class: "Animist", treeId: "thornwarden",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "tank", "resonance", "animist"]
    },
    rankUpgrades: [
      { description: "At 5+ Resonance: gain 8 Damage Reduction and generate 2 Resonance per turn." },
      { description: "At 4+ Resonance: gain 10 Damage Reduction, generate 3 Resonance per turn, and your attacks knock enemies back 10ft." }
    ]
  },

  // ──────────────── TIER 6 (5 pts) ────────────────
  {
    id: "tw_t6_the_ironwood_cage",
    name: "The Ironwood Cage",
    icon: "inv_misc_platnumdisks",
    maxRanks: 1,
    position: { x: 1, y: 5 },
    requires: "tw_t5_swamp_cataclysm",
    spell: {
      name: "The Ironwood Cage",
      description: "Spend 6 Resonance: summon an impenetrable colossal ironwood cage around a target within 60 feet for 3 rounds. The target cannot move, attack, or cast spells, while all enemies within 30 feet of the cage are slowed by 15 feet and take 4d8 blight per turn.",
      flavorText: "Ancestral totems erupt with petrified mycelium to imprison the mightiest foe.",
      source: "talent", class: "Animist", treeId: "thornwarden",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "single", rangeType: "ranged", range: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 90, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { resonance: { baseAmount: 6 } },
      durationRounds: 3, durationRealTime: 18, durationUnit: "seconds",
      debuffs: ["imprisoned"], visualTheme: "primal", tags: ["ultimate-lockdown", "boss-trap", "animist"]
    },
    rankUpgrades: []
  },
  {
    id: "tw_t6_petrified_spines",
    name: "Petrified Spines",
    icon: "spell_nature_corrosivebreath",
    maxRanks: 2,
    position: { x: 2.5, y: 5 },
    requires: "tw_t5_unyielding_totemist",
    spell: {
      name: "Petrified Spines",
      description: "All physical and piercing damage you deal ignores up to 4 points of enemy Armor and causes the target to bleed for 3d8 damage over 2 rounds.",
      flavorText: "Razor stone that carves deep memory.",
      source: "talent", class: "Animist", treeId: "thornwarden",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["smashing"],
      visualTheme: "primal", tags: ["passive", "durability-sunder", "bleed", "animist"]
    },
    rankUpgrades: [
      { description: "ignores up to 4 points of enemy Armor; bleed deals 5d8 over 2 rounds and reduces target movement speed by 25ft." }
    ]
  },
  {
    id: "tw_t6_bog_sovereignty",
    name: "Bog Sovereignty",
    icon: "spell_nature_healingway",
    maxRanks: 2,
    position: { x: 4, y: 5 },
    requires: "tw_t5_unyielding_totemist",
    spell: {
      name: "Bog Sovereignty",
      description: "You and all allies within 30 feet heal for 2d8 health at the start of every turn while standing near your structures.",
      flavorText: "The land recognizes its defenders.",
      source: "talent", class: "Animist", treeId: "thornwarden",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "self",
      healing: { dice: "2d8", flat: 0 },
      visualTheme: "primal", tags: ["passive", "regen-aura", "animist"]
    },
    rankUpgrades: [
      { description: "Party heals for 4d8 per turn near structures and gains +3 to all saving throws." }
    ]
  },

  // ──────────────── TIER 7 / CAPSTONE (15 pts) ────────────────
  {
    id: "tw_t7_avatar_of_the_mire",
    name: "Avatar of the Ancient Mire",
    icon: "spell_nature_skinofearth",
    maxRanks: 1,
    position: { x: 0.5, y: 6 },
    requires: "tw_t6_the_ironwood_cage",
    spell: {
      name: "Avatar of the Ancient Mire",
      description: "ULTIMATE: Spend 8 Resonance: transform into the Colossal Swamp Behemoth for 1 minute: gain +8 Durability Steps to equipped durability, 10 Damage Reduction against all-damage, double your melee attack range, and every strike summons a free bone barricade behind the target.",
      flavorText: "You are the swamp awakened in wrath.",
      source: "talent", class: "Animist", treeId: "thornwarden",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 180, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { resonance: { baseAmount: 8 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      buffs: ["avatar-mire"], visualTheme: "primal", tags: ["ultimate", "capstone", "avatar", "animist"]
    },
    rankUpgrades: []
  },
  {
    id: "tw_t7_thornwarden_doctrine",
    name: "Thornwarden Doctrine",
    icon: "ability_warrior_shieldwall",
    maxRanks: 5,
    position: { x: 1.5, y: 6 },
    requires: "tw_t6_the_ironwood_cage",
    spell: {
      name: "Thornwarden Doctrine",
      description: "All physical, piercing, and structure damage you deal is increased by +1d6 damage.",
      flavorText: "Roots deeper than mountains.",
      source: "talent", class: "Animist", treeId: "thornwarden",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["smashing"],
      visualTheme: "primal", tags: ["passive", "capstone", "damage", "animist"]
    },
    rankUpgrades: [
      { description: "All structure and physical damage increased by +1d8 damage." },
      { description: "All structure and physical damage increased by +1d8 damage." },
      { description: "All structure and physical damage increased by +2d8 damage." },
      { description: "All structure and physical damage increased by +2d8 damage, and Bone Barricade costs 0 mana." }
    ]
  },
  {
    id: "tw_t7_infinite_resonance",
    name: "Swamp Heart Reservoir",
    icon: "spell_arcane_arcane04",
    maxRanks: 3,
    position: { x: 2.5, y: 6 },
    requires: "tw_t6_petrified_spines",
    spell: {
      name: "Swamp Heart Reservoir",
      description: "Your maximum Resonance increases by 6. In combat, you start with 4 Resonance.",
      flavorText: "An inexhaustible spring in the dark bog.",
      source: "talent", class: "Animist", treeId: "thornwarden",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "capstone", "resource", "animist"]
    },
    rankUpgrades: [
      { description: "Maximum Resonance +10; start with 6 Resonance and movement speed +15ft." },
      { description: "Maximum Resonance +15; start with full Resonance and all structure cooldowns recover twice as fast." }
    ]
  },
  {
    id: "tw_t7_briar_shatter",
    name: "Briar Cataclysm",
    icon: "spell_nature_thorns",
    maxRanks: 3,
    position: { x: 3.5, y: 6 },
    requires: "tw_t6_bog_sovereignty",
    spell: {
      name: "Briar Cataclysm",
      description: "Thorn reaction strikes score critical hits on 18+ and critical thorn hits refund 1 Resonance.",
      flavorText: "The bog strikes where the bone is bare.",
      source: "talent", class: "Animist", treeId: "thornwarden",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "capstone", "thorns-crit", "animist"]
    },
    rankUpgrades: [
      { description: "Thorns crit on 17+ and deal double damage." },
      { description: "Thorns crit on 16+, deal triple damage, and knock attackers prone." }
    ]
  },
  {
    id: "tw_t7_undying_peat",
    name: "Undying Peat",
    icon: "spell_nature_healingway",
    maxRanks: 3,
    position: { x: 4.5, y: 6 },
    requires: "tw_t6_bog_sovereignty",
    spell: {
      name: "Undying Peat",
      description: "While at 4+ Resonance, lethal damage dissolves you into the mire instead: restores 30 Hit Points, grants 40 temporary health, and encases all nearby enemies in bone cages for 1 round (cooldown: 120s).",
      flavorText: "The swamp does not bury you. It rebuilds you.",
      source: "talent", class: "Animist", treeId: "thornwarden",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "capstone", "cheat-death", "animist"]
    },
    rankUpgrades: [
      { description: "Survive lethal damage, restores 45 Hit Points, 60 temp HP, and encase enemies for 2 rounds (cooldown: 90s)." },
      { description: "Survive lethal damage, restores 60 Hit Points, gain full Resonance, and immediately trigger Bog Quake automatically for free (cooldown: 60s)." }
    ]
  }
];

// ============================================
// 2. ANIMIST — SPIRIT BINDER
// ============================================
export const ANIMIST_SPIRIT_BINDER = [
  // ──────────────── TIER 1 (8 pts) ────────────────
  {
    id: "sb_t1_call_spirit_pack",
    name: "Call Spirit Pack",
    icon: "ability_hunter_pet_attack",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Call Spirit Pack",
      description: "Summon 2 feral swamp spirits to attack a target within 45 feet for 1 minute. Spirits deal 2d6 necrotic/slashing damage each round and flank the target, granting allies advantage.",
      flavorText: "Hungry spirits of the Bryngloom mire answer the shaman's call.",
      source: "talent", class: "Animist", treeId: "spirit_binder",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "ranged", range: 45,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 8, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 4 } },
      damageTypes: ["blight", "smashing"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["summon", "pet", "flank", "animist"]
    },
    rankUpgrades: [
      { description: "Summons 3 spirits dealing 3d6 damage each and causing bleed for 1d6 per round.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } },
      { description: "Summons 4 spirits dealing 4d6 damage each, bleed for 2d6, and spirits intercept attacks meant for you.", primaryDamage: { dice: "4d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "sb_t1_curse_mastery",
    name: "Bryngloom Hex",
    icon: "spell_shadow_curseofsargeras",
    maxRanks: 3,
    position: { x: 2.5, y: 0 },
    requires: null,
    spell: {
      name: "Bryngloom Hex",
      description: "Whenever an enemy takes damage from your summons, they suffer +1d6 bonus damage from all sources and you gain 1 Resonance.",
      flavorText: "Swamp spirits amplify the sting of every hex.",
      source: "talent", class: "Animist", treeId: "spirit_binder",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", damageTypes: ["blight"],
      visualTheme: "shadow", tags: ["passive", "curse", "vulnerability", "animist"]
    },
    rankUpgrades: [
      { description: "Enemies suffer +1d6 bonus damage from all sources and hex grants 2 Resonance." },
      { description: "Enemies suffer +2d6 bonus damage, hex grants 2 Resonance, and reduces target saving throws by -3." }
    ]
  },
  {
    id: "sb_t1_soul_siphon",
    name: "Soul Siphon",
    icon: "spell_shadow_lifedrain01",
    maxRanks: 2,
    position: { x: 4, y: 0 },
    requires: null,
    spell: {
      name: "Soul Siphon",
      description: "Whenever an enemy dies while cursed or attacked by your summons, heal for 2d6 health and gain 2 Resonance.",
      flavorText: "Fungal roots drink deep from the life force of the fallen.",
      source: "talent", class: "Animist", treeId: "spirit_binder",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "self",
      healing: { dice: "2d6", flat: 0 },
      visualTheme: "shadow", tags: ["passive", "sustain", "resonance", "animist"]
    },
    rankUpgrades: [
      { description: "Heal for 4d6 health, gain 4 Resonance, and restore 5 mana on death." }
    ]
  },

  // ──────────────── TIER 2 (6 pts) ────────────────
  {
    id: "sb_t2_specter_frenzy",
    name: "Specter Frenzy",
    icon: "spell_shadow_summonvoidwalker",
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: "sb_t1_call_spirit_pack",
    spell: {
      name: "Specter Frenzy",
      description: "Spend 2 Resonance: command your summoned spirits to unleash an immediate frenzy attack. Deals 4d8 necrotic damage to their target, roots the target for 1 round, and heals you for 100 points of the damage.",
      flavorText: "The pack tears into the marrow.",
      source: "talent", class: "Animist", treeId: "spirit_binder",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "ranged", range: 45,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 8, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { resonance: { baseAmount: 2 } },
      damageTypes: ["blight"],
      primaryDamage: { dice: "4d8", flat: 0, procChance: 100 },
      debuffs: ["root"], visualTheme: "shadow", tags: ["pet-command", "burst", "lifesteal", "animist"]
    },
    rankUpgrades: [
      { description: "Deals 6d8 necrotic damage, roots for 2 rounds, and stuns target for 1 round.", primaryDamage: { dice: "6d8", flat: 0, procChance: 100 } },
      { description: "Deals 8d8 necrotic damage, stuns for 2 rounds, and resets Call Spirit Pack cooldown.", primaryDamage: { dice: "8d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "sb_t2_ancestral_shroud",
    name: "Ancestral Shroud",
    icon: "spell_holy_borrowedtime",
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: "sb_t1_curse_mastery",
    spell: {
      name: "Ancestral Shroud",
      description: "You share a mystical bond with your spirits: you gain 6 Damage Reduction while a spirit is alive, transferring the absorbed damage into your summons.",
      flavorText: "The pack shields its master with spectral flesh.",
      source: "talent", class: "Animist", treeId: "spirit_binder",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "damage-transfer", "defense", "animist"]
    },
    rankUpgrades: [
      { description: "gain 8 Damage Reduction; when a summon dies from absorbed damage, it explodes for 3d8 necrotic to all adjacent enemies." },
      { description: "gain 10 Damage Reduction; death explosions deal 5d8 necrotic and stun nearby enemies for 1 round." }
    ]
  },

  // ──────────────── TIER 3 (6 pts) ────────────────
  {
    id: "sb_t3_bone_choir_invocation",
    name: "Bone-Choir Invocation",
    icon: "ability_rogue_deadliness",
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: "sb_t2_specter_frenzy",
    spell: {
      name: "Bone-Choir Invocation",
      description: "Spend 3 Resonance: invoke the ancient Bone-Choir of the ancestors in a 30-foot cone. Deals 5d10 necrotic damage, silences all enemies for 1 round, and restores 3d8 health to all allies in range.",
      flavorText: "Ancient ancestors stir in the depths, offering terrifying harmonies.",
      source: "talent", class: "Animist", treeId: "spirit_binder",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 30, aoeShape: "cone", aoeSize: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 14, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { resonance: { baseAmount: 3 } },
      damageTypes: ["blight"],
      primaryDamage: { dice: "5d10", flat: 0, procChance: 100 },
      debuffs: ["silence"], visualTheme: "shadow", tags: ["cone", "heal-damage", "silence", "animist"]
    },
    rankUpgrades: [
      { description: "35-foot cone deals 7d10 necrotic damage, silences for 2 rounds, and heals allies for 5d8.", primaryDamage: { dice: "7d10", flat: 0, procChance: 100 }, range: 35, aoeSize: 35 },
      { description: "40-foot cone deals 9d10 necrotic, silences for 2 rounds, heals allies for 7d8, and summons 2 additional spirits.", primaryDamage: { dice: "9d10", flat: 0, procChance: 100 }, range: 40, aoeSize: 40 }
    ]
  },
  {
    id: "sb_t3_pack_ferocity",
    name: "Pack Ferocity",
    icon: "ability_hunter_pet_aggressive",
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: "sb_t2_ancestral_shroud",
    spell: {
      name: "Pack Ferocity",
      description: "All your summons deal +1d8 bonus damage and have their movement speed increased by 20 feet.",
      flavorText: "Feral hunger sharpened by ancient spite.",
      source: "talent", class: "Animist", treeId: "spirit_binder",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "pet-buff", "animist"]
    },
    rankUpgrades: [
      { description: "Summons deal +2d8 bonus damage and their attacks have critical hits on a d20 roll of 18-20." },
      { description: "Summons deal +2d8 bonus damage, +30 points crit chance, and their critical strikes refund 1 Resonance to you." }
    ]
  },

  // ──────────────── TIER 4 (5 pts) ────────────────
  {
    id: "sb_t4_spirit_link_totem",
    name: "Spirit Link Totem",
    icon: "spell_nature_spiritlinktotem",
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: "sb_t3_bone_choir_invocation",
    spell: {
      name: "Spirit Link Totem",
      description: "Spend 4 Resonance: plant a spectral totem within 40 feet for 1 minute: redistributes health across all allies within 30 feet every round (equalizing HP percentages) and reduces all damage taken by 25 points.",
      flavorText: "Shared blood cannot easily be spilled.",
      source: "talent", class: "Animist", treeId: "spirit_binder",
      spellType: "ACTIVE", category: "healing",
      targetingMode: "aoe", rangeType: "ranged", range: 40, aoeShape: "circle", aoeSize: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 24, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { resonance: { baseAmount: 4 } },
      buffs: ["spirit-link"], visualTheme: "shadow", tags: ["totem", "party-defense", "equalize", "animist"]
    },
    rankUpgrades: [
      { description: "Reduces party damage taken by 35 points and heals all linked allies for 2d8 per round.", cooldownValue: 20 },
      { description: "Reduces party damage taken by 50 points, heals for 4d8 per round, and prevents allies from dropping below 1 HP while inside.", cooldownValue: 16 }
    ]
  },
  {
    id: "sb_t4_necrotic_overflow",
    name: "Necrotic Overflow",
    icon: "spell_shadow_deathanddecay",
    maxRanks: 2,
    position: { x: 3.5, y: 3 },
    requires: "sb_t3_pack_ferocity",
    spell: {
      name: "Necrotic Overflow",
      description: "Whenever a spirit attacks, they emit a 10-foot pulse of necrotic mist dealing 1d8 damage to all adjacent enemies.",
      flavorText: "Miasma pours from the spectral wounds.",
      source: "talent", class: "Animist", treeId: "spirit_binder",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["blight"],
      primaryDamage: { dice: "1d8", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["passive", "aoe-pulse", "pet", "animist"]
    },
    rankUpgrades: [
      { description: "Necrotic mist deals 2d8 damage within 15 feet and heals the spirit for the full amount." }
    ]
  },

  // ──────────────── TIER 5 (5 pts) ────────────────
  {
    id: "sb_t5_grand_specter",
    name: "Summon Ancestral Giant",
    icon: "spell_shadow_summonvoidwalker",
    maxRanks: 2,
    position: { x: 1, y: 4 },
    requires: "sb_t4_spirit_link_totem",
    spell: {
      name: "Summon Ancestral Giant",
      description: "Spend 4 Resonance: summon a towering Ancestral Swamp Behemoth for 1 minute: taunts all enemies in a 30-foot area, deals 4d10 necrotic damage with its cleaving strikes, and absorbs up to 100 damage meant for you.",
      flavorText: "The eldest dead walk again.",
      source: "talent", class: "Animist", treeId: "spirit_binder",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "ranged", range: 45,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 30, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { resonance: { baseAmount: 4 } },
      damageTypes: ["blight"],
      primaryDamage: { dice: "4d10", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["giant-summon", "tank", "cleave", "animist"]
    },
    rankUpgrades: [
      { description: "Ancestral Giant deals 6d10 damage, absorbs 200 damage, and ground slams stun all enemies in 20ft for 1 round.", cooldownValue: 24 }
    ]
  },
  {
    id: "sb_t5_spirit_harvest",
    name: "Spirit Harvest",
    icon: "spell_shadow_manafeed",
    maxRanks: 3,
    position: { x: 3, y: 4 },
    requires: "sb_t4_necrotic_overflow",
    spell: {
      name: "Spirit Harvest",
      description: "Whenever an enemy dies, summon a temporary spirit wolf for 2 rounds for free (up to 5 wolves max).",
      flavorText: "Death only adds more teeth to the chorus.",
      source: "talent", class: "Animist", treeId: "spirit_binder",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "free-summons", "snowball", "animist"]
    },
    rankUpgrades: [
      { description: "Kills summon wolves for 3 rounds (up to 8 wolves max) and restore 1 Resonance." },
      { description: "Kills summon wolves for 4 rounds (up to 12 wolves max), restore 2 Resonance, and wolves explode for 3d8 on death." }
    ]
  },

  // ──────────────── TIER 6 (5 pts) ────────────────
  {
    id: "sb_t6_the_triune_ancestors",
    name: "The Triune Ancestors",
    icon: "inv_misc_platnumdisks",
    maxRanks: 1,
    position: { x: 1, y: 5 },
    requires: "sb_t5_grand_specter",
    spell: {
      name: "The Triune Ancestors",
      description: "Spend 5 Resonance: invoke the 3 Triune Ancestral Lords: instantly resurrect up to 2 fallen allies within 40 feet at 50 points health, and unleash a 360-degree shockwave dealing 6d10 necrotic damage to all enemies.",
      flavorText: "The Bryngloom's eldest spirits return what death took.",
      source: "talent", class: "Animist", treeId: "spirit_binder",
      spellType: "ACTIVE", category: "healing",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 40,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 120, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { resonance: { baseAmount: 5 } },
      damageTypes: ["blight"],
      primaryDamage: { dice: "6d10", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["mass-resurrect", "nuke", "climax", "animist"]
    },
    rankUpgrades: []
  },
  {
    id: "sb_t6_spectral_invulnerability",
    name: "Spectral Phasing",
    icon: "spell_shadow_nethercloak",
    maxRanks: 2,
    position: { x: 2.5, y: 5 },
    requires: "sb_t5_spirit_harvest",
    spell: {
      name: "Spectral Phasing",
      description: "While you maintain at least 3 active summons, all physical attacks against you have disadvantage and you take 25 points less magical damage.",
      flavorText: "The pack moves between realms.",
      source: "talent", class: "Animist", treeId: "spirit_binder",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "evasion", "defense", "animist"]
    },
    rankUpgrades: [
      { description: "Physical attacks against you miss on 1-3 on a d6; take 40 points less magical damage and you can walk through walls." }
    ]
  },
  {
    id: "sb_t6_death_pact",
    name: "Soul Feast",
    icon: "spell_shadow_lifedrain02",
    maxRanks: 2,
    position: { x: 4, y: 5 },
    requires: "sb_t5_spirit_harvest",
    spell: {
      name: "Soul Feast",
      description: "Whenever a spirit deals damage, you heals for for 2d6 Hit Pointsand your spells deal +10 points bonus damage for 2 rounds.",
      flavorText: "The meal is shared instantly.",
      source: "talent", class: "Animist", treeId: "spirit_binder",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "lifesteal", "pet", "animist"]
    },
    rankUpgrades: [
      { description: "Heal for 50 points of spirit damage; bonus damage increases to +25 points." }
    ]
  },

  // ──────────────── TIER 7 / CAPSTONE (15 pts) ────────────────
  {
    id: "sb_t7_horde_of_the_mire",
    name: "Horde of the Mire",
    icon: "ability_hunter_pet_attack",
    maxRanks: 1,
    position: { x: 0.5, y: 6 },
    requires: "sb_t6_the_triune_ancestors",
    spell: {
      name: "Horde of the Mire",
      description: "ULTIMATE: Spend 8 Resonance: summon the entire Spectral Horde for 1 minute: 8 spectral beasts and 2 ancestral giants swarm the battlefield, dealing 10d10 necrotic damage per round divided among all enemies, granting all allies full immunity to crowd control.",
      flavorText: "The swamp empties its graves all at once.",
      source: "talent", class: "Animist", treeId: "spirit_binder",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 50,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 180, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { resonance: { baseAmount: 8 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      damageTypes: ["blight"],
      primaryDamage: { dice: "10d10", flat: 0, procChance: 100 },
      buffs: ["horde-mire"], visualTheme: "shadow", tags: ["ultimate", "capstone", "army", "animist"]
    },
    rankUpgrades: []
  },
  {
    id: "sb_t7_spirit_doctrine",
    name: "Spirit Binder Doctrine",
    icon: "spell_shadow_curseofsargeras",
    maxRanks: 5,
    position: { x: 1.5, y: 6 },
    requires: "sb_t6_the_triune_ancestors",
    spell: {
      name: "Spirit Binder Doctrine",
      description: "All necrotic, summon, and spirit damage you deal is increased by +1d6 damage.",
      flavorText: "One thousand voices, all speaking death.",
      source: "talent", class: "Animist", treeId: "spirit_binder",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["blight"],
      visualTheme: "shadow", tags: ["passive", "capstone", "damage", "animist"]
    },
    rankUpgrades: [
      { description: "All spirit and necrotic damage increased by +1d8 damage." },
      { description: "All spirit and necrotic damage increased by +1d8 damage." },
      { description: "All spirit and necrotic damage increased by +2d8 damage." },
      { description: "All spirit and necrotic damage increased by +2d8 damage, and Call Spirit Pack costs 0 mana." }
    ]
  },
  {
    id: "sb_t7_endless_horde",
    name: "Endless Pack Reservoir",
    icon: "ability_hunter_pet_aggressive",
    maxRanks: 3,
    position: { x: 2.5, y: 6 },
    requires: "sb_t6_spectral_invulnerability",
    spell: {
      name: "Endless Pack Reservoir",
      description: "Your summoned spirits never expire until killed, and their maximum active count is increased by +3.",
      flavorText: "Permanent guests in the waking world.",
      source: "talent", class: "Animist", treeId: "spirit_binder",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "capstone", "permanent-pets", "animist"]
    },
    rankUpgrades: [
      { description: "Spirit max count +5; spirits gain +50 points max health and +2 Durability Steps to equipped durability." },
      { description: "Spirit max count +8; spirits gain +100 points health, +4 Durability Steps to equipped durability, and attacks score critical hits on 18+." }
    ]
  },
  {
    id: "sb_t7_ancestral_wrath",
    name: "Wrath of the Elders",
    icon: "spell_shadow_deathanddecay",
    maxRanks: 3,
    position: { x: 3.5, y: 6 },
    requires: "sb_t6_death_pact",
    spell: {
      name: "Wrath of the Elders",
      description: "When your summons attack, they have a 25 points chance to cast a free Bone-Choir Invocation on their target.",
      flavorText: "The elders shout through every bite.",
      source: "talent", class: "Animist", treeId: "spirit_binder",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "capstone", "proc", "animist"]
    },
    rankUpgrades: [
      { description: "40 points chance for spirits to proc Bone-Choir Invocation." },
      { description: "60 points chance for spirits to proc Bone-Choir Invocation; proc damage deals double damage." }
    ]
  },
  {
    id: "sb_t7_immortal_packmaster",
    name: "Immortal Packmaster",
    icon: "spell_shadow_darkritual",
    maxRanks: 3,
    position: { x: 4.5, y: 6 },
    requires: "sb_t6_death_pact",
    spell: {
      name: "Immortal Packmaster",
      description: "While at least one spirit is alive, lethal damage sacrifices the spirit instead: prevents death, restores 30 Hit Points, and immediately summons 3 new spirit wolves (cooldown: 120s).",
      flavorText: "The pack dies so the master leads.",
      source: "talent", class: "Animist", treeId: "spirit_binder",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "capstone", "cheat-death", "animist"]
    },
    rankUpgrades: [
      { description: "Survive lethal damage, restores 45 Hit Points, summon 5 wolves, and gain full Resonance (cooldown: 90s)." },
      { description: "Survive lethal damage, restores 60 Hit Points, summon Ancestral Giant automatically, and gain 50 temporary health (cooldown: 60s)." }
    ]
  }
];

// ============================================
// 3. ANIMIST — STORMSCRIBE
// ============================================
export const ANIMIST_STORMSCRIBE = [
  // ──────────────── TIER 1 (8 pts) ────────────────
  {
    id: "ss_t1_galvanic_totem",
    name: "Galvanic Totem",
    icon: "spell_lightning_lightningbolt01",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Galvanic Totem",
      description: "Plant a Storm Totem within 40 feet for 1 minute: emits lightning bolts striking the nearest enemy for 2d8 storm damage every round and grants adjacent allies +1d6 storm damage on attacks.",
      flavorText: "Storm spirits of the Bryngloom crackle through the air around every raised totem.",
      source: "talent", class: "Animist", treeId: "stormscribe",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "ranged", range: 40, aoeShape: "circle", aoeSize: 20,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 6, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 4 } },
      damageTypes: ["storm"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      visualTheme: "primal", tags: ["totem", "storm", "turret", "animist"]
    },
    rankUpgrades: [
      { description: "Strikes 2 enemies for 3d8 storm damage per round and grants allies +2d6 storm damage.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } },
      { description: "Strikes 3 enemies for 4d8 storm damage per round, grants +3d6 storm damage, and generates 1 Resonance per round.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "ss_t1_blood_brand",
    name: "Blood Brand Inscription",
    icon: "ability_rogue_findweakness",
    maxRanks: 3,
    position: { x: 2.5, y: 0 },
    requires: null,
    spell: {
      name: "Blood Brand Inscription",
      description: "When you cast a runic spell on an ally, that ally gains +2 to hit and +1d6 lightning damage on all attacks for 3 rounds. Self-damage from carving is reduced to 0.",
      flavorText: "Fungal spirits seal the shaman's offering into flesh.",
      source: "talent", class: "Animist", treeId: "stormscribe",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "buff", "ally-empower", "animist"]
    },
    rankUpgrades: [
      { description: "Inscribed allies gain +3 to hit, +2d6 lightning damage, and +10ft movement speed." },
      { description: "Inscribed allies gain +4 to hit, +3d6 lightning damage, +15ft speed, and attack with advantage." }
    ]
  },
  {
    id: "ss_t1_healing_sap",
    name: "Healing Sap Totemist",
    icon: "spell_nature_healingway",
    maxRanks: 2,
    position: { x: 4, y: 0 },
    requires: null,
    spell: {
      name: "Healing Sap Totemist",
      description: "All your active totems heal adjacent allies for 1d6 health every round. When an inscribed ally deals damage, you gain 1 Resonance.",
      flavorText: "Mycelial networks carry restorative sap from the swamp's heart.",
      source: "talent", class: "Animist", treeId: "stormscribe",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "self",
      healing: { dice: "1d6", flat: 0 },
      visualTheme: "primal", tags: ["passive", "totem-heal", "resonance", "animist"]
    },
    rankUpgrades: [
      { description: "Totems heal for 2d6 health per round and generate 2 Resonance on inscribed ally hits.", healing: { dice: "2d6", flat: 0 } }
    ]
  },

  // ──────────────── TIER 2 (6 pts) ────────────────
  {
    id: "ss_t2_chain_lightning_strike",
    name: "Chain Lightning Inscription",
    icon: "spell_nature_chainlightning",
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: "ss_t1_galvanic_totem",
    spell: {
      name: "Chain Lightning Inscription",
      description: "Spend 2 Resonance: release a leaping arc of lightning from your totem or weapon hitting up to 4 enemies within 45 feet. Deals 4d8 storm damage and shocks all targets (disadvantage on actions for 1 round).",
      flavorText: "Lightning-infused spore patterns sear into the enemies.",
      source: "talent", class: "Animist", treeId: "stormscribe",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "multi", rangeType: "ranged", range: 45,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 8, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { resonance: { baseAmount: 2 } },
      damageTypes: ["storm"],
      primaryDamage: { dice: "4d8", flat: 0, procChance: 100 },
      debuffs: ["shocked"], visualTheme: "primal", tags: ["chain", "shock", "storm", "animist"]
    },
    rankUpgrades: [
      { description: "Hits up to 5 enemies for 6d8 storm damage and pierces 6 Damage Reduction.", primaryDamage: { dice: "6d8", flat: 0, procChance: 100 } },
      { description: "Hits up to 6 enemies for 8d8 storm damage, pierces 10 Damage Reduction, and stuns shocked targets for 1 round.", primaryDamage: { dice: "8d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "ss_t2_storm_attunement",
    name: "Galvanic Overload",
    icon: "spell_lightning_lightningbolt01",
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: "ss_t1_blood_brand",
    spell: {
      name: "Galvanic Overload",
      description: "Whenever you or an ally stand within 15 feet of your totems, storm damage dealt is increased by +1d8 damage and ignores 6 Damage Reduction.",
      flavorText: "Static charges the air around the sacred wood.",
      source: "talent", class: "Animist", treeId: "stormscribe",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["storm"],
      visualTheme: "primal", tags: ["passive", "totem-aura", "storm-amp", "animist"]
    },
    rankUpgrades: [
      { description: "Storm damage +40 points and ignores 10 Damage Reduction within 20 feet of totems." },
      { description: "Storm damage +60 points, ignores 16 Damage Reduction, and storm attacks crit on 18+ within 25 feet." }
    ]
  },

  // ──────────────── TIER 3 (6 pts) ────────────────
  {
    id: "ss_t3_tempest_totem",
    name: "Tempest Totem",
    icon: "spell_nature_cyclone",
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: "ss_t2_chain_lightning_strike",
    spell: {
      name: "Tempest Totem",
      description: "Spend 3 Resonance: place a Tempest Totem within 45 feet for 3 rounds. Creates a 30-foot vortex: pulls all enemies toward the totem, deals 4d8 storm damage per round, and prevents enemy ranged attacks.",
      flavorText: "A localized hurricane anchored in bone and wood.",
      source: "talent", class: "Animist", treeId: "stormscribe",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "aoe", rangeType: "ranged", range: 45, aoeShape: "circle", aoeSize: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 18, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { resonance: { baseAmount: 3 } },
      damageTypes: ["storm"],
      primaryDamage: { dice: "4d8", flat: 0, procChance: 100 },
      isDot: true, dotDuration: 3, dotTick: "4d8",
      visualTheme: "primal", tags: ["totem", "vortex", "windwall", "animist"]
    },
    rankUpgrades: [
      { description: "35-foot vortex deals 6d8 storm per round, silences enemies inside, and knocks flying enemies down.", primaryDamage: { dice: "6d8", flat: 0, procChance: 100 }, dotTick: "6d8" },
      { description: "40-foot vortex deals 8d8 storm per round, silences, and lightning bolts strike pulled enemies for 3d8 extra damage.", primaryDamage: { dice: "8d8", flat: 0, procChance: 100 }, dotTick: "8d8" }
    ]
  },
  {
    id: "ss_t3_runic_mend",
    name: "Runic Conduit",
    icon: "spell_holy_borrowedtime",
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: "ss_t2_storm_attunement",
    spell: {
      name: "Runic Conduit",
      description: "Whenever you cast a storm spell, all active totems copy the spell at 40 points potency, firing lightning at the closest enemies.",
      flavorText: "The runes act as repeaters across the mire.",
      source: "talent", class: "Animist", treeId: "stormscribe",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["storm"],
      visualTheme: "primal", tags: ["passive", "totem-copy", "echo", "animist"]
    },
    rankUpgrades: [
      { description: "Totems copy storm spells at 65 points potency." },
      { description: "Totems copy storm spells at 90 points potency and copied spells refund 1 Resonance." }
    ]
  },

  // ──────────────── TIER 4 (5 pts) ────────────────
  {
    id: "ss_t4_thunder_brand",
    name: "Thunder Brand Overload",
    icon: "spell_nature_thunderclap",
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: "ss_t3_tempest_totem",
    spell: {
      name: "Thunder Brand Overload",
      description: "Spend 4 Resonance: overload all inscribed allies within 40 feet. Each inscribed ally immediately releases a 20-foot thunder shockwave dealing 5d8 storm damage and stunning adjacent enemies for 1 round.",
      flavorText: "Every ally becomes a lightning rod for the storm.",
      source: "talent", class: "Animist", treeId: "stormscribe",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 40,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 24, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { resonance: { baseAmount: 4 } },
      damageTypes: ["storm"],
      primaryDamage: { dice: "5d8", flat: 0, procChance: 100 },
      debuffs: ["stun"], visualTheme: "primal", tags: ["ally-detonation", "mass-stun", "animist"]
    },
    rankUpgrades: [
      { description: "Shockwaves deal 7d8 storm damage, stun for 1 round, and grant each ally 30 temporary health.", primaryDamage: { dice: "7d8", flat: 0, procChance: 100 }, cooldownValue: 20 },
      { description: "Shockwaves deal 9d8 storm damage, stun for 2 rounds, grant 50 temp HP, and refund 2 Resonance.", primaryDamage: { dice: "9d8", flat: 0, procChance: 100 }, cooldownValue: 16 }
    ]
  },
  {
    id: "ss_t4_totem_multiplication",
    name: "Totemic Trinity",
    icon: "spell_nature_totemdecay",
    maxRanks: 2,
    position: { x: 3.5, y: 3 },
    requires: "ss_t3_runic_mend",
    spell: {
      name: "Totemic Trinity",
      description: "Whenever you summon a totem, you may summon an additional complementary totem for free. You may maintain up to 4 totems simultaneously.",
      flavorText: "A triangle of power anchored in the moss.",
      source: "talent", class: "Animist", treeId: "stormscribe",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "multi-totem", "animist"]
    },
    rankUpgrades: [
      { description: "Summon 2 additional totems for free; maintain up to 6 totems simultaneously and totem ranges increase by +15ft." }
    ]
  },

  // ──────────────── TIER 5 (5 pts) ────────────────
  {
    id: "ss_t5_galvanic_cataclysm",
    name: "Galvanic Cataclysm",
    icon: "spell_nature_unrelentingstorm",
    maxRanks: 2,
    position: { x: 1, y: 4 },
    requires: "ss_t4_thunder_brand",
    spell: {
      name: "Galvanic Cataclysm",
      description: "Spend 4 Resonance: connect all active totems with massive electrical arcs. Deals 8d10 storm damage to all enemies caught between totems and permanently destroys their magical wards.",
      flavorText: "The sky touches the earth at every point of the circle.",
      source: "talent", class: "Animist", treeId: "stormscribe",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 30, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { resonance: { baseAmount: 4 } },
      damageTypes: ["storm"],
      primaryDamage: { dice: "8d10", flat: 0, procChance: 100 },
      debuffs: ["ward-shatter"], visualTheme: "primal", tags: ["mesh", "nuke", "dispel", "animist"]
    },
    rankUpgrades: [
      { description: "Deals 11d10 storm damage, silences all enemies for 2 rounds, and cooldown drops to 24s.", primaryDamage: { dice: "11d10", flat: 0, procChance: 100 }, cooldownValue: 24 }
    ]
  },
  {
    id: "ss_t5_conduction_matrix",
    name: "Conduction Matrix",
    icon: "spell_nature_chainlightning",
    maxRanks: 3,
    position: { x: 3, y: 4 },
    requires: "ss_t4_totem_multiplication",
    spell: {
      name: "Conduction Matrix",
      description: "All lightning and storm damage dealt by your spells and totems chains to 2 additional targets for 50 points damage.",
      flavorText: "Electricity follows the path of maximum devastation.",
      source: "talent", class: "Animist", treeId: "stormscribe",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["storm"],
      visualTheme: "primal", tags: ["passive", "chain-amp", "animist"]
    },
    rankUpgrades: [
      { description: "Chains to 3 additional targets at 75 points damage." },
      { description: "Chains to 4 additional targets at 100 points full damage, and each chain proc restores 1 Resonance (up to 3 per cast)." }
    ]
  },

  // ──────────────── TIER 6 (5 pts) ────────────────
  {
    id: "ss_t6_the_ancestral_convergence",
    name: "The Ancestral Convergence",
    icon: "inv_misc_platnumdisks",
    maxRanks: 1,
    position: { x: 1, y: 5 },
    requires: "ss_t5_galvanic_cataclysm",
    spell: {
      name: "The Ancestral Convergence",
      description: "Spend 5 Resonance: channel all three traditions simultaneously: instantly summon 3 Galvanic Totems, inscribe all allies within 40 feet with Blood Brand, heal all allies for 6d8 health, and strike all enemies for 6d8 storm damage in a single action.",
      flavorText: "Every Bryngloom ancestor rises as one to weave storm, bone, and spirit into a single cataclysmic harmony.",
      source: "talent", class: "Animist", treeId: "stormscribe",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 40,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 90, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { resonance: { baseAmount: 5 } },
      damageTypes: ["storm"],
      primaryDamage: { dice: "6d8", flat: 0, procChance: 100 },
      healing: { dice: "6d8", flat: 0 },
      visualTheme: "primal", tags: ["triple-tradition", "all-in-one", "climax", "animist"]
    },
    rankUpgrades: []
  },
  {
    id: "ss_t6_storm_sovereignty",
    name: "Storm Sovereignty",
    icon: "spell_lightning_lightningbolt01",
    maxRanks: 2,
    position: { x: 2.5, y: 5 },
    requires: "ss_t5_conduction_matrix",
    spell: {
      name: "Storm Sovereignty",
      description: "All storm damage dealt by you and your allies completely ignores enemy magical resistance and shields.",
      flavorText: "Lightning cannot be contained by mortal wards.",
      source: "talent", class: "Animist", treeId: "stormscribe",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["storm"],
      visualTheme: "primal", tags: ["passive", "true-damage", "penetration", "animist"]
    },
    rankUpgrades: [
      { description: "Storm damage ignores resistance/shields and all storm spells score critical hits on 17+." }
    ]
  },
  {
    id: "ss_t6_totemic_resilience",
    name: "Totemic Sanctuary",
    icon: "spell_nature_healingway",
    maxRanks: 2,
    position: { x: 4, y: 5 },
    requires: "ss_t5_conduction_matrix",
    spell: {
      name: "Totemic Sanctuary",
      description: "While standing within 20 feet of any totem, you and all allies gain +4 Durability Steps to equipped durability, 6 Damage Reduction against all-damage, and cannot be interrupted.",
      flavorText: "The totems protect the tribe as living sentinels.",
      source: "talent", class: "Animist", treeId: "stormscribe",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "totem-sanctuary", "defense", "animist"]
    },
    rankUpgrades: [
      { description: "Gain +6 Durability Steps to equipped durability, 8 Damage Reduction, un-interruptible casting, and heal 3d8 at the start of every turn near totems." }
    ]
  },

  // ──────────────── TIER 7 / CAPSTONE (15 pts) ────────────────
  {
    id: "ss_t7_avatar_of_the_storm",
    name: "Avatar of the Tempest",
    icon: "spell_nature_unrelentingstorm",
    maxRanks: 1,
    position: { x: 0.5, y: 6 },
    requires: "ss_t6_the_ancestral_convergence",
    spell: {
      name: "Avatar of the Tempest",
      description: "ULTIMATE: Spend 8 Resonance: transform into the Storm Sovereign for 1 minute: continuous lightning arcs strike all enemies within 50 feet for 5d10 storm damage every round, all totem cooldowns are removed, and all inscribed allies deal double damage.",
      flavorText: "You are the lightning that cleaves the swamp in two.",
      source: "talent", class: "Animist", treeId: "stormscribe",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 180, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { resonance: { baseAmount: 8 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      damageTypes: ["storm"],
      primaryDamage: { dice: "5d10", flat: 0, procChance: 100 },
      buffs: ["avatar-tempest"], visualTheme: "primal", tags: ["ultimate", "capstone", "storm-avatar", "animist"]
    },
    rankUpgrades: []
  },
  {
    id: "ss_t7_stormscribe_doctrine",
    name: "Stormscribe Doctrine",
    icon: "spell_lightning_lightningbolt01",
    maxRanks: 5,
    position: { x: 1.5, y: 6 },
    requires: "ss_t6_the_ancestral_convergence",
    spell: {
      name: "Stormscribe Doctrine",
      description: "All storm and lightning damage dealt by your spells, totems, and inscriptions is increased by +1d6 damage.",
      flavorText: "The sky is written in lines of blue fire.",
      source: "talent", class: "Animist", treeId: "stormscribe",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["storm"],
      visualTheme: "primal", tags: ["passive", "capstone", "damage", "animist"]
    },
    rankUpgrades: [
      { description: "All storm and inscription damage increased by +1d8 damage." },
      { description: "All storm and inscription damage increased by +1d8 damage." },
      { description: "All storm and inscription damage increased by +2d8 damage." },
      { description: "All storm and inscription damage increased by +2d8 damage, and Galvanic Totem costs 0 mana." }
    ]
  },
  {
    id: "ss_t7_infinite_storm_resonance",
    name: "Storm Battery Reservoir",
    icon: "spell_arcane_arcane04",
    maxRanks: 3,
    position: { x: 2.5, y: 6 },
    requires: "ss_t6_storm_sovereignty",
    spell: {
      name: "Storm Battery Reservoir",
      description: "Your maximum Resonance increases by 6. Whenever a totem strikes an enemy, you generate 1 Resonance.",
      flavorText: "Lightning stored in runic bone.",
      source: "talent", class: "Animist", treeId: "stormscribe",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "capstone", "resonance-engine", "animist"]
    },
    rankUpgrades: [
      { description: "Maximum Resonance +10; totem strikes generate 2 Resonance and movement speed +15ft." },
      { description: "Maximum Resonance +15; totem strikes generate 3 Resonance and all runic spells cast instantly." }
    ]
  },
  {
    id: "ss_t7_supercharged_crit",
    name: "Supercharged Discharge",
    icon: "spell_nature_chainlightning",
    maxRanks: 3,
    position: { x: 3.5, y: 6 },
    requires: "ss_t6_totemic_resilience",
    spell: {
      name: "Supercharged Discharge",
      description: "All lightning and storm spells score critical hits on 18+ and critical hits release a 4d8 thunder burst.",
      flavorText: "Thunder follows immediately on the strike.",
      source: "talent", class: "Animist", treeId: "stormscribe",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["storm"],
      primaryDamage: { dice: "4d8", flat: 0, procChance: 100 },
      visualTheme: "primal", tags: ["passive", "capstone", "crit-burst", "animist"]
    },
    rankUpgrades: [
      { description: "Crits on 17+ and thunder burst deals 6d8 storm damage." },
      { description: "Crits on 16+, thunder burst deals 8d8 storm damage, and resets Chain Lightning Inscription cooldown." }
    ]
  },
  {
    id: "ss_t7_galvanic_reincarnation",
    name: "Galvanic Reincarnation",
    icon: "spell_nature_healingway",
    maxRanks: 3,
    position: { x: 4.5, y: 6 },
    requires: "ss_t6_totemic_resilience",
    spell: {
      name: "Galvanic Reincarnation",
      description: "While you maintain at least 1 active totem, lethal damage strikes your totem instead: restores 30 Hit Points, grants 40 temporary health, and calls down lightning for 6d10 damage to all nearby foes (cooldown: 120s).",
      flavorText: "The lightning reanimates the heart.",
      source: "talent", class: "Animist", treeId: "stormscribe",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["storm"],
      primaryDamage: { dice: "6d10", flat: 0, procChance: 100 },
      visualTheme: "primal", tags: ["passive", "capstone", "cheat-death", "animist"]
    },
    rankUpgrades: [
      { description: "Survive lethal damage, restores 45 Hit Points, 60 temp HP, lightning deals 8d10 damage (cooldown: 90s)." },
      { description: "Survive lethal damage, restores 60 Hit Points, lightning deals 12d10 damage, and immediately triggers The Ancestral Convergence for free (cooldown: 60s)." }
    ]
  }
];
