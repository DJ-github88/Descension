// ============================================
// BERSERKER — SAVAGE INSTINCTS (v3: spec identity redesign)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50.
//
// SPEC IDENTITY: The Pack Leader & Tactical Predator.
// You are not a solo berserker blinded by rage — you are the apex wolf at the head
// of the pack. You mark prey for focused party fire, direct ally attacks, cripple
// priority targets, and turn every engagement into an overwhelming ambush.
//
// SIGNATURE ACTIVES:
//   - Mark Prey (t1):           Designate a priority target: grants advantage & bonus damage to all allies
//   - Pack Howl (t2):           Rally allies with movement speed and immediate bonus attacks
//   - Hamstring / Pincer (t3):  Cripple enemy mobility and expose their flank
//   - Call the Pack (t4):       Summon spirit wolves to flank and pin enemies
//   - Predator's Pounce (t5):   Ambush leap dealing bonus execute damage from stealth/flank
//   - Alpha Command (t6):       Order all allies to immediately make a coordinated strike
//   - Apex Predator (t7):       ULTIMATE — Full predatory avatar that turns the whole party into an apex pack
// ============================================

export const BERSERKER_SAVAGE_INSTINCTS = [
  // ──────────────── TIER 1 (8 pts) ────────────────
  {
    id: "svi_t1_mark_prey",
    name: "Mark Prey",
    icon: "ability_hunter_snipershot",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Mark Prey",
      description: "Designate one enemy within 45 feet as your Quarry for 1 minute. You and all allies gain +1 to hit against the Quarry, and all attacks against it deal +1d6 slicing damage.",
      flavorText: "The pack has decided. The target does not get a vote.",
      source: "talent", class: "Berserker", treeId: "savage_instincts",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "single", rangeType: "ranged", range: 45,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 10, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { bloodHeat: { baseAmount: 0 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      debuffs: ["quarry"], damageTypes: ["slicing"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "primal", tags: ["mark", "debuff", "ally", "berserker"]
    },
    rankUpgrades: [
      { description: "Mark Prey: +2 to hit against Quarry and attacks deal +1d8 slicing damage. Cooldown drops to 8s.", primaryDamage: { dice: "1d8", flat: 0, procChance: 100 }, cooldownValue: 8 },
      { description: "Mark Prey: +3 to hit, attacks deal +1d10 slicing damage, and the Quarry cannot benefit from concealment or invisibility.", primaryDamage: { dice: "1d10", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "svi_t1_combat_instincts",
    name: "Combat Instincts",
    icon: "ability_warrior_weaponmastery",
    maxRanks: 3,
    position: { x: 2.5, y: 0 },
    requires: null,
    spell: {
      name: "Combat Instincts",
      description: "You have advantage on initiative rolls and cannot be surprised. You and adjacent allies gain +10ft movement speed on the first round of combat.",
      flavorText: "You have never once been surprised. Mildly inconvenienced, often.",
      source: "talent", class: "Berserker", treeId: "savage_instincts",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "initiative", "berserker"]
    },
    rankUpgrades: [
      { description: "Advantage and +3 to initiative. First-round speed bonus increases to +15ft for you and all allies within 20ft." },
      { description: "Advantage and +5 to initiative. On your first turn each combat, all your attacks deal an additional 2d8 damage." }
    ]
  },
  {
    id: "svi_t1_pack_flanking",
    name: "Pack Flanking",
    icon: "ability_hunter_catlikereflexes",
    maxRanks: 2,
    position: { x: 4, y: 0 },
    requires: null,
    spell: {
      name: "Pack Flanking",
      description: "Whenever at least one ally is within 5 feet of your target, both you and the ally count as flanking, gaining advantage on attack rolls.",
      flavorText: "There is always a flank. You just have to be the wolf about it.",
      source: "talent", class: "Berserker", treeId: "savage_instincts",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "flanking", "berserker"]
    },
    rankUpgrades: [
      { description: "Flanking attacks made by you and your allies deal an additional 1d8 slicing damage.", damageTypes: ["slicing"], primaryDamage: { dice: "1d8", flat: 0, procChance: 100 } }
    ]
  },

  // ──────────────── TIER 2 (6 pts) ────────────────
  {
    id: "svi_t2_pack_howl",
    name: "Pack Howl",
    icon: "ability_hunter_pet_wolf",
    maxRanks: 3,
    position: { x: 1, y: 1.5 },
    requires: "svi_t1_mark_prey",
    spell: {
      name: "Pack Howl",
      description: "Emit a rallying war-howl: all allies within 30 feet gain +15ft movement speed and their next attack deals +1d8 primal damage.",
      flavorText: "Louder. The chorus has a battlefield to conduct.",
      source: "talent", class: "Berserker", treeId: "savage_instincts",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 14, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { bloodHeat: { baseAmount: 15 } },
      buffs: ["pack-howl"], damageTypes: ["primal"],
      primaryDamage: { dice: "1d8", flat: 0, procChance: 100 },
      visualTheme: "primal", tags: ["howl", "ally", "buff", "berserker"]
    },
    rankUpgrades: [
      { description: "Allies within 30 feet gain +20ft speed, +1d10 primal damage, and advantage on their next saving throw.", primaryDamage: { dice: "1d10", flat: 0, procChance: 100 } },
      { description: "Allies within 40 feet gain +25ft speed, +2d8 primal damage, and one free reaction to reposition 10 feet.", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 }, aoeSize: 40 }
    ]
  },
  {
    id: "svi_t2_tactical_awareness",
    name: "Predator Senses",
    icon: "ability_druid_primalprecision",
    maxRanks: 3,
    position: { x: 3, y: 1.5 },
    requires: "svi_t1_combat_instincts",
    spell: {
      name: "Predator Senses",
      description: "You sense the weak points of bleeding or wounded targets. When attacking enemies below 50% health, you crit on 18+ and ignore half cover.",
      flavorText: "Snow hides many things. It has never once hidden blood.",
      source: "talent", class: "Berserker", treeId: "savage_instincts",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "crit", "execute", "berserker"]
    },
    rankUpgrades: [
      { description: "Against enemies below 50% health: crit on 17+, ignore all cover, and gain +2 to hit." },
      { description: "Against enemies below 50% health: crit on 16+, and whenever you land a critical strike, your Quarry takes an extra 2d8 primal damage." }
    ]
  },

  // ──────────────── TIER 3 (6 pts) ────────────────
  {
    id: "svi_t3_crippling_strike",
    name: "Crippling Hamstring",
    icon: "ability_rogue_trip",
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: "svi_t2_pack_howl",
    spell: {
      name: "Crippling Hamstring",
      description: "Spend 20 Blood-Heat: strike the legs of an enemy in melee. Deals 2d8 slicing damage, reduces target movement speed to 0 for 1 round, and prevents them from taking Disengage or Dash actions.",
      flavorText: "Run if you like. The snow will only make your tracks cleaner.",
      source: "talent", class: "Berserker", treeId: "savage_instincts",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "single", rangeType: "melee", range: 5,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 10, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { bloodHeat: { baseAmount: 20 } },
      damageTypes: ["slicing"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      debuffs: ["crippled", "root"], visualTheme: "primal", tags: ["melee", "control", "root", "berserker"]
    },
    rankUpgrades: [
      { description: "Deals 3d8 slicing damage, roots target for 1 round, and reduces their durability by -3 for 2 rounds.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } },
      { description: "Deals 4d8 slicing damage, roots target for 2 rounds, reduces durability by -4, and resets Mark Prey's cooldown.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "svi_t3_survival_instincts",
    name: "Survival Coordination",
    icon: "spell_nature_spiritwolf",
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: "svi_t2_tactical_awareness",
    spell: {
      name: "Survival Coordination",
      description: "When an ally within 30 feet takes damage, you may use a reaction to grant them +3 Durability Steps to equipped durability against that attack and immediately advance 10ft toward the attacker.",
      flavorText: "No wolf falls alone while the pack breathes.",
      source: "talent", class: "Berserker", treeId: "savage_instincts",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "reaction", "ally", "protection", "berserker"]
    },
    rankUpgrades: [
      { description: "Reaction grants ally +3 Durability Steps to equipped durability and lets you move up to 15ft and make a free melee counterstrike if you reach the attacker." },
      { description: "Reaction grants ally +3 Durability Steps to equipped durability, lets you move up to 20ft, and your counterstrike deals +2d6 damage and interrupts the attacker." }
    ]
  },

  // ──────────────── TIER 4 (5 pts) ────────────────
  {
    id: "svi_t4_call_the_pack",
    name: "Call the Pack",
    icon: "spell_nature_spiritwolf",
    maxRanks: 3,
    position: { x: 1, y: 4.5 },
    requires: "svi_t3_crippling_strike",
    spell: {
      name: "Call the Pack",
      description: "Spend 35 Blood-Heat: summon 2 spirit frost-wolves for 30 seconds. The wolves flank your Quarry, each dealing 1d8+3 slicing damage on their turn and granting flanking bonuses to all nearby allies.",
      flavorText: "Ancestral spirits, running on four legs again.",
      source: "talent", class: "Berserker", treeId: "savage_instincts",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "single", rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 30, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { bloodHeat: { baseAmount: 35 } },
      durationRounds: 3, durationRealTime: 30, durationUnit: "seconds",
      visualTheme: "primal", tags: ["summon", "wolves", "flanking", "berserker"]
    },
    rankUpgrades: [
      { description: "Summon 3 frost-wolves. Wolves deal 2d6+4 damage each and have a 30% chance on hit to knock the target prone." },
      { description: "Summon 3 dire frost-wolves (3d6+5 damage). Whenever a wolf hits your Quarry, all allies heal for 1d6 health." }
    ]
  },
  {
    id: "svi_t4_terrain_ambush",
    name: "Terrain Ambush",
    icon: "spell_nature_earthquake",
    maxRanks: 2,
    position: { x: 3.5, y: 4.5 },
    requires: "svi_t3_survival_instincts",
    spell: {
      name: "Terrain Ambush",
      description: "You and all allies within 30 feet ignore difficult terrain. When attacking from high ground or concealment, attacks deal +2d8 bonus damage.",
      flavorText: "The land was on your side the whole time.",
      source: "talent", class: "Berserker", treeId: "savage_instincts",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["primal"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      visualTheme: "primal", tags: ["passive", "terrain", "ambush", "berserker"]
    },
    rankUpgrades: [
      { description: "You and allies ignore difficult terrain, gain +2 to hit from any terrain advantage, and ambush attacks deal +3d8 bonus damage.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } }
    ]
  },

  // ──────────────── TIER 5 (5 pts) ────────────────
  {
    id: "svi_t5_predators_pounce",
    name: "Predator's Pounce",
    icon: "ability_druid_pounce",
    maxRanks: 3,
    position: { x: 1, y: 6 },
    requires: "svi_t4_call_the_pack",
    spell: {
      name: "Predator's Pounce",
      description: "Spend 30 Blood-Heat: leap up to 25 feet onto your Quarry. Deals 4d8 slicing damage, knocks the Quarry prone, and pins it (cannot stand or move for 1 round).",
      flavorText: "The pounce is not a strike. It is an arrest.",
      source: "talent", class: "Berserker", treeId: "savage_instincts",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "ranged", range: 25,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 18, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { bloodHeat: { baseAmount: 30 } },
      damageTypes: ["slicing"],
      primaryDamage: { dice: "4d8", flat: 0, procChance: 100 },
      debuffs: ["prone", "pinned"], visualTheme: "primal", tags: ["leap", "execute", "pin", "berserker"]
    },
    rankUpgrades: [
      { description: "Deals 5d8 slicing damage. If target is below 50% health, deals 7d8 slicing damage instead.", primaryDamage: { dice: "5d8", flat: 0, procChance: 100 } },
      { description: "Deals 6d8 slicing damage (9d8 below 50% HP). On kill, immediately refunds all Blood-Heat and resets Pounce cooldown.", primaryDamage: { dice: "6d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "svi_t5_coordinated_focus",
    name: "Coordinated Focus",
    icon: "ability_hunter_snipershot",
    maxRanks: 2,
    position: { x: 3, y: 6 },
    requires: "svi_t4_terrain_ambush",
    spell: {
      name: "Coordinated Focus",
      description: "Whenever an ally damages your Quarry, you gain 5 Blood-Heat. Whenever you damage your Quarry, all allies gain +1d6 to their next damage roll.",
      flavorText: "Every strike instructs the next.",
      source: "talent", class: "Berserker", treeId: "savage_instincts",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "synergy", "ally", "berserker"]
    },
    rankUpgrades: [
      { description: "Ally attacks on Quarry grant 10 Blood-Heat. Your attacks grant allies +1d10 to their next damage roll and +1 to hit." }
    ]
  },

  // ──────────────── TIER 6 (5 pts) ────────────────
  {
    id: "svi_t6_alpha_command",
    name: "Alpha Command",
    icon: "ability_warrior_rallyingshout",
    maxRanks: 1,
    position: { x: 1, y: 7.5 },
    requires: "svi_t5_predators_pounce",
    spell: {
      name: "Alpha Command",
      description: "Spend 50 Blood-Heat: command up to 3 allies within 40 feet. Each targeted ally immediately uses a reaction to make a free basic weapon attack against your Quarry with advantage.",
      flavorText: "Kill together. Feed together.",
      source: "talent", class: "Berserker", treeId: "savage_instincts",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 40,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 60, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { bloodHeat: { baseAmount: 50 } },
      buffs: ["alpha-command"], visualTheme: "primal", tags: ["command", "ally-strike", "burst", "berserker"]
    },
    rankUpgrades: []
  },
  {
    id: "svi_t6_battle_hardened",
    name: "Pack Resilience",
    icon: "ability_warrior_defensivestance",
    maxRanks: 2,
    position: { x: 2.5, y: 7.5 },
    requires: "svi_t5_coordinated_focus",
    spell: {
      name: "Pack Resilience",
      description: "You and all allies within 30 feet cannot be frightened or charmed, and gain advantage on saves against all crowd control effects.",
      flavorText: "Panic is contagious. So is standing.",
      source: "talent", class: "Berserker", treeId: "savage_instincts",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "defense", "ally", "berserker"]
    },
    rankUpgrades: [
      { description: "Immunity to fear and charm for party. When an ally within 30ft is hit by a critical strike, you absorb half the damage and gain 25 Blood-Heat." }
    ]
  },
  {
    id: "svi_t6_flank_mastery",
    name: "Pack Ambush Pincer",
    icon: "ability_warrior_bloodfrenzy",
    maxRanks: 2,
    position: { x: 4, y: 7.5 },
    requires: "svi_t5_coordinated_focus",
    spell: {
      name: "Pack Ambush Pincer",
      description: "Whenever an ally flanks an enemy with you, both of your attacks ignore 20% of the target's damage resistances and deal +1d8 slicing damage.",
      flavorText: "The pincer closes. Neither jaw slips.",
      source: "talent", class: "Berserker", treeId: "savage_instincts",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["slicing"],
      primaryDamage: { dice: "1d8", flat: 0, procChance: 100 },
      visualTheme: "primal", tags: ["passive", "flanking", "penetration", "berserker"]
    },
    rankUpgrades: [
      { description: "Flanking ignores 30% resistance, deals +2d8 slicing damage, and flanking hits reduce the target's damage dealt by 15% for 1 round.", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 } }
    ]
  },

  // ──────────────── TIER 7 / CAPSTONE (15 pts) ────────────────
  {
    id: "svi_t7_apex_predator",
    name: "Avatar of the Apex",
    icon: "ability_hunter_beastwithin",
    maxRanks: 1,
    position: { x: 0.5, y: 8 },
    requires: "svi_t6_alpha_command",
    spell: {
      name: "Avatar of the Apex",
      description: "ULTIMATE: Spend 75 Blood-Heat to assume the form of the Apex Predator for 1 minute: all allies within 40 feet gain +3 to hit, all party attacks deal +2d8 primal damage, and whenever ANY party member kills an enemy, the whole party gains 15 temporary health and +10ft movement speed.",
      flavorText: "Every ecosystem has a summit. You and your pack are standing on it.",
      source: "talent", class: "Berserker", treeId: "savage_instincts",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 180, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { bloodHeat: { baseAmount: 75 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      buffs: ["apex-avatar"], damageTypes: ["primal"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      visualTheme: "primal", tags: ["ultimate", "capstone", "party-buff", "berserker"]
    },
    rankUpgrades: []
  },
  {
    id: "svi_t7_pack_alpha",
    name: "Alpha Presence Doctrine",
    icon: "ability_hunter_packhunt",
    maxRanks: 5,
    position: { x: 1.5, y: 8 },
    requires: "svi_t6_alpha_command",
    spell: {
      name: "Alpha Presence Doctrine",
      description: "The pack fights harder with its alpha in sight. Allies within 30 feet deal +5% damage across all sources.",
      flavorText: "Leadership by proximity to teeth.",
      source: "talent", class: "Berserker", treeId: "savage_instincts",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "capstone", "aura", "ally", "berserker"]
    },
    rankUpgrades: [
      { description: "Allies within 30 feet deal +10% damage." },
      { description: "Allies within 30 feet deal +15% damage." },
      { description: "Allies within 30 feet deal +20% damage." },
      { description: "Allies within 45 feet deal +25% damage, +2 to hit, and gain +2 Durability Steps to equipped durability." }
    ]
  },
  {
    id: "svi_t7_primal_force",
    name: "Huntmaster's Command",
    icon: "spell_nature_naturetouchgrow",
    maxRanks: 3,
    position: { x: 2.5, y: 8 },
    requires: "svi_t6_battle_hardened",
    spell: {
      name: "Huntmaster's Command",
      description: "Mark Prey can now mark 2 targets simultaneously. Attacking either marked target refunds 5 Blood-Heat.",
      flavorText: "The hunt has grown. So has the quarry list.",
      source: "talent", class: "Berserker", treeId: "savage_instincts",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "capstone", "mark", "berserker"]
    },
    rankUpgrades: [
      { description: "Mark Prey can mark up to 3 targets. Attacking marked targets refunds 10 Blood-Heat." },
      { description: "Mark Prey can mark up to 3 targets. When any Quarry dies, Mark Prey immediately casts on a new target for free and Alpha Command cooldown is reduced by 20s." }
    ]
  },
  {
    id: "svi_t7_endurance_training",
    name: "Tundra Apex Vitality",
    icon: "spell_holy_wordfortitude",
    maxRanks: 3,
    position: { x: 3.5, y: 8 },
    requires: "svi_t6_battle_hardened",
    spell: {
      name: "Tundra Apex Vitality",
      description: "You and all allies within 30 feet gain +20 maximum health and +10% resistance to rime and cold damage.",
      flavorText: "Train until the cold is a detail.",
      source: "talent", class: "Berserker", treeId: "savage_instincts",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "rime", tags: ["passive", "capstone", "health", "party-buff", "berserker"]
    },
    rankUpgrades: [
      { description: "Party gains +35 maximum health, +20% rime resistance, and +1 Durability Steps to equipped durability." },
      { description: "Party gains +50 maximum health, +30% rime resistance, +2 Durability Steps to equipped durability, and regeneration of 1d6 health per round out of combat." }
    ]
  },
  {
    id: "svi_t7_environmental_adaptation",
    name: "Coordinated Blitz",
    icon: "ability_warrior_savageblow",
    maxRanks: 3,
    position: { x: 4.5, y: 8 },
    requires: "svi_t6_flank_mastery",
    spell: {
      name: "Coordinated Blitz",
      description: "Whenever an ally scores a critical strike on your Quarry, you get an immediate free melee attack against the Quarry (reaction).",
      flavorText: "The blizzard apologized, eventually.",
      source: "talent", class: "Berserker", treeId: "savage_instincts",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "capstone", "reaction-strike", "berserker"]
    },
    rankUpgrades: [
      { description: "Whenever ANY ally scores a crit on Quarry, both you AND another ally get a free basic attack against it." },
      { description: "Whenever any ally crits Quarry, all nearby allies get a free basic attack against it, and the Quarry is stunned for 1 round." }
    ]
  }
];
