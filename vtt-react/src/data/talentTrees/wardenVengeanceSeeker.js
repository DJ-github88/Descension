// ============================================
// WARDEN — VENGEANCE SEEKER (v4: Balanced & Normalized)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 20 pts (tier 7) = 50.
//
// SPEC IDENTITY: The Retaliation Juggernaut / Burning Vengeance Avatar.
// While Jailer locks enemies in arcane chains and Shadowblade strikes from stealth,
// Vengeance Seeker welcomes incoming attacks, converting pain directly into
// Tension (VP), counter-striking with searing blight fire, and transforming
// into a terrifying, towering Nemesis Avatar.
// ============================================

export const WARDEN_VENGEANCE_SEEKER = [
  // ──────────────── TIER 1 (8 pts, Row 0) ────────────────
  {
    id: "wvs_t1_vengeful_lash",
    name: "Vengeful Lash",
    icon: "spell_fire_soulburn",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Vengeful Lash",
      description: "Strike an enemy within 15 feet with a lash of burning shadow: deals 1d8 blight damage and grants 1 Tension (VP). Deals +1d4 bonus blight damage if the target damaged you since your last turn.",
      flavorText: "Every wound is a deposit. This is the first withdrawal.",
      source: "talent", class: "Warden", treeId: "vengeance_seeker",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 1,
      targetingMode: "single", rangeType: "melee", range: 15,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 1, cooldownUnit: "round",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 2 } },
      damageTypes: ["blight"],
      primaryDamage: { dice: "1d8", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["melee", "blight", "vp-builder", "warden"]
    },
    rankUpgrades: [
      { description: "Deals 1d10 blight damage, grants 1 VP, and deals +1d6 bonus damage if recently damaged by target.", primaryDamage: { dice: "1d10", flat: 0, procChance: 100 } },
      { description: "Deals 2d6 blight damage, grants 2 VP, deals +1d8 bonus damage, and pulls the target 5 feet closer.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "wvs_t1_unyielding_vengeance",
    name: "Unyielding Grudge",
    icon: "spell_fire_elemental_totem",
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    spell: {
      name: "Unyielding Grudge",
      description: "Passive: Your maximum VP capacity increases by 1. Whenever you suffer damage from an enemy attack, you gain 1 VP (max once per round).",
      flavorText: "The grudge holds room for more.",
      source: "talent", class: "Warden", treeId: "vengeance_seeker",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "resource", "vp-gain", "warden"]
    },
    rankUpgrades: [
      { description: "Maximum VP capacity increases by 2; gain 1 VP whenever damaged by an enemy." },
      { description: "Maximum VP capacity increases by 3; gain 1 VP whenever damaged, and gain +1 to Fortitude saves." }
    ]
  },
  {
    id: "wvs_t1_fury_buildup",
    name: "Spiteful Resilience",
    icon: "ability_warrior_battleshout",
    maxRanks: 2,
    position: { x: 3, y: 0 },
    requires: null,
    spell: {
      name: "Spiteful Resilience",
      description: "Passive: While you have 3 or more VP, you gain +1 Damage Reduction against physical attacks and your melee attacks deal +1d4 bonus blight damage.",
      flavorText: "Full reservoirs overflow violently.",
      source: "talent", class: "Warden", treeId: "vengeance_seeker",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["blight"],
      primaryDamage: { dice: "1d4", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["passive", "dr", "bonus-damage", "warden"]
    },
    rankUpgrades: [
      { description: "At 3+ VP: gain +2 Damage Reduction against all attacks and attacks deal +1d6 bonus blight damage." }
    ]
  },

  // ──────────────── TIER 2 (6 pts, Row 1) ────────────────
  {
    id: "wvs_t2_retaliatory_surge",
    name: "Retaliatory Surge",
    icon: "ability_warrior_revenge",
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: "wvs_t1_vengeful_lash",
    spell: {
      name: "Retaliatory Surge",
      description: "Reaction (spend 1 VP): When struck by a melee attack, immediately counter-strike with dark fire dealing 1d8 blight damage and restoring 1d4 Hit Points.",
      flavorText: "The blow lands twice. Once each direction.",
      source: "talent", class: "Warden", treeId: "vengeance_seeker",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 0,
      targetingMode: "single", rangeType: "melee", range: 5,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 1, cooldownUnit: "round",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { vengeance: { baseAmount: 1 } },
      damageTypes: ["blight"],
      primaryDamage: { dice: "1d8", flat: 0, procChance: 100 },
      healing: { dice: "1d4", flat: 0 },
      visualTheme: "shadow", tags: ["reaction", "counter-strike", "lifesteal", "warden"]
    },
    rankUpgrades: [
      { description: "Deals 1d10 blight damage, heals for 1d6 Hit Points, and knocks the attacker back 5 feet.", primaryDamage: { dice: "1d10", flat: 0, procChance: 100 }, healing: { dice: "1d6", flat: 0 } },
      { description: "Deals 2d6 blight damage, heals for 1d8, and forces the attacker to make a Fortitude save (DC 13) or be Staggered for 1 round.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 }, healing: { dice: "1d8", flat: 0 } }
    ]
  },
  {
    id: "wvs_t2_spectral_retribution",
    name: "Burning Grudge Aura",
    icon: "spell_fire_soulburn",
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: "wvs_t1_unyielding_vengeance",
    spell: {
      name: "Burning Grudge Aura",
      description: "Passive: Whenever an adjacent enemy hits you with a melee attack, they suffer 1d4 blight damage in retribution.",
      flavorText: "Anger sharpens with proximity.",
      source: "talent", class: "Warden", treeId: "vengeance_seeker",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["blight"],
      primaryDamage: { dice: "1d4", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["passive", "retaliation-aura", "warden"]
    },
    rankUpgrades: [
      { description: "Retribution aura deals 1d6 blight damage.", primaryDamage: { dice: "1d6", flat: 0, procChance: 100 } },
      { description: "Retribution aura deals 1d8 blight damage and applies 1d4 burning blight over 2 rounds.", primaryDamage: { dice: "1d8", flat: 0, procChance: 100 } }
    ]
  },

  // ──────────────── TIER 3 (6 pts, Row 2) ────────────────
  {
    id: "wvs_t3_avatar_of_vengeance",
    name: "Avatar of Vengeance",
    icon: "spell_fire_elementaldevastation",
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: "wvs_t2_retaliatory_surge",
    spell: {
      name: "Avatar of Vengeance",
      description: "Spend 2 AP and 3 VP: ignite into the Avatar of Vengeance for 2 rounds. Gain +1 Damage Reduction against all attacks, regenerate 1d4 health per round, and your attacks deal +1d6 bonus blight damage.",
      flavorText: "The mounds send back what they owe.",
      source: "talent", class: "Warden", treeId: "vengeance_seeker",
      spellType: "ACTIVE", category: "buff",
      actionPoints: 2,
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 3, cooldownUnit: "rounds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { vengeance: { baseAmount: 3 } },
      durationRounds: 2,
      buffs: ["avatar-vengeance"], visualTheme: "shadow", tags: ["transform", "avatar", "sustain", "warden"]
    },
    rankUpgrades: [
      { description: "Avatar lasts 3 rounds: +2 Damage Reduction, regenerates 1d6 health per round, and +1d8 bonus blight damage.", durationRounds: 3 },
      { description: "Avatar lasts 3 rounds: +2 Damage Reduction, regenerates 1d8 health per round, +2d6 bonus blight damage, and advantage on saving throws against fear and charm.", durationRounds: 3 }
    ]
  },
  {
    id: "wvs_t3_avatar_synergy",
    name: "Nemesis Resonance",
    icon: "spell_fire_fireball02",
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: "wvs_t2_spectral_retribution",
    spell: {
      name: "Nemesis Resonance",
      description: "Passive: While in Avatar of Vengeance, you generate 1 additional VP at the start of each turn and your attacks gain +1 to hit.",
      flavorText: "The engine idles hot and hungry.",
      source: "talent", class: "Warden", treeId: "vengeance_seeker",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "avatar-boost", "crit", "warden"]
    },
    rankUpgrades: [
      { description: "Generate 1 VP per turn; +2 to hit, and critical hits extend Avatar duration by 1 round (max 1 extension)." },
      { description: "Generate 2 VP per turn; +2 to hit, weapon attacks crit on 19-20 during Avatar, and critical hits extend Avatar by 1 round." }
    ]
  },

  // ──────────────── TIER 4 (5 pts, Row 3) ────────────────
  {
    id: "wvs_t4_grudge_cleave",
    name: "Grudge Cleave",
    icon: "ability_warrior_cleave",
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: "wvs_t3_avatar_of_vengeance",
    spell: {
      name: "Grudge Cleave",
      description: "Spend 2 AP and 2 VP: unleash a sweeping arc of dark flame in a 15-foot cone. Deals 2d6 blight damage and reduces enemy Armor by 1 for 2 rounds.",
      flavorText: "A sweeping statement made in burning steel.",
      source: "talent", class: "Warden", treeId: "vengeance_seeker",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 2,
      targetingMode: "aoe", rangeType: "self", range: 15, aoeShape: "cone", aoeSize: 15,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 1, cooldownUnit: "round",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { vengeance: { baseAmount: 2 } },
      damageTypes: ["blight"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      debuffs: ["sunder"], visualTheme: "shadow", tags: ["cone", "cleave", "sunder", "warden"]
    },
    rankUpgrades: [
      { description: "20-foot cone deals 2d8 blight damage and reduces enemy Armor by 2 for 2 rounds.", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 }, range: 20, aoeSize: 20 },
      { description: "20-foot cone deals 2d10 blight damage, reduces Armor by 2, and forces a Fortitude save (DC 14) or be knocked Prone.", primaryDamage: { dice: "2d10", flat: 0, procChance: 100 }, range: 20, aoeSize: 20 }
    ]
  },
  {
    id: "wvs_t4_spite_siphon",
    name: "Spite Siphon",
    icon: "spell_shadow_lifedrain02",
    maxRanks: 2,
    position: { x: 3, y: 3 },
    requires: "wvs_t3_avatar_synergy",
    spell: {
      name: "Spite Siphon",
      description: "Passive: When you are reduced below half maximum Hit Points, immediately gain 2 VP and 1d8 temporary health for 2 rounds (cooldown: 3 rounds).",
      flavorText: "Wounds only supply the kiln.",
      source: "talent", class: "Warden", treeId: "vengeance_seeker",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "emergency-vp", "shield", "warden"]
    },
    rankUpgrades: [
      { description: "Gain 3 VP and 2d6 temporary health when dropped below half health (cooldown: 2 rounds)." }
    ]
  },

  // ──────────────── TIER 5 (5 pts, Row 4) ────────────────
  {
    id: "wvs_t5_eye_for_an_eye",
    name: "Eye for an Eye",
    icon: "spell_shadow_shadowwordpain",
    maxRanks: 2,
    position: { x: 1, y: 4 },
    requires: "wvs_t4_grudge_cleave",
    spell: {
      name: "Eye for an Eye",
      description: "Spend 1 AP and 3 VP: designate a target within 30 feet for 2 rounds. 25% of all damage you suffer is duplicated directly onto that target as blight damage.",
      flavorText: "What you deal out to us, you receive in full.",
      source: "talent", class: "Warden", treeId: "vengeance_seeker",
      spellType: "ACTIVE", category: "debuff",
      actionPoints: 1,
      targetingMode: "single", rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 3, cooldownUnit: "rounds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { vengeance: { baseAmount: 3 } },
      durationRounds: 2,
      debuffs: ["eye-for-an-eye"], visualTheme: "shadow", tags: ["damage-reflection", "boss-killer", "warden"]
    },
    rankUpgrades: [
      { description: "Target receives 40% of damage you suffer for 2 rounds, and duration increases to 3 rounds.", durationRounds: 3 }
    ]
  },
  {
    id: "wvs_t5_unbroken_spite",
    name: "Endless Retaliation",
    icon: "ability_warrior_shieldreflection",
    maxRanks: 3,
    position: { x: 3, y: 4 },
    requires: "wvs_t4_spite_siphon",
    spell: {
      name: "Endless Retaliation",
      description: "Passive: Retaliatory Surge refunds 1 AP when triggered, and its damage is increased by +1d4.",
      flavorText: "There is no waiting in line for justice.",
      source: "talent", class: "Warden", treeId: "vengeance_seeker",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "reaction-cap", "warden"]
    },
    rankUpgrades: [
      { description: "Retaliatory Surge damage +1d6 and you gain +1 to hit on your next turn after triggering a reaction." },
      { description: "Retaliatory Surge damage +1d8 and each counter-attack restores 1 VP if it kills or critically strikes the target." }
    ]
  },

  // ──────────────── TIER 6 (5 pts, Row 5) ────────────────
  {
    id: "wvs_t6_cataclysmic_retribution",
    name: "Cataclysmic Retribution",
    icon: "spell_fire_selfdestruct",
    maxRanks: 1,
    position: { x: 1, y: 5 },
    requires: "wvs_t5_eye_for_an_eye",
    spell: {
      name: "Cataclysmic Retribution",
      description: "Spend 2 AP and 4 VP: detonate stored agony in a 20-foot shockwave. Deals 3d8 blight damage to all nearby enemies, and forces each target to make a Fortitude save (DC 14) or be Staggered for 1 round.",
      flavorText: "The reckoning arrives all at once.",
      source: "talent", class: "Warden", treeId: "vengeance_seeker",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 2,
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 20,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 4, cooldownUnit: "rounds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { vengeance: { baseAmount: 4 } },
      damageTypes: ["blight"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      debuffs: ["stagger"], visualTheme: "shadow", tags: ["aoe", "nuke", "mass-stagger", "warden"]
    },
    rankUpgrades: []
  },
  {
    id: "wvs_t6_iron_grudge",
    name: "Juggernaut Momentum",
    icon: "ability_warrior_defensivestance",
    maxRanks: 2,
    position: { x: 2.5, y: 5 },
    requires: "wvs_t5_unbroken_spite",
    spell: {
      name: "Juggernaut Momentum",
      description: "Passive: While in Avatar of Vengeance, you gain advantage on saving throws against forced movement, prone, and displacement, and gain +1 Damage Reduction.",
      flavorText: "An unmovable fury in iron boots.",
      source: "talent", class: "Warden", treeId: "vengeance_seeker",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "immunity", "durability", "warden"]
    },
    rankUpgrades: [
      { description: "Gain immunity to Prone and forced movement while in Avatar, and +2 Damage Reduction against magical attacks." }
    ]
  },
  {
    id: "wvs_t6_dread_nemesis",
    name: "Nemesis Mark",
    icon: "spell_shadow_curseofsargeras",
    maxRanks: 2,
    position: { x: 4, y: 5 },
    requires: "wvs_t5_unbroken_spite",
    spell: {
      name: "Nemesis Mark",
      description: "Passive: When an enemy scores a critical hit against you or reduces you below 50% HP, they become your Nemesis: your attacks against them deal +1d6 bonus blight damage for 2 rounds.",
      flavorText: "Once written in the ledger, the debt must be paid.",
      source: "talent", class: "Warden", treeId: "vengeance_seeker",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "mark", "sunder", "warden"]
    },
    rankUpgrades: [
      { description: "Bonus damage increases to +1d8 blight damage and your attacks ignore 2 points of their Armor." }
    ]
  },

  // ──────────────── TIER 7 / CAPSTONE (20 pts, Row 6) ────────────────
  {
    id: "wvs_t7_avatar_of_the_nemesis",
    name: "Avatar of the Nemesis",
    icon: "spell_fire_elementaldevastation",
    maxRanks: 1,
    position: { x: 0.5, y: 6 },
    requires: "wvs_t6_cataclysmic_retribution",
    spell: {
      name: "Avatar of the Nemesis",
      description: "CAPSTONE: Spend 2 AP and 5 VP: ascend into the Colossal Nemesis for 3 rounds. Gain +2 Damage Reduction against all damage, become immune to fear and stun, your melee attacks deal +2d6 bonus blight damage, and 20% of damage you take is reflected to all enemies within 15 feet.",
      flavorText: "The final incarnation of wrath. Nothing that struck it survives.",
      source: "talent", class: "Warden", treeId: "vengeance_seeker",
      spellType: "ACTIVE", category: "buff",
      actionPoints: 2,
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 5, cooldownUnit: "rounds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { vengeance: { baseAmount: 5 } },
      durationRounds: 3,
      buffs: ["colossal-nemesis"], visualTheme: "shadow", tags: ["ultimate", "capstone", "warden"]
    },
    rankUpgrades: []
  },
  {
    id: "wvs_t7_nemesis_doctrine",
    name: "Nemesis Doctrine",
    icon: "spell_fire_soulburn",
    maxRanks: 5,
    position: { x: 1.5, y: 6 },
    requires: "wvs_t6_cataclysmic_retribution",
    spell: {
      name: "Nemesis Doctrine",
      description: "Passive: Every scar is a weapon. All blight and retaliation damage you deal is increased by +1 flat damage.",
      flavorText: "The flame burns brightest where the wood was deepest scarred.",
      source: "talent", class: "Warden", treeId: "vengeance_seeker",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["blight"],
      visualTheme: "shadow", tags: ["passive", "capstone", "damage", "warden"]
    },
    rankUpgrades: [
      { description: "All blight and retaliation damage increased by +2 flat damage." },
      { description: "All blight and retaliation damage increased by +3 flat damage." },
      { description: "All blight and retaliation damage increased by +4 flat damage." },
      { description: "All blight and retaliation damage increased by +5 flat damage and +1d4 bonus blight on crits." }
    ]
  },
  {
    id: "wvs_t7_infinite_vp",
    name: "Bottomless Grudge",
    icon: "spell_fire_elemental_totem",
    maxRanks: 3,
    position: { x: 2.5, y: 6 },
    requires: "wvs_t6_iron_grudge",
    spell: {
      name: "Bottomless Grudge",
      description: "Passive: Your maximum VP increases by 1, and you generate 1 VP at the start of every combat round.",
      flavorText: "A reservoir that fills itself.",
      source: "talent", class: "Warden", treeId: "vengeance_seeker",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "capstone", "vp-engine", "warden"]
    },
    rankUpgrades: [
      { description: "Maximum VP increases by 2; generate 1 VP per round and gain +5 feet movement speed." },
      { description: "Maximum VP increases by 3; generate 2 VP per round and VP abilities cost 1 fewer VP (minimum 1)." }
    ]
  },
  {
    id: "wvs_t7_burning_spite",
    name: "Infernal Retribution",
    icon: "spell_fire_flameblades",
    maxRanks: 3,
    position: { x: 3.5, y: 6 },
    requires: "wvs_t6_dread_nemesis",
    spell: {
      name: "Infernal Retribution",
      description: "Passive: Retaliation damage scores critical hits on an attack roll of 19-20 and critical hits restore 1d4 Hit Points.",
      flavorText: "The counter-blow strikes straight through the heart.",
      source: "talent", class: "Warden", treeId: "vengeance_seeker",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "capstone", "crit-counter", "warden"]
    },
    rankUpgrades: [
      { description: "Retaliation crits deal +1d6 bonus blight damage and restore 1d6 Hit Points." },
      { description: "Retaliation crits deal +1d8 bonus blight damage, restore 1d8 Hit Points, and force target to make a Fortitude save (DC 14) or be knocked Prone." }
    ]
  },
  {
    id: "wvs_t7_immortal_grudge",
    name: "Immortal Vengeance",
    icon: "ability_warrior_bloodfrenzy",
    maxRanks: 3,
    position: { x: 4.5, y: 6 },
    requires: "wvs_t6_dread_nemesis",
    spell: {
      name: "Immortal Vengeance",
      description: "Passive: When you would suffer lethal damage while holding at least 2 VP, you instead drop to 1 Hit Point, consume all VP, and gain 1d8 temporary health (once per encounter).",
      flavorText: "Death itself cannot collect until the vengeance is paid.",
      source: "talent", class: "Warden", treeId: "vengeance_seeker",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "capstone", "cheat-death", "warden"]
    },
    rankUpgrades: [
      { description: "Survive lethal damage, gain 2d6 temporary health, and gain 2 VP immediately." },
      { description: "Survive lethal damage, enter Avatar of Vengeance for 2 rounds for free, and gain 2d8 temporary health." }
    ]
  }
];
