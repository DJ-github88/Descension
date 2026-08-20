// ============================================
// WARDEN — VENGEANCE SEEKER (v3: spec identity redesign)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50.
//
// SPEC IDENTITY: The Retaliation Juggernaut / Burning Vengeance Avatar.
// While Jailer locks enemies in arcane chains and Shadowblade strikes from stealth,
// Vengeance Seeker welcomes incoming attacks, converting pain directly into
// Vengeance Points (VP), counter-striking with searing blight fire, and transforming
// into a terrifying, towering Nemesis Avatar.
//
// SIGNATURE ACTIVES:
//   - Vengeful Lash (t1):           Melee lash dealing blight damage and banking VP
//   - Retaliatory Surge (t2):       Reaction counter-strike punishing attackers
//   - Avatar of Vengeance (t3):     Transform into a burning avatar of vengeance
//   - Grudge Cleave (t4):           Consume VP for high-damage cone cleave
//   - Eye for an Eye (t5):          Channel all incoming party damage directly into attacker
//   - Cataclysmic Retribution (t6): Massive burst counter-detonation
//   - Avatar of the Nemesis (t7):   ULTIMATE — Giant Nemesis Avatar reflecting 100% damage to all nearby foes
// ============================================

export const WARDEN_VENGEANCE_SEEKER = [
  // ──────────────── TIER 1 (8 pts) ────────────────
  {
    id: "wvs_t1_vengeful_lash",
    name: "Vengeful Lash",
    icon: "spell_fire_soulburn",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Vengeful Lash",
      description: "Strike an enemy within 15 feet with a lash of burning shadow: deals 2d8 blight damage and grants 2 Vengeance Points (VP). Damage is increased by +2d8 damage if the target recently damaged you.",
      flavorText: "Every wound is a deposit. This is the first withdrawal.",
      source: "talent", class: "Warden", treeId: "vengeance_seeker",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "melee", range: 15,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 6, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 3 } },
      damageTypes: ["blight"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["melee", "blight", "vp-builder", "warden"]
    },
    rankUpgrades: [
      { description: "Deals 3d8 blight damage, grants 3 VP, and deals double damage if target recently attacked you.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } },
      { description: "Deals 4d8 blight damage, grants 4 VP, deals double damage, and pulls the target 10 feet toward you.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "wvs_t1_unyielding_vengeance",
    name: "Unyielding Grudge",
    icon: "spell_fire_elemental_totem",
    maxRanks: 3,
    position: { x: 2.5, y: 0 },
    requires: null,
    spell: {
      name: "Unyielding Grudge",
      description: "Your maximum VP increases by 4. Whenever you suffer damage from an enemy, you automatically gain 1 VP.",
      flavorText: "The grudge holds room for more.",
      source: "talent", class: "Warden", treeId: "vengeance_seeker",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "resource", "vp-gain", "warden"]
    },
    rankUpgrades: [
      { description: "Maximum VP +6; gain 2 VP whenever damaged by an enemy attack." },
      { description: "Maximum VP +8; gain 2 VP when damaged, and your durability increases by +1 per 3 VP held." }
    ]
  },
  {
    id: "wvs_t1_fury_buildup",
    name: "Spiteful Resilience",
    icon: "ability_warrior_battleshout",
    maxRanks: 2,
    position: { x: 4, y: 0 },
    requires: null,
    spell: {
      name: "Spiteful Resilience",
      description: "While at 5 or more VP, all damage you suffer is reduced by 15 points and your melee attacks deal +1d6 bonus blight damage.",
      flavorText: "Full reservoirs overflow violently.",
      source: "talent", class: "Warden", treeId: "vengeance_seeker",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["blight"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["passive", "dr", "bonus-damage", "warden"]
    },
    rankUpgrades: [
      { description: "At 5+ VP: damage taken reduced by 25 points, attacks deal +2d6 bonus blight damage, and you cannot be stunned." }
    ]
  },

  // ──────────────── TIER 2 (6 pts) ────────────────
  {
    id: "wvs_t2_retaliatory_surge",
    name: "Retaliatory Surge",
    icon: "ability_warrior_revenge",
    maxRanks: 3,
    position: { x: 1, y: 1.5 },
    requires: "wvs_t1_vengeful_lash",
    spell: {
      name: "Retaliatory Surge",
      description: "Reaction (spend 2 VP): when struck by an enemy within 20 feet, strike back immediately with a burst of dark fire. Deals 3d8 blight damage to the attacker and heals you for 100 points of damage dealt.",
      flavorText: "The blow lands twice. Once each direction.",
      source: "talent", class: "Warden", treeId: "vengeance_seeker",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "ranged", range: 20,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 6, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { vengeance: { baseAmount: 2 } },
      damageTypes: ["blight"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["reaction", "counter-strike", "lifesteal", "warden"]
    },
    rankUpgrades: [
      { description: "Deals 4d8 blight damage, heals for 100 points, and knocks the attacker 10 feet back.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 }, cooldownValue: 4 },
      { description: "Deals 5d8 blight damage, heals for 100 points, knocks back 15ft, and stuns the attacker for 1 round.", primaryDamage: { dice: "5d8", flat: 0, procChance: 100 }, cooldownValue: 2 }
    ]
  },
  {
    id: "wvs_t2_spectral_retribution",
    name: "Burning Grudge Aura",
    icon: "spell_fire_soulburn",
    maxRanks: 3,
    position: { x: 3, y: 1.5 },
    requires: "wvs_t1_unyielding_vengeance",
    spell: {
      name: "Burning Grudge Aura",
      description: "Whenever an enemy within 15 feet attacks you or an ally, they take 1d8 blight damage automatically in retribution.",
      flavorText: "Anger sharpens with proximity.",
      source: "talent", class: "Warden", treeId: "vengeance_seeker",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["blight"],
      primaryDamage: { dice: "1d8", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["passive", "retaliation-aura", "warden"]
    },
    rankUpgrades: [
      { description: "Retribution aura deals 2d8 blight damage and reduces attacker attack rolls by -2 for 1 round.", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 } },
      { description: "Retribution aura deals 3d8 blight damage, -3 to attack rolls, and burns attacker for 2d6 per round for 2 rounds.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } }
    ]
  },

  // ──────────────── TIER 3 (6 pts) ────────────────
  {
    id: "wvs_t3_avatar_of_vengeance",
    name: "Avatar of Vengeance",
    icon: "spell_fire_elementaldevastation",
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: "wvs_t2_retaliatory_surge",
    spell: {
      name: "Avatar of Vengeance",
      description: "Spend 4 VP: ignite into the Avatar of Vengeance for 3 rounds. Gain +3 Durability Steps to equipped durability, 4 Damage Reduction against all-damage, regenerate 2d6 health per round, and all your attacks deal +2d8 bonus blight damage.",
      flavorText: "The mounds send back what they owe.",
      source: "talent", class: "Warden", treeId: "vengeance_seeker",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 30, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { vengeance: { baseAmount: 4 } },
      durationRounds: 3, durationRealTime: 18, durationUnit: "seconds",
      buffs: ["avatar-vengeance"], visualTheme: "shadow", tags: ["transform", "avatar", "sustain", "warden"]
    },
    rankUpgrades: [
      { description: "Avatar lasts 4 rounds: +4 Durability Steps to equipped durability, 6 Damage Reduction, regenerates 3d6 health per round, and +3d8 bonus damage.", cooldownValue: 24 },
      { description: "Avatar lasts 5 rounds: +5 Durability Steps to equipped durability, 8 Damage Reduction, regenerates 4d6 health per round, and your attacks cannot be dodged or parried.", cooldownValue: 20 }
    ]
  },
  {
    id: "wvs_t3_avatar_synergy",
    name: "Nemesis Resonance",
    icon: "spell_fire_fireball02",
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: "wvs_t2_spectral_retribution",
    spell: {
      name: "Nemesis Resonance",
      description: "During Avatar of Vengeance, you generate 2 VP at the start of every turn and your critical strike chance is increased by +1d8 damage.",
      flavorText: "The engine idles hot and hungry.",
      source: "talent", class: "Warden", treeId: "vengeance_seeker",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "avatar-boost", "crit", "warden"]
    },
    rankUpgrades: [
      { description: "Generate 3 VP per turn in Avatar; critical strike chance increased by +1d8 damage and critical hits extend Avatar duration by 1 round." },
      { description: "Generate 4 VP per turn in Avatar; critical hits on 19-20, crits extend Avatar by 1 round, and you deal double critical damage." }
    ]
  },

  // ──────────────── TIER 4 (5 pts) ────────────────
  {
    id: "wvs_t4_grudge_cleave",
    name: "Grudge Cleave",
    icon: "ability_warrior_cleave",
    maxRanks: 3,
    position: { x: 1, y: 4.5 },
    requires: "wvs_t3_avatar_of_vengeance",
    spell: {
      name: "Grudge Cleave",
      description: "Spend 3 VP: unleash a sweeping cone of dark flame in a 20-foot area. Deals 4d8 blight/fire damage and sunders enemy durability by -3 for 2 rounds.",
      flavorText: "A sweeping statement made in burning steel.",
      source: "talent", class: "Warden", treeId: "vengeance_seeker",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 20, aoeShape: "cone", aoeSize: 20,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 8, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { vengeance: { baseAmount: 3 } },
      damageTypes: ["blight", "fire"],
      primaryDamage: { dice: "4d8", flat: 0, procChance: 100 },
      debuffs: ["sunder"], visualTheme: "shadow", tags: ["cone", "cleave", "sunder", "warden"]
    },
    rankUpgrades: [
      { description: "25-foot cone deals 6d8 blight/fire damage, sunders durability by -5, and burns victims for 2d8 per round.", primaryDamage: { dice: "6d8", flat: 0, procChance: 100 }, range: 25, aoeSize: 25 },
      { description: "30-foot cone deals 8d8 blight/fire damage, sunders durability by -6, and knocks all enemies prone.", primaryDamage: { dice: "8d8", flat: 0, procChance: 100 }, range: 30, aoeSize: 30 }
    ]
  },
  {
    id: "wvs_t4_spite_siphon",
    name: "Spite Siphon",
    icon: "spell_shadow_lifedrain02",
    maxRanks: 2,
    position: { x: 3.5, y: 4.5 },
    requires: "wvs_t3_avatar_synergy",
    spell: {
      name: "Spite Siphon",
      description: "Whenever you take damage that reduces you below half maximum Hit Points, instantly gain 5 VP and gain 25 temporary health for 2 rounds (cooldown: 20s).",
      flavorText: "Wounds only supply the kiln.",
      source: "talent", class: "Warden", treeId: "vengeance_seeker",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "emergency-vp", "shield", "warden"]
    },
    rankUpgrades: [
      { description: "below half maximum Hit Points: instantly gain maximum VP and 50 temporary health, and reset Retaliatory Surge cooldown (cooldown: 15s)." }
    ]
  },

  // ──────────────── TIER 5 (5 pts) ────────────────
  {
    id: "wvs_t5_eye_for_an_eye",
    name: "Eye for an Eye",
    icon: "spell_shadow_shadowwordpain",
    maxRanks: 2,
    position: { x: 1, y: 6 },
    requires: "wvs_t4_grudge_cleave",
    spell: {
      name: "Eye for an Eye",
      description: "Spend 4 VP: designate an enemy boss within 40 feet for 2 rounds. 100 points of all damage suffered by you and all allies within 20 feet is duplicated directly onto that target as pure unmitigated damage.",
      flavorText: "What you deal out to us, you receive in full.",
      source: "talent", class: "Warden", treeId: "vengeance_seeker",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "single", rangeType: "ranged", range: 40,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 30, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { vengeance: { baseAmount: 4 } },
      durationRounds: 2, durationRealTime: 12, durationUnit: "seconds",
      debuffs: ["eye-for-an-eye"], visualTheme: "shadow", tags: ["damage-reflection", "nuke", "boss-killer", "warden"]
    },
    rankUpgrades: [
      { description: "Target receives 150 points of all damage suffered by your party for 2 rounds, and cooldown drops to 24s.", cooldownValue: 24 }
    ]
  },
  {
    id: "wvs_t5_unbroken_spite",
    name: "Endless Retaliation",
    icon: "ability_warrior_shieldreflection",
    maxRanks: 3,
    position: { x: 3, y: 6 },
    requires: "wvs_t4_spite_siphon",
    spell: {
      name: "Endless Retaliation",
      description: "You can use Retaliatory Surge twice per round without penalty. Searing Retribution triggers twice as often.",
      flavorText: "There is no waiting in line for justice.",
      source: "talent", class: "Warden", treeId: "vengeance_seeker",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "reaction-cap", "warden"]
    },
    rankUpgrades: [
      { description: "Use Retaliatory Surge 3 times per round; counter-attacks deal +1d8 bonus damage." },
      { description: "Retaliatory Surge can be used UNLIMITED times per round (as long as you have VP), and each counter refunds 1 VP on kill." }
    ]
  },

  // ──────────────── TIER 6 (5 pts) ────────────────
  {
    id: "wvs_t6_cataclysmic_retribution",
    name: "Cataclysmic Retribution",
    icon: "spell_fire_selfdestruct",
    maxRanks: 1,
    position: { x: 1, y: 7.5 },
    requires: "wvs_t5_eye_for_an_eye",
    spell: {
      name: "Cataclysmic Retribution",
      description: "Spend 5 VP: detonate all stored agony in a 30-foot shockwave. Deals 6d10 blight/fire damage to all enemies, stuns all enemies for 1 round, and reflects 50 points of all damage taken during the previous round back to the attackers.",
      flavorText: "The reckoning arrives all at once.",
      source: "talent", class: "Warden", treeId: "vengeance_seeker",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 60, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { vengeance: { baseAmount: 5 } },
      damageTypes: ["blight", "fire"],
      primaryDamage: { dice: "6d10", flat: 0, procChance: 100 },
      debuffs: ["stun"], visualTheme: "shadow", tags: ["aoe", "nuke", "mass-stun", "warden"]
    },
    rankUpgrades: []
  },
  {
    id: "wvs_t6_iron_grudge",
    name: "Juggernaut Momentum",
    icon: "ability_warrior_defensivestance",
    maxRanks: 2,
    position: { x: 2.5, y: 7.5 },
    requires: "wvs_t5_unbroken_spite",
    spell: {
      name: "Juggernaut Momentum",
      description: "While in Avatar of Vengeance, you are completely immune to displacement, knockdowns, and forced movement, and you gain +4 Durability Steps to equipped durability.",
      flavorText: "An unmovable fury in iron boots.",
      source: "talent", class: "Warden", treeId: "vengeance_seeker",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "immunity", "durability", "warden"]
    },
    rankUpgrades: [
      { description: "Immunity to all CC while in Avatar; gain +6 Durability Steps to equipped durability and 6 Damage Reduction to all magic." }
    ]
  },
  {
    id: "wvs_t6_dread_nemesis",
    name: "Nemesis Mark",
    icon: "spell_shadow_curseofsargeras",
    maxRanks: 2,
    position: { x: 4, y: 7.5 },
    requires: "wvs_t5_unbroken_spite",
    spell: {
      name: "Nemesis Mark",
      description: "Whenever an enemy damages you, they receive the Nemesis Mark: you deal +1d6 bonus damage to them and ignore 50 points of their durability.",
      flavorText: "Once written in the ledger, the debt must be paid.",
      source: "talent", class: "Warden", treeId: "vengeance_seeker",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "mark", "sunder", "warden"]
    },
    rankUpgrades: [
      { description: "Deal +2d8 bonus damage to marked enemies and completely ignore 100 points of their durability and resistances." }
    ]
  },

  // ──────────────── TIER 7 / CAPSTONE (15 pts) ────────────────
  {
    id: "wvs_t7_avatar_of_the_nemesis",
    name: "Avatar of the Nemesis",
    icon: "spell_fire_elementaldevastation",
    maxRanks: 1,
    position: { x: 0.5, y: 9.5 },
    requires: "wvs_t6_cataclysmic_retribution",
    spell: {
      name: "Avatar of the Nemesis",
      description: "ULTIMATE: Spend 8 VP: ascend into the Colossal Nemesis for 1 minute: gain +6 Durability Steps to equipped durability, 10 Damage Reduction against all-damage, become immune to all crowd control, and reflect 100 points of ALL damage you suffer directly onto all enemies within 30 feet in an ongoing fiery aura.",
      flavorText: "The final incarnation of wrath. Nothing that struck it survives.",
      source: "talent", class: "Warden", treeId: "vengeance_seeker",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 180, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { vengeance: { baseAmount: 8 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      buffs: ["colossal-nemesis"], visualTheme: "shadow", tags: ["ultimate", "capstone", "god-mode", "warden"]
    },
    rankUpgrades: []
  },
  {
    id: "wvs_t7_nemesis_doctrine",
    name: "Nemesis Doctrine",
    icon: "spell_fire_soulburn",
    maxRanks: 5,
    position: { x: 1.5, y: 9.5 },
    requires: "wvs_t6_cataclysmic_retribution",
    spell: {
      name: "Nemesis Doctrine",
      description: "Every scar is a weapon. All blight, fire, and retaliation damage you deal is increased by +1d6 damage.",
      flavorText: "The flame burns brightest where the wood was deepest scarred.",
      source: "talent", class: "Warden", treeId: "vengeance_seeker",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["blight", "fire"],
      visualTheme: "shadow", tags: ["passive", "capstone", "damage", "warden"]
    },
    rankUpgrades: [
      { description: "All blight, fire, and retaliation damage increased by +1d8 damage." },
      { description: "All blight, fire, and retaliation damage increased by +1d8 damage." },
      { description: "All blight, fire, and retaliation damage increased by +2d8 damage." },
      { description: "All blight, fire, and retaliation damage increased by +2d8 damage, and Vengeful Lash costs 0 mana." }
    ]
  },
  {
    id: "wvs_t7_infinite_vp",
    name: "Bottomless Grudge",
    icon: "spell_fire_elemental_totem",
    maxRanks: 3,
    position: { x: 2.5, y: 9.5 },
    requires: "wvs_t6_iron_grudge",
    spell: {
      name: "Bottomless Grudge",
      description: "Your maximum VP increases by 6. In combat, you generate 2 VP at the start of every round.",
      flavorText: "A reservoir that fills itself.",
      source: "talent", class: "Warden", treeId: "vengeance_seeker",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "capstone", "vp-engine", "warden"]
    },
    rankUpgrades: [
      { description: "Maximum VP +10; generate 3 VP per round and your movement speed increases by +15ft." },
      { description: "Maximum VP +15; generate 4 VP per round and VP abilities cost 1 fewer VP (minimum 1)." }
    ]
  },
  {
    id: "wvs_t7_burning_spite",
    name: "Infernal Retribution",
    icon: "spell_fire_flameblades",
    maxRanks: 3,
    position: { x: 3.5, y: 9.5 },
    requires: "wvs_t6_dread_nemesis",
    spell: {
      name: "Infernal Retribution",
      description: "All retaliation damage you deal scores critical hits on 18+ and critical retaliation hits restore 10 points maximum health.",
      flavorText: "The counter-blow strikes straight through the heart.",
      source: "talent", class: "Warden", treeId: "vengeance_seeker",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "capstone", "crit-counter", "warden"]
    },
    rankUpgrades: [
      { description: "Retaliation crits on 17+; heals for 15 points max health and deals +50 points critical bonus damage." },
      { description: "Retaliation crits on 16+; heals for 20 points max health, deals double crit damage, and knocks the target prone." }
    ]
  },
  {
    id: "wvs_t7_immortal_grudge",
    name: "Immortal Vengeance",
    icon: "ability_warrior_bloodfrenzy",
    maxRanks: 3,
    position: { x: 4.5, y: 9.5 },
    requires: "wvs_t6_dread_nemesis",
    spell: {
      name: "Immortal Vengeance",
      description: "While you maintain at least 4 VP, lethal damage reduces you to 1 health instead, fully charges your VP, and immediately activates Avatar of Vengeance for free (cooldown: 120s).",
      flavorText: "Death itself cannot collect until the vengeance is paid.",
      source: "talent", class: "Warden", treeId: "vengeance_seeker",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "capstone", "cheat-death", "warden"]
    },
    rankUpgrades: [
      { description: "Survive lethal damage, gain full VP, enter Avatar of Vengeance, and heal for 50 points health (cooldown: 90s)." },
      { description: "Survive lethal damage, gain full VP, enter Colossal Nemesis for free, and immediately trigger Cataclysmic Retribution for free (cooldown: 60s)." }
    ]
  }
];
