// ============================================
// BERSERKER — BLOOD FRENZY (v3: spec identity redesign)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50.
//
// SPEC IDENTITY: The Wound Engine / Self-Sustaining Glass Cannon.
// You weaponize your own blood and injuries. While Primal Rage builds toward
// peak rage states and Savage Instincts coordinates the pack, Blood Frenzy operates
// in the danger zone: sacrificing HP for massive surges of Blood-Heat, leeching
// vitality back through devastating blood attacks, and hitting harder the lower your HP drops.
//
// SIGNATURE ACTIVES:
//   - Vein Tap (t1):                 Sacrifice HP for immediate Blood-Heat
//   - Blood Rage (t1):               Reduce incoming damage and convert to heat
//   - Crimson Wave (t3):             AoE life siphon burst
//   - Hemorrhagic Link (t3):         Bind enemy to share your damage suffered
//   - Sanguine Eruption (t4):        Violent gore detonation converting damage to temp health
//   - Blood Harvest Rite (t6):       Massive burst of Blood-Heat at cost of health
//   - Blood God Ascended (t7):       ULTIMATE — Avatar of blood and vampiric devastation
// ============================================

export const BERSERKER_BLOOD_FRENZY = [
  // ──────────────── TIER 1 (8 pts) ────────────────
  {
    id: "bf_t1_blood_magic",
    name: "Vein Tap",
    icon: "spell_shadow_soulleech",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Vein Tap",
      description: "Sacrifice 5 health: instantly generate 15 Blood-Heat and your next attack deals +1d6 blight damage.",
      flavorText: "The earth drinks. The veins provide.",
      source: "talent", class: "Berserker", treeId: "blood_frenzy",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 6, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { health: { baseAmount: 5, costType: "flat" } },
      damageTypes: ["blight"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "blight", tags: ["resource", "self-damage", "berserker"]
    },
    rankUpgrades: [
      { description: "Sacrifice 5 health: generate 20 Blood-Heat, and your next attack deals +1d8 blight damage.", primaryDamage: { dice: "1d8", flat: 0, procChance: 100 } },
      { description: "Sacrifice 5 health: generate 25 Blood-Heat, your next attack deals +1d10 blight damage and restores 5 health on hit.", primaryDamage: { dice: "1d10", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "bf_t1_blood_rage",
    name: "Blood Rage",
    icon: "spell_shadow_bloodboil",
    maxRanks: 3,
    position: { x: 2.5, y: 0 },
    requires: null,
    spell: {
      name: "Blood Rage",
      description: "When you would take damage, roll 1d6: you reduce the damage by that amount and convert the absorbed damage into bonus Blood-Heat.",
      flavorText: "Bleed less. Burn more.",
      source: "talent", class: "Berserker", treeId: "blood_frenzy",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 8, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { bloodHeat: { baseAmount: 0 } },
      buffs: ["blood-rage"], visualTheme: "blight", tags: ["defense", "conversion", "berserker"]
    },
    rankUpgrades: [
      { description: "Roll 1d8: reduce damage taken and gain equal Blood-Heat. Cooldown reduced to 6s.", cooldownValue: 6 },
      { description: "Roll 1d12: reduce damage taken, gain equal Blood-Heat, and your next attack within 1 round heals you for the rolled amount." }
    ]
  },
  {
    id: "bf_t1_wound_power",
    name: "Wound Power",
    icon: "spell_shadow_lifedrain",
    maxRanks: 2,
    position: { x: 4, y: 0 },
    requires: null,
    spell: {
      name: "Wound Power",
      description: "Each scar earned makes the frost-rage bite deeper. For each 25% of your health that is missing, you gain +1 to attack rolls and +1d4 blight damage on all weapon attacks.",
      flavorText: "The ledger of scars, balanced in violence.",
      source: "talent", class: "Berserker", treeId: "blood_frenzy",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["blight"],
      visualTheme: "blight", tags: ["passive", "wound", "berserker"]
    },
    rankUpgrades: [
      { description: "For each 25% of missing health, gain +1 to attack rolls and +1d6 blight damage. Below 50% health, your critical strikes heal you for 1d6 health." }
    ]
  },

  // ──────────────── TIER 2 (6 pts) ────────────────
  {
    id: "bf_t2_bloody_retaliation",
    name: "Bloody Retaliation",
    icon: "ability_warrior_bloodbath",
    maxRanks: 3,
    position: { x: 1, y: 1.5 },
    requires: "bf_t1_blood_magic",
    spell: {
      name: "Bloody Retaliation",
      description: "When you take damage from an enemy within 10 feet, lash out with a spray of boiling blood: deal 1d6 blight damage to the attacker and gain 5 Blood-Heat.",
      flavorText: "Every wound is a return address.",
      source: "talent", class: "Berserker", treeId: "blood_frenzy",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["blight"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "blight", tags: ["passive", "retaliation", "berserker"]
    },
    rankUpgrades: [
      { description: "When damaged in melee, spray boiling blood for 1d8 blight damage and 10 Blood-Heat.", primaryDamage: { dice: "1d8", flat: 0, procChance: 100 } },
      { description: "When damaged in melee, spray boiling blood for 1d10 blight damage, 10 Blood-Heat, and inflict Bleed (1d4 per round for 2 rounds).", primaryDamage: { dice: "1d10", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "bf_t2_pain_threshold",
    name: "Pain Threshold",
    icon: "spell_shadow_shadowwordpain",
    maxRanks: 3,
    position: { x: 3, y: 1.5 },
    requires: "bf_t1_blood_rage",
    spell: {
      name: "Pain Threshold",
      description: "Numbness born of northern frost shields you from agony. While below 50% health, you gain +2 Durability Steps to equipped durability and advantage on saving throws against physical and mental effects.",
      flavorText: "Half-dead is a kind of invulnerable.",
      source: "talent", class: "Berserker", treeId: "blood_frenzy",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "rime", tags: ["passive", "defense", "wound", "berserker"]
    },
    rankUpgrades: [
      { description: "While below 50% health, gain +3 Durability Steps to equipped durability, advantage on saving throws, and 10% resistance to all damage." },
      { description: "While below 50% health, gain +4 Durability Steps to equipped durability, advantage on saves, 15% all-damage resistance, and immunity to stun and fear." }
    ]
  },

  // ──────────────── TIER 3 (6 pts) ────────────────
  {
    id: "bf_t3_crimson_wave",
    name: "Crimson Wave",
    icon: "ability_warrior_bloodnova",
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: "bf_t2_bloody_retaliation",
    spell: {
      name: "Crimson Wave",
      description: "Spend 25 Blood-Heat: unleash a 15-foot nova of siphon blood. Deals 2d8 blight damage to all enemies in range and heals you for 30% of the total damage dealt.",
      flavorText: "The tide takes and the tide gives.",
      source: "talent", class: "Berserker", treeId: "blood_frenzy",
      spellType: "ACTIVE", category: "healing",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 15,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 14, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { bloodHeat: { baseAmount: 25 } },
      damageTypes: ["blight"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      visualTheme: "blight", tags: ["healing", "aoe", "damage", "berserker"]
    },
    rankUpgrades: [
      { description: "Spend 25 Blood-Heat: 15-foot nova deals 3d8 blight damage and heals you for 30% of total damage. Cooldown drops to 12s.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 }, cooldownValue: 12 },
      { description: "Spend 25 Blood-Heat: 20-foot nova deals 4d8 blight damage, heals for 30% of total damage, and enemies hit are slowed for 1 round.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 }, aoeSize: 20 }
    ]
  },
  {
    id: "bf_t3_hemorrhagic_link",
    name: "Hemorrhagic Link",
    icon: "spell_shadow_bloodboil",
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: "bf_t2_pain_threshold",
    spell: {
      name: "Hemorrhagic Link",
      description: "Bind your vital thread to an enemy within 30 feet for 1 minute: whenever you take damage, the linked enemy takes 25% of that damage as blight damage.",
      flavorText: "One wound, two owners. You keep the better half.",
      source: "talent", class: "Berserker", treeId: "blood_frenzy",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "single", rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 20, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { bloodHeat: { baseAmount: 20 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      debuffs: ["hemorrhagic-link"], damageTypes: ["blight"],
      visualTheme: "blight", tags: ["link", "damage-share", "berserker"]
    },
    rankUpgrades: [
      { description: "Linked enemy takes 25% of damage you suffer, and whenever you deal damage to them you heal for 1d6 health." },
      { description: "Linked enemy takes 25% of damage you suffer. If the linked enemy dies while bound, you instantly heal 4d8 health and gain 30 Blood-Heat." }
    ]
  },

  // ──────────────── TIER 4 (5 pts) ────────────────
  {
    id: "bf_t4_sanguine_eruption",
    name: "Sanguine Eruption",
    icon: "spell_fire_selfdestruct",
    maxRanks: 3,
    position: { x: 1, y: 4.5 },
    requires: "bf_t3_crimson_wave",
    spell: {
      name: "Sanguine Eruption",
      description: "Sacrifice 15 health and spend 40 Blood-Heat: the ground beneath your target erupts in gore. Deals 4d8 blight damage to the target and 2d8 to all adjacent enemies, granting you 20 temporary health.",
      flavorText: "Geology, but personal.",
      source: "talent", class: "Berserker", treeId: "blood_frenzy",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "melee", range: 5,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 18, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { health: { baseAmount: 15, costType: "flat" }, bloodHeat: { baseAmount: 40 } },
      damageTypes: ["blight"],
      primaryDamage: { dice: "4d8", flat: 0, procChance: 100 },
      visualTheme: "blight", tags: ["burst", "aoe", "damage", "berserker"]
    },
    rankUpgrades: [
      { description: "Sacrifice 15 health & 40 Blood-Heat: deals 5d8 blight to primary, 3d8 to adjacent, and grants 30 temporary health.", primaryDamage: { dice: "5d8", flat: 0, procChance: 100 } },
      { description: "Sacrifice 15 health & 40 Blood-Heat: deals 6d8 blight to primary, 4d8 to adjacent, grants 40 temporary health, and knocks adjacent targets prone.", primaryDamage: { dice: "6d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "bf_t4_adrenaline_rush",
    name: "Adrenaline Surge",
    icon: "ability_rogue_sprint",
    maxRanks: 2,
    position: { x: 3.5, y: 4.5 },
    requires: "bf_t3_hemorrhagic_link",
    spell: {
      name: "Adrenaline Surge",
      description: "When your health drops below 30%, instantly break all immobilization and slow effects, gain +15ft movement speed, and your next ability costs no Blood-Heat (cooldown: 45s).",
      flavorText: "The body's last argument is speed.",
      source: "talent", class: "Berserker", treeId: "blood_frenzy",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "desperation", "mobility", "berserker"]
    },
    rankUpgrades: [
      { description: "Below 30% health: break all CC, gain +20ft speed, and your next TWO abilities cost no Blood-Heat and deal maximum damage (cooldown: 30s)." }
    ]
  },

  // ──────────────── TIER 5 (5 pts) ────────────────
  {
    id: "bf_t5_life_steal",
    name: "Sanguine Feast",
    icon: "spell_shadow_lifedrain02",
    maxRanks: 3,
    position: { x: 1, y: 6 },
    requires: "bf_t4_sanguine_eruption",
    spell: {
      name: "Sanguine Feast",
      description: "Your melee attacks drain life essence. While below 50% health, weapon strikes heal you for 1d8 health. While below 25% health, they heal for 2d8 health.",
      flavorText: "The tundra owes you. Collect on every swing.",
      source: "talent", class: "Berserker", treeId: "blood_frenzy",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "self",
      healing: { dice: "1d8", flat: 0 },
      visualTheme: "blight", tags: ["passive", "lifesteal", "berserker"]
    },
    rankUpgrades: [
      { description: "Weapon strikes heal for 1d10 (below 50% HP) or 2d10 (below 25% HP). Critical strikes double this healing.", healing: { dice: "1d10", flat: 0 } },
      { description: "Weapon strikes heal for 1d12 (below 50% HP) or 3d8 (below 25% HP). Excess healing is converted into temporary health up to 25." }
    ]
  },
  {
    id: "bf_t5_berserk_healing",
    name: "Clotted Fortitude",
    icon: "spell_holy_blessedrecovery",
    maxRanks: 2,
    position: { x: 3, y: 6 },
    requires: "bf_t4_adrenaline_rush",
    spell: {
      name: "Clotted Fortitude",
      description: "Your blood thickens to seal mortal injuries. While in Frenzied or higher Rage State, regenerate 1d8 health each round. This healing functions even through outside heal-prevention effects.",
      flavorText: "You cannot be healed by others. You never needed them to.",
      source: "talent", class: "Berserker", treeId: "blood_frenzy",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "self",
      healing: { dice: "1d8", flat: 0 },
      visualTheme: "rime", tags: ["passive", "regeneration", "berserker"]
    },
    rankUpgrades: [
      { description: "Regenerate 2d8 health each round while Frenzied or higher. When reduced below 20% health, instantly burst-heal 3d8 health (once per combat)." }
    ]
  },

  // ──────────────── TIER 6 (5 pts) ────────────────
  {
    id: "bf_t6_deathless_fury",
    name: "Deathless Fury",
    icon: "spell_shadow_deathscream",
    maxRanks: 1,
    position: { x: 1, y: 7.5 },
    requires: "bf_t5_life_steal",
    spell: {
      name: "Deathless Fury",
      description: "When you would suffer lethal damage, you cannot be reduced below 1 health for 1 full round. All damage taken during this round generates triple Blood-Heat.",
      flavorText: "She came for you once. She left embarrassed.",
      source: "talent", class: "Berserker", treeId: "blood_frenzy",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "blight", tags: ["survival", "cheat-death", "berserker"]
    },
    rankUpgrades: []
  },
  {
    id: "bf_t6_blood_ritual",
    name: "Blood Harvest Rite",
    icon: "spell_shadow_soulleech",
    maxRanks: 2,
    position: { x: 2.5, y: 7.5 },
    requires: "bf_t5_berserk_healing",
    spell: {
      name: "Blood Harvest Rite",
      description: "Sacrifice 20 health: instantly max your Blood-Heat to 100, entering Carnage state immediately. Your next ability within 1 round is guaranteed to critically hit.",
      flavorText: "The oldest currency. Always accepted.",
      source: "talent", class: "Berserker", treeId: "blood_frenzy",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 30, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { health: { baseAmount: 20, costType: "flat" } },
      visualTheme: "blight", tags: ["resource", "self-damage", "crit", "berserker"]
    },
    rankUpgrades: [
      { description: "Sacrifice 15 health: max Blood-Heat to 100. Your next TWO abilities critically hit, and Blood Harvest Rite cooldown drops to 20s.", cooldownValue: 20, resourceCosts: { health: { baseAmount: 15, costType: "flat" } } }
    ]
  },
  {
    id: "bf_t6_blood_fury",
    name: "Crimson Boiling",
    icon: "spell_shadow_bloodboil",
    maxRanks: 2,
    position: { x: 4, y: 7.5 },
    requires: "bf_t5_berserk_healing",
    spell: {
      name: "Crimson Boiling",
      description: "While below 35% health, all your blood spells (Crimson Wave, Sanguine Eruption, Blood Harvest) have their cooldowns reduced by 30%.",
      flavorText: "Closest to the end. Closest to the fire.",
      source: "talent", class: "Berserker", treeId: "blood_frenzy",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "blight", tags: ["passive", "cooldown", "berserker"]
    },
    rankUpgrades: [
      { description: "While below 35% health, blood ability cooldowns reduced by 50% and their health costs are halved." }
    ]
  },

  // ──────────────── TIER 7 / CAPSTONE (15 pts) ────────────────
  {
    id: "bf_t7_blood_god_ascended",
    name: "Blood God Ascended",
    icon: "spell_shadow_bloodboil",
    maxRanks: 1,
    position: { x: 0.5, y: 8 },
    requires: "bf_t6_deathless_fury",
    spell: {
      name: "Blood God Ascended",
      description: "ULTIMATE: Spend 80 Blood-Heat to transform into an Avatar of Blood for 1 minute: your attacks deal bonus blight damage equal to 50% of your missing health, and you heal for 40% of all damage you deal across all sources.",
      flavorText: "The tribute is paid. The throne is wet.",
      source: "talent", class: "Berserker", treeId: "blood_frenzy",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 180, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { bloodHeat: { baseAmount: 80 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      buffs: ["blood-god"], damageTypes: ["blight"],
      visualTheme: "blight", tags: ["ultimate", "capstone", "transform", "berserker"]
    },
    rankUpgrades: []
  },
  {
    id: "bf_t7_blood_god",
    name: "Gore Siphon Doctrine",
    icon: "spell_shadow_shadowward",
    maxRanks: 5,
    position: { x: 1.5, y: 8 },
    requires: "bf_t6_blood_ritual",
    spell: {
      name: "Gore Siphon Doctrine",
      description: "Your wound mastery deepens. All healing you receive from Life Steal, Crimson Wave, and self-siphon is increased by 10%.",
      flavorText: "Worship, by any other name.",
      source: "talent", class: "Berserker", treeId: "blood_frenzy",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "self", visualTheme: "blight", tags: ["passive", "capstone", "healing-boost", "berserker"]
    },
    rankUpgrades: [
      { description: "All self-siphon and lifesteal healing increased by 20%." },
      { description: "All self-siphon and lifesteal healing increased by 35%." },
      { description: "All self-siphon and lifesteal healing increased by 50%." },
      { description: "All self-siphon and lifesteal healing increased by 70%, and Crimson Wave costs 0 Blood-Heat while below 25% health." }
    ]
  },
  {
    id: "bf_t7_vampiric_echo",
    name: "Sanguine Transfusion",
    icon: "spell_shadow_lifedrain02",
    maxRanks: 3,
    position: { x: 2.5, y: 8 },
    requires: "bf_t6_blood_ritual",
    spell: {
      name: "Sanguine Transfusion",
      description: "When you heal yourself through lifesteal or blood abilities, the most wounded ally within 30 feet is also healed for 25% of that amount.",
      flavorText: "Generosity, extracted from enemies.",
      source: "talent", class: "Berserker", treeId: "blood_frenzy",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "self", visualTheme: "blight", tags: ["passive", "capstone", "lifesteal", "ally", "berserker"]
    },
    rankUpgrades: [
      { description: "Most wounded ally within 30 feet is healed for 50% of your self-healing." },
      { description: "ALL allies within 30 feet are healed for 50% of your self-healing. Blood Frenzy turns you into a potent frontline leech engine." }
    ]
  },
  {
    id: "bf_t7_eternal_frenzy",
    name: "Eternal Frenzy",
    icon: "spell_shadow_unholyfrenzy",
    maxRanks: 3,
    position: { x: 3.5, y: 8 },
    requires: "bf_t6_blood_fury",
    spell: {
      name: "Eternal Frenzy",
      description: "When reduced below 20% health, you instantly gain 50 Blood-Heat and your attacks deal +2d8 bonus blight damage for 2 rounds.",
      flavorText: "Dead is a state of mind. Decline it.",
      source: "talent", class: "Berserker", treeId: "blood_frenzy",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["blight"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      visualTheme: "blight", tags: ["passive", "capstone", "survival", "berserker"]
    },
    rankUpgrades: [
      { description: "Below 20% health: instantly gain 75 Blood-Heat and +3d8 blight damage for 2 rounds.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } },
      { description: "Below 20% health: instantly gain 100 Blood-Heat (instant Obliteration), +4d8 blight damage for 3 rounds, and your next 2 attacks cost no action points.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "bf_t7_scar_bargain",
    name: "Scar Bargain",
    icon: "spell_shadow_soulleech",
    maxRanks: 3,
    position: { x: 4.5, y: 8 },
    requires: "bf_t6_blood_fury",
    spell: {
      name: "Scar Bargain",
      description: "Whenever you willingly sacrifice health (via Vein Tap, Sanguine Eruption, Blood Harvest), you gain a stacking shield absorbing damage equal to the health sacrificed.",
      flavorText: "The moon has seen you bleed so often it gives regulars a rate.",
      source: "talent", class: "Berserker", treeId: "blood_frenzy",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "blight", tags: ["passive", "capstone", "shield", "berserker"]
    },
    rankUpgrades: [
      { description: "Sacrificing health grants a shield absorbing 150% of the health spent." },
      { description: "Sacrificing health grants a shield absorbing 200% of the health spent. When the shield expires or breaks, it detonates for equal blight damage to nearby enemies." }
    ]
  }
];
