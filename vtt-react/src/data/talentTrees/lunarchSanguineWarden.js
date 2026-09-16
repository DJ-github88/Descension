// ============================================
// LUNARCH — SANGUINE WARDEN (v2: talents are spells)
// Spec: Parasitic Vitality Siphon, Symbiotic Body Shielding, Phase-Shift Endurance, Ally Life-Tether
// Resource: Lunar Phases (New Moon -> Waxing -> Full Moon -> Waning)
// Economy: 8/6/6/5/5/5 + 15 = 50 pts (18 nodes)
// ============================================

export const LUNARCH_SANGUINE_WARDEN = [
  // ─── TIER 1 (y: 0) ───
  {
    id: "lsw_t1_symbiotic_carapace",
    name: "Symbiotic Carapace",
    icon: "Nature/Earth Shield",
    maxRanks: 3,
    position: { x: 3.5, y: 0 },
    requires: null,
    spell: {
      name: "Symbiotic Carapace",
      description: "Passive: The parasite weaves starlight filaments beneath your skin. Gain +3 Passive DR against physical attacks and convert 20% of all damage taken into temporary Grit shielding.",
      flavorText: "The parasite defends its home because without the host, it starves.",
      source: "talent", class: "Lunarch", treeId: "sanguine_warden",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "arcane", tags: ["passive", "dr", "shield", "defense", "lunarch"]
    },
    rankUpgrades: [
      { description: "Passive DR increases to +5 and damage conversion increases to 35%." },
      { description: "Passive DR increases to +7; taking physical damage heals you for 5% of max HP (once per round)." }
    ]
  },
  {
    id: "lsw_t1_sanguine_transfer",
    name: "Sanguine Transfer",
    icon: "Necrotic/Drain Soul",
    maxRanks: 3,
    position: { x: 2.5, y: 0 },
    requires: null,
    spell: {
      name: "Sanguine Transfer",
      description: "Spend 1 AP: Siphon life from target within 30 ft: deals 1d8 wyrd damage to an enemy and heals yourself or an ally within 30 ft for 100% of damage dealt.",
      flavorText: "Circulate blood across moonlight threads.",
      source: "talent", class: "Lunarch", treeId: "sanguine_warden",
      spellType: "ACTIVE", category: "healing",
      actionPoints: 1, targetingMode: "single", rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 1, cooldownUnit: "rounds",
      resourceCosts: { mana: { baseAmount: 4 } },
      damageTypes: ["wyrd"],
      primaryDamage: { dice: "1d8", flat: 0, procChance: 100 },
      healing: { dice: "1d8" },
      visualTheme: "blood", tags: ["siphon", "heal", "builder", "lunarch"]
    },
    rankUpgrades: [
      { description: "Damage and healing increase to 2d8 wyrd.", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 }, damageTypes: ["wyrd"], healing: { dice: "2d8" } },
      { description: "Damage and healing increase to 3d8 wyrd; healed target also gains 10 temporary HP.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 }, damageTypes: ["wyrd"], healing: { dice: "3d8" } }
    ]
  },
  {
    id: "lsw_t1_phase_endurance",
    name: "Transition Shock Absorption",
    icon: "Arcane/Crescent Moon",
    maxRanks: 2,
    position: { x: 1.5, y: 0 },
    requires: null,
    spell: {
      name: "Transition Shock Absorption",
      description: "Passive: You take 50% reduced damage from Lunar Phase shifts. Each phase shift grants you 20 temporary HP for 3 rounds.",
      flavorText: "The host's body learns the rhythm of the internal eclipse.",
      source: "talent", class: "Lunarch", treeId: "sanguine_warden",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "arcane", tags: ["passive", "phase-shield", "temp-hp", "lunarch"]
    },
    rankUpgrades: [
      { description: "Completely eliminates self-damage from Phase shifts; temporary HP granted increases to 40 and extends to adjacent allies." }
    ]
  },

  // ─── TIER 2 (y: 1) ───
  {
    id: "lsw_t2_vitality_tether",
    name: "Symbiotic Life-Tether",
    icon: "Nature/Shield Break",
    maxRanks: 3,
    position: { x: 2.5, y: 1 },
    requires: "lsw_t1_symbiotic_carapace",
    spell: {
      name: "Symbiotic Life-Tether",
      description: "Spend 1 AP: Bind a silver vitality tether to an ally within 40 ft for 3 rounds. 30% of all damage they take is redirected to your protective Grit shielding instead.",
      flavorText: "Two bodies woven together by cold starlight.",
      source: "talent", class: "Lunarch", treeId: "sanguine_warden",
      spellType: "ACTIVE", category: "buff",
      actionPoints: 1, targetingMode: "single", rangeType: "ranged", range: 40,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 2, cooldownUnit: "rounds",
      resourceCosts: { mana: { baseAmount: 5 } },
      visualTheme: "arcane", tags: ["tether", "redirect", "tank", "support", "lunarch"]
    },
    rankUpgrades: [
      { description: "Redirect percentage increases to 50%, and tethered ally gains +2 Passive DR." },
      { description: "Redirect percentage increases to 70%; whenever you heal, the tethered ally heals for the same amount." }
    ]
  },
  {
    id: "lsw_t2_sanguine_bloom",
    name: "Parasitic Blood Well",
    icon: "Necrotic/Ritual of Blood",
    maxRanks: 3,
    position: { x: 0.5, y: 1 },
    requires: "lsw_t1_sanguine_transfer",
    spell: {
      name: "Parasitic Blood Well",
      description: "Spend 2 AP: sear open a seam and plant a living pool of moonlight blood in a 15 ft radius within 30 ft. Lasts 3 rounds: allies inside heal 2d6 HP per round, while enemies take 2d6 wyrd damage per round.",
      flavorText: "A pool of silver vital fluid that feeds friends and digests foes.",
      source: "talent", class: "Lunarch", treeId: "sanguine_warden",
      spellType: "ACTIVE", category: "healing",
      actionPoints: 2, targetingMode: "aoe", rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 2, cooldownUnit: "rounds",
      resourceCosts: { mana: { baseAmount: 6 }, health: { baseAmount: 4, costType: "flat" } },
      damageTypes: ["wyrd"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      healing: { dice: "2d6" },
      visualTheme: "blood", tags: ["aoe", "hot", "dot", "ground", "lunarch"]
    },
    rankUpgrades: [
      { description: "Healing and damage increase to 3d6, and radius extends to 20 ft.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 }, damageTypes: ["wyrd"], healing: { dice: "3d6" } },
      { description: "Healing and damage increase to 4d8; allies inside gain Advantage on Constitution saves.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 }, damageTypes: ["wyrd"], healing: { dice: "4d8" } }
    ]
  },

  // ─── TIER 3 (y: 2) ───
  {
    id: "lsw_t3_symbiotic_shield",
    name: "Moonwell Aegis",
    icon: "Healing/Heart Shield",
    maxRanks: 3,
    position: { x: 3.5, y: 2 },
    requires: "lsw_t2_vitality_tether",
    spell: {
      name: "Moonwell Aegis",
      description: "Spend 2 AP: Encase yourself or an ally in a crystalline silver starlight cocoon for 2 rounds: grants a 40 HP temporary shield and complete immunity to all debuffs.",
      flavorText: "The symbiote hardens into a chrysalis of pure silver.",
      source: "talent", class: "Lunarch", treeId: "sanguine_warden",
      spellType: "ACTIVE", category: "buff",
      actionPoints: 2, targetingMode: "single", rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 3, cooldownUnit: "rounds",
      resourceCosts: { mana: { baseAmount: 7 } },
      visualTheme: "arcane", tags: ["shield", "cocoon", "immunity", "lunarch"]
    },
    rankUpgrades: [
      { description: "Shield value increases to 65 HP, and cleanses all existing conditions upon application." },
      { description: "Shield value increases to 90 HP; when the shield breaks or expires, it bursts healing all nearby allies for 3d8 HP.", healing: { dice: "3d8" } }
    ]
  },
  {
    id: "lsw_t3_leeching_strikes",
    name: "Symbiote Thorns Siphon",
    icon: "Necrotic/Necrotic Necrosis",
    maxRanks: 3,
    position: { x: 0.5, y: 2 },
    requires: "lsw_t2_sanguine_bloom",
    spell: {
      name: "Symbiote Thorns Siphon",
      description: "Passive: Attackers that strike you in melee take 1d8 wyrd retaliation damage, and you heal for 100% of the retaliation damage dealt.",
      flavorText: "To touch the host is to feed the parasite.",
      source: "talent", class: "Lunarch", treeId: "sanguine_warden",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "single", damageTypes: ["wyrd"],
      primaryDamage: { dice: "1d8", flat: 0, procChance: 100 },
      healing: { dice: "1d8" },
      visualTheme: "blood", tags: ["passive", "thorns", "lifesteal", "lunarch"]
    },
    rankUpgrades: [
      { description: "Retaliation damage increases to 2d8 wyrd, and also triggers against ranged attackers within 20 ft.", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 }, damageTypes: ["wyrd"], healing: { dice: "2d8" } },
      { description: "Retaliation damage increases to 3d8 wyrd, the siphon heals you for 150% of the retaliation damage dealt, and each retaliation applies Bleeding for 2 rounds.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 }, damageTypes: ["wyrd"], healing: { dice: "3d8" } }
    ]
  },

  // ─── TIER 4 (y: 3) ───
  {
    id: "lsw_t4_celestial_rebirth",
    name: "Symbiotic Resurgence",
    icon: "Healing/Ressusitate",
    maxRanks: 2,
    position: { x: 3, y: 3 },
    requires: "lsw_t3_symbiotic_shield",
    spell: {
      name: "Symbiotic Resurgence",
      description: "REACTION — When you or an ally with Vitality Tether would suffer a fatal blow, the parasite consumes its own reserves to prevent death: restore the target to 30% max health and gain 30 temporary HP (once per combat).",
      flavorText: "The parasite refuses to let the vessel sink.",
      source: "talent", class: "Lunarch", treeId: "sanguine_warden",
      spellType: "ACTIVE", actionType: "reaction", category: "healing",
      actionPoints: 0, targetingMode: "single", rangeType: "ranged", range: 40,
      castTimeType: "reaction", castTimeValue: 1,
      reactionTrigger: "When you or an ally bound by a Vitality Tether would suffer a fatal blow",
      cooldownValue: 5, cooldownUnit: "rounds",
      resourceCosts: { mana: { baseAmount: 8 } },
      visualTheme: "arcane", tags: ["reaction", "cheat-death", "resurgence", "lunarch"]
    },
    rankUpgrades: [
      { description: "Health restored increases to 60% max HP, grants 60 temporary HP, and the target becomes immune to all damage for 1 round following the resurgence." }
    ]
  },
  {
    id: "lsw_t4_blood_tide_pulse",
    name: "Sanguine Shockwave",
    icon: "Necrotic/Skull Burst",
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: "lsw_t3_leeching_strikes",
    spell: {
      name: "Sanguine Shockwave",
      description: "Spend 2 AP: tear open a seam and release a 20 ft pulse of silver blood: deals 4d8 wyrd damage to all enemies and heals all allies in the radius for 3d8 HP.",
      flavorText: "A heartbeat heard outside the chest.",
      source: "talent", class: "Lunarch", treeId: "sanguine_warden",
      spellType: "ACTIVE", category: "healing",
      actionPoints: 2, targetingMode: "aoe", rangeType: "self-centered", range: 20,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 2, cooldownUnit: "rounds",
      resourceCosts: { mana: { baseAmount: 8 }, health: { baseAmount: 6, costType: "flat" } },
      damageTypes: ["wyrd"],
      primaryDamage: { dice: "4d8", flat: 0, procChance: 100 },
      healing: { dice: "3d8" },
      visualTheme: "blood", tags: ["aoe", "damage-and-heal", "burst", "lunarch"]
    },
    rankUpgrades: [
      { description: "Damage increases to 6d8 wyrd and healing increases to 4d8 HP.", primaryDamage: { dice: "6d8", flat: 0, procChance: 100 }, damageTypes: ["wyrd"], healing: { dice: "4d8" } },
      { description: "Damage increases to 8d8 wyrd; enemies struck are knocked back 10 ft and knocked Prone.", primaryDamage: { dice: "8d8", flat: 0, procChance: 100 }, damageTypes: ["wyrd"] }
    ]
  },

  // ─── TIER 5 (y: 4) ───
  {
    id: "lsw_t5_parasitic_hive_tether",
    name: "Hive-Mind Vitality Mesh",
    icon: "Nature/Root Network",
    maxRanks: 3,
    position: { x: 3, y: 4 },
    requires: "lsw_t4_celestial_rebirth",
    spell: {
      name: "Hive-Mind Vitality Mesh",
      description: "Passive: Vitality Tether can now be attached to your ENTIRE party simultaneously. All party members share a unified health buffer granting +4 Passive DR to all members.",
      flavorText: "The brood extends threads to every allied soul.",
      source: "talent", class: "Lunarch", treeId: "sanguine_warden",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", auraRadius: 40,
      visualTheme: "arcane", tags: ["passive", "hive-mind", "party-defense", "lunarch"]
    },
    rankUpgrades: [
      { description: "Passive DR increases to +6 for all party members, and healing any party member heals all others for 20% of the value." },
      { description: "Passive DR increases to +8; whenever any ally takes damage, all enemies within 10 ft of them take 1d8 wyrd retaliation.", primaryDamage: { dice: "1d8", flat: 0, procChance: 100 }, damageTypes: ["wyrd"] }
    ]
  },
  {
    id: "lsw_t5_full_moon_regeneration",
    name: "Lunar Tide Siphon",
    icon: "Healing/Renewal",
    maxRanks: 2,
    position: { x: 0.5, y: 4 },
    requires: "lsw_t4_blood_tide_pulse",
    spell: {
      name: "Lunar Tide Siphon",
      description: "Passive: During Waxing and Full Moon phases, your healing output is increased by 40% and all overhealing is converted into permanent shields.",
      flavorText: "The silver tide floods the wounds until they close seamlessly.",
      source: "talent", class: "Lunarch", treeId: "sanguine_warden",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "self",
      visualTheme: "arcane", tags: ["passive", "heal-boost", "overheal-shield", "lunarch"]
    },
    rankUpgrades: [
      { description: "Healing output increased by 75%; shields granted by overhealing have no upper limit." }
    ]
  },

  // ─── TIER 6 (y: 5) ───
  {
    id: "lsw_t6_moonwell_sanctuary",
    name: "Living Moonwell Sanctuary",
    icon: "Healing/Prayer",
    maxRanks: 3,
    position: { x: 4, y: 5 },
    requires: "lsw_t5_parasitic_hive_tether",
    spell: {
      name: "Living Moonwell Sanctuary",
      description: "Spend 3 AP: Transform a 30 ft radius into a holy Moonwell for 3 rounds. All allies inside take 50% reduced damage, regenerate 5d8 HP per round, and are immune to all status conditions.",
      flavorText: "A pool of pure silver starlight that heals the body and silences pain.",
      source: "talent", class: "Lunarch", treeId: "sanguine_warden",
      spellType: "ACTIVE", category: "healing",
      actionPoints: 3, targetingMode: "aoe", rangeType: "self-centered", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 4, cooldownUnit: "rounds",
      resourceCosts: { mana: { baseAmount: 12 } },
      healing: { dice: "5d8" },
      visualTheme: "arcane", tags: ["aoe", "sanctuary", "invulnerability-zone", "regen", "lunarch"]
    },
    rankUpgrades: [
      { description: "Damage reduction inside sanctuary increases to 65%, and regeneration increases to 7d8 HP/round.", healing: { dice: "7d8" } },
      { description: "Damage reduction increases to 80%; enemies attempting to enter the sanctuary take 6d8 wyrd damage and are repelled.", primaryDamage: { dice: "6d8", flat: 0, procChance: 100 }, damageTypes: ["wyrd"] }
    ]
  },
  {
    id: "lsw_t6_endless_symbiosis",
    name: "Eternal Vessel Vow",
    icon: "Healing/Golden Heart",
    maxRanks: 2,
    position: { x: 2.5, y: 5 },
    requires: "lsw_t5_full_moon_regeneration",
    spell: {
      name: "Eternal Vessel Vow",
      description: "Passive: Maximum Health increased by +35%. While at 100% health, your movement speed is increased by +15 ft and all ability costs are reduced by 1 AP (minimum 1).",
      flavorText: "When the host is pristine, the parasite gives everything freely.",
      source: "talent", class: "Lunarch", treeId: "sanguine_warden",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "arcane", tags: ["passive", "hp-boost", "ap-reduction", "lunarch"]
    },
    rankUpgrades: [
      { description: "Max HP bonus increases to +50%, and AP cost reduction applies while above 75% health." }
    ]
  },

  // ─── TIER 7 (Capstone Row, y: 6) ───
  {
    id: "lsw_t7_avatar_of_the_sanguine_moon",
    name: "Avatar of the Blood Moon Broodmother",
    icon: "Necrotic/Cosmic Entity",
    maxRanks: 1,
    position: { x: 3, y: 6 },
    requires: "lsw_t6_moonwell_sanctuary",
    spell: {
      name: "Avatar of the Blood Moon Broodmother",
      description: "CAPSTONE — Spend 3 AP: Fully fuse with the celestial entity for 3 rounds. All allies within 60 ft become completely immune to damage (all damage is absorbed by the infinite cosmic buffer), every allied attack deals +4d8 bonus wyrd damage and heals for 100% of damage dealt, and Sanguine Shockwave auto-casts every turn for free.",
      flavorText: "The host and the parasite are one. The brood will not allow a single life to fall.",
      source: "talent", class: "Lunarch", treeId: "sanguine_warden",
      spellType: "ACTIVE", category: "buff",
      actionPoints: 3, targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 8, cooldownUnit: "rounds",
      resourceCosts: { mana: { baseAmount: 15 } },
      durationRounds: 3,
      visualTheme: "blood", tags: ["capstone", "ultimate", "party-invulnerable", "symbiosis", "lunarch"]
    },
    rankUpgrades: []
  },
  {
    id: "lsw_t7_sanguine_tithe",
    name: "Sanguine Tithe",
    icon: "Healing/Broken Heart",
    maxRanks: 5,
    position: { x: 4.5, y: 6 },
    requires: "lsw_t6_moonwell_sanctuary",
    spell: {
      name: "Sanguine Tithe",
      description: "Spend 1 AP: tear open a seam along your forearm and tithe the blood to the moon — lose 8 HP, and heal the most wounded ally within 40 ft for 2d8 HP plus an amount equal to the HP lost.",
      flavorText: "Blood given freely is the purest silver the moon will ever drink.",
      source: "talent", class: "Lunarch", treeId: "sanguine_warden",
      spellType: "ACTIVE", category: "healing",
      actionPoints: 1, targetingMode: "single", rangeType: "ranged", range: 40,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 1, cooldownUnit: "rounds",
      resourceCosts: { mana: { baseAmount: 8 }, health: { baseAmount: 8, costType: "flat" } },
      healing: { dice: "2d8" },
      visualTheme: "blood", tags: ["capstone", "sacrifice", "heal", "tithe", "lunarch"]
    },
    rankUpgrades: [
      { description: "Healing increases to 3d8 HP, and the tithe also grants the ally a 10 HP shield.", healing: { dice: "3d8" } },
      { description: "Healing increases to 4d8 HP, and the tithe may be split between two allies within 40 ft.", healing: { dice: "4d8" } },
      { description: "Healing increases to 5d8 HP; if the tithed ally is below 50% health, the tithe heals them for an additional 2d8 HP.", healing: { dice: "5d8" } },
      { description: "Healing increases to 6d8 HP, and the seam closes around the wound — the HP you lose for the tithe is halved to 4.", healing: { dice: "6d8" }, resourceCosts: { mana: { baseAmount: 8 }, health: { baseAmount: 4, costType: "flat" } } }
    ]
  },
  {
    id: "lsw_t7_bloodmoon_transfusion",
    name: "Bloodmoon Transfusion",
    icon: "Healing/Heart Ripple",
    maxRanks: 3,
    position: { x: 2.5, y: 6 },
    requires: "lsw_t6_moonwell_sanctuary",
    spell: {
      name: "Bloodmoon Transfusion",
      description: "Spend 2 AP: open every seam at once and let a bloodmoon tide wash outward — lose 15 HP, and all allies within 30 ft heal 3d8 HP and gain a 15 HP shield.",
      flavorText: "Every drop he sheds becomes a roof over someone else's head.",
      source: "talent", class: "Lunarch", treeId: "sanguine_warden",
      spellType: "ACTIVE", category: "healing",
      actionPoints: 2, targetingMode: "aoe", rangeType: "self-centered", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 3, cooldownUnit: "rounds",
      resourceCosts: { mana: { baseAmount: 10 }, health: { baseAmount: 15, costType: "flat" } },
      healing: { dice: "3d8" },
      visualTheme: "blood", tags: ["capstone", "transfusion", "aoe", "shields", "lunarch"]
    },
    rankUpgrades: [
      { description: "Allies heal 4d8 HP and gain a 25 HP shield, and the tide cleanses one condition from each ally.", healing: { dice: "4d8" } },
      { description: "Allies heal 5d8 HP and gain a 40 HP shield; allies below 50% health gain double shields from the tide.", healing: { dice: "5d8" } }
    ]
  },
  {
    id: "lsw_t7_broodmothers_bargain",
    name: "Broodmother's Bargain",
    icon: "Nature/Thorny Entanglement",
    maxRanks: 3,
    position: { x: 0.5, y: 6 },
    requires: "lsw_t6_endless_symbiosis",
    spell: {
      name: "Broodmother's Bargain",
      description: "Spend 2 AP: cut a living brood-node from your own flesh — lose 12 HP — and graft it onto an ally within 30 ft for 3 rounds. The graft heals that ally for 3d8 HP at the start of each of their turns, and feeding it pushes the moon onward: advance your Lunar Phase by one step.",
      flavorText: "The broodmother always collects. The warden always pays.",
      source: "talent", class: "Lunarch", treeId: "sanguine_warden",
      spellType: "ACTIVE", category: "healing",
      actionPoints: 2, targetingMode: "single", rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 3, cooldownUnit: "rounds",
      resourceCosts: { mana: { baseAmount: 10 }, health: { baseAmount: 12, costType: "flat" }, lunar_phase: { baseAmount: 1, phaseAdvancement: 1 } },
      healing: { dice: "3d8" },
      visualTheme: "blood", tags: ["capstone", "symbiosis", "graft", "phase", "lunarch"]
    },
    rankUpgrades: [
      { description: "The graft heals 4d8 HP each round, and the grafted ally gains +2 Passive DR while it persists.", healing: { dice: "4d8" } },
      { description: "The graft heals 5d8 HP each round; when it ends, the brood-node detonates in a 15 ft pulse that heals all allies for 2d8 HP.", healing: { dice: "5d8" } }
    ]
  },
  {
    id: "lsw_t7_immortal_symbiosis_accord",
    name: "Accord of Undying Starlight",
    icon: "Healing/Armored Healing",
    maxRanks: 3,
    position: { x: 2, y: 6 },
    requires: "lsw_t6_endless_symbiosis",
    spell: {
      name: "Accord of Undying Starlight",
      description: "Passive: If you would die, the parasite dissolves and reforms your body 1 round later at 100% health and full resources at any chosen point within 60 ft (once per long rest).",
      flavorText: "Death is merely a discarded skin. The parasite weaves another.",
      source: "talent", class: "Lunarch", treeId: "sanguine_warden",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "self",
      visualTheme: "arcane", tags: ["passive", "capstone-row", "reincarnation", "lunarch"]
    },
    rankUpgrades: [
      { description: "Reformation triggers an immediate 30 ft Nova dealing 8d8 wyrd damage to all enemies and granting 100 HP shields to all allies.", primaryDamage: { dice: "8d8", flat: 0, procChance: 100 }, damageTypes: ["wyrd"] },
      { description: "Reformation's Nova increases to 10d8 wyrd damage and its shields increase to 150 HP; the accord can now answer death twice per long rest.", primaryDamage: { dice: "10d8", flat: 0, procChance: 100 }, damageTypes: ["wyrd"] }
    ]
  }
];
