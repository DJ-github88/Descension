// ============================================
// WARDEN — MONOLITH (v4: Balanced & Normalized)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy mirrors sibling trees: 19 nodes across 7 tiers, CAPSTONE at tier 7.
//
// SPEC IDENTITY: The Gravitational Anchor / Calcified Juggernaut.
// While Vengeance Seeker converts pain into retribution and Shadowblade hunts from
// stealth, the Monolith becomes an unbreakable battlefield fixture: Vengeance Points
// calcify into layered iron armor, tethered prey cannot move it, and chokepoints
// belong to it alone. Immovable by choice, catastrophic to approach.
//
// CANON TIES (wardenData.js): Ossified Anchor passive, Calcified Armor economy
// (+10 DR max, decays 2/turn, blight dissolves, no Dodge while calcified),
// gravitational anchoring vs forced movement, 75% AoE interception for tethered
// targets, -15 ft permanent movement speed.
// ============================================

export const WARDEN_MONOLITH = [
  // ──────────────── TIER 1 (Row 0) ────────────────
  {
    id: "wm_t1_ossified_anchor",
    name: "Ossified Anchor",
    icon: "ability_warrior_shieldmastery",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Ossified Anchor",
      description: "Passive: Whenever you spend Vengeance Points (VP), convert the spent amount into temporary Calcified Armor at a 1:1 ratio (max +5 Damage Reduction). Calcified Armor decays by 2 at the start of each of your turns. While you have any Calcified Armor, you cannot benefit from Dodge.",
      flavorText: "Pain is just ore that hasn't set yet.",
      source: "talent", class: "Warden", treeId: "monolith",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "iron", tags: ["passive", "dr", "vp-spend", "calcified-armor", "warden"]
    },
    rankUpgrades: [
      { description: "Calcified Armor cap increases to +8 Damage Reduction." },
      { description: "Calcified Armor cap increases to +10 Damage Reduction and decay slows to 1 per turn while a tethered enemy is within 30 feet." }
    ]
  },
  {
    id: "wm_t1_deep_roots",
    name: "Deep Roots",
    icon: "ability_warrior_defensivestance",
    maxRanks: 2,
    position: { x: 2, y: 0 },
    requires: null,
    spell: {
      name: "Deep Roots",
      description: "Passive: You cannot be pulled or dragged against your will. You gain advantage on saves against forced movement effects.",
      flavorText: "The mountain does not negotiate.",
      source: "talent", class: "Warden", treeId: "monolith",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "iron", tags: ["passive", "control-immunity", "anchor", "warden"]
    },
    rankUpgrades: [
      { description: "You are also immune to being knocked Prone while standing on stone, dirt, or metal surfaces." }
    ]
  },
  {
    id: "wm_t1_weight_of_iron",
    name: "Chain Weight",
    icon: "ability_warrior_battleshout",
    maxRanks: 3,
    position: { x: 3, y: 0 },
    requires: null,
    spell: {
      name: "Chain Weight",
      description: "Spend 1 AP: Swing your grafted chain mass in a crushing overhead blow within 15 feet: 1d8+STR smashing damage and the target's movement speed is reduced by 15 feet until the end of its next turn. Gain 1 Vengeance Point on hit.",
      flavorText: "Some chains are worn. This one is thrown.",
      source: "talent", class: "Warden", treeId: "monolith",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 1,
      targetingMode: "single", rangeType: "melee", range: 15,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 0, cooldownUnit: "round",
      resourceCosts: {},
      damageTypes: ["smashing"],
      primaryDamage: { dice: "1d8", flat: 0, procChance: 100 },
      visualTheme: "iron", tags: ["melee", "smashing", "slow", "vp-builder", "warden"]
    },
    rankUpgrades: [
      { description: "Deals 1d10+STR smashing damage.", primaryDamage: { dice: "1d10", flat: 0, procChance: 100 } },
      { description: "Deals 2d6+STR smashing damage and the slow lasts 2 rounds.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } }
    ]
  },

  // ──────────────── TIER 2 (Row 1) ────────────────
  {
    id: "wm_t2_iron_brace",
    name: "Iron Brace",
    icon: "ability_warrior_shieldwall",
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: "wm_t1_ossified_anchor",
    spell: {
      name: "Iron Brace",
      description: "REACTION — When targeted by an attack, brace your grafted chains: gain +2 DR against the triggering attack. Whether it hits or misses, gain 1 Vengeance Point.",
      flavorText: "Brace. Breathe. Bank.",
      source: "talent", class: "Warden", treeId: "monolith",
      spellType: "REACTION", category: "defense",
      actionPoints: 0,
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "reaction", castTimeValue: 1,
      cooldownCategory: "short", cooldownValue: 1, cooldownUnit: "round",
      resourceCosts: {},
      visualTheme: "iron", tags: ["reaction", "defense", "dr", "vp-gain", "warden"]
    },
    rankUpgrades: [
      { description: "DR bonus increases to +3." },
      { description: "DR bonus increases to +4 and gain 2 Vengeance Points instead of 1." }
    ]
  },
  {
    id: "wm_t2_sweeping_chains",
    name: "Sweeping Chains",
    icon: "ability_warrior_cleave",
    maxRanks: 3,
    position: { x: 2, y: 1 },
    requires: "wm_t1_weight_of_iron",
    spell: {
      name: "Sweeping Chains",
      description: "Spend 2 AP: Whirl your heavy chains in a 15-foot cone. Each creature caught takes 2d6 smashing damage and suffers Entangled Slow (-15 ft movement) for 1 round on a failed Reflex save. You may spend up to 3 VP to add +1d6 damage per VP spent.",
      flavorText: "A hailstorm of rust and regret.",
      source: "talent", class: "Warden", treeId: "monolith",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 2,
      targetingMode: "cone", rangeType: "cone", range: 15,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 2, cooldownUnit: "round",
      saveType: "reflex",
      damageTypes: ["smashing"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      visualTheme: "iron", tags: ["aoe", "cone", "smashing", "slow", "vp-dump", "warden"]
    },
    rankUpgrades: [
      { description: "Deals 3d6 smashing damage; failed saves also drop shields/stances of braced enemies.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } },
      { description: "Deals 4d6 smashing damage; VP bonuses cap at 5 instead of 3.", primaryDamage: { dice: "4d6", flat: 0, procChance: 100 } }
    ]
  },

  // ──────────────── TIER 3 (Row 2) ────────────────
  {
    id: "wm_t3_gravitational_lock",
    name: "Gravitational Lock",
    icon: "spell_shadow_shadowward",
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: "wm_t2_iron_brace",
    spell: {
      name: "Gravitational Lock",
      description: "Passive: Your mass becomes law. You absorb 60% of all area damage directed at enemies tethered to you (instead of the standard 50%), and tethered targets can never force you to move toward them.",
      flavorText: "They strain against the leash. The leash strains against you. You do not notice.",
      source: "talent", class: "Warden", treeId: "monolith",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "iron", tags: ["passive", "interception", "tank", "tether", "warden"]
    },
    rankUpgrades: [
      { description: "Interception increases to 75% of area damage dealt to tethered enemies." },
      { description: "Interception increases to 85%; intercepted area damage triggers your Ossified Anchor as if you had spent 1 VP (once per round)." }
    ]
  },
  {
    id: "wm_t3_penitent_resolve",
    name: "Penitent Resolve",
    icon: "spell_holy_sealofwrath",
    maxRanks: 2,
    position: { x: 2, y: 2 },
    requires: "wm_t2_sweeping_chains",
    spell: {
      name: "Penitent Resolve",
      description: "Spend 1 AP, 2 VP: Dig the grafted spine hooks deeper, welcoming the pain. For 1 round you gain 50% damage resistance and +4 DR. These benefits are doubled (+8 DR / 50% resisted again on top) if your tethered target is within 15 feet of you.",
      flavorText: "Every hook placed was a promise. Today he collects interest.",
      source: "talent", class: "Warden", treeId: "monolith",
      spellType: "ACTIVE", category: "buff",
      actionPoints: 1,
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 3, cooldownUnit: "round",
      resourceCosts: { vengeance_points: { baseAmount: 2 } },
      durationConfig: { durationType: "rounds", durationValue: 1, durationUnit: "round" },
      visualTheme: "iron", tags: ["stance", "defense", "vp-cost", "penitent", "warden"]
    },
    rankUpgrades: [
      { description: "Duration increases to 2 rounds." }
    ]
  },

  // ──────────────── TIER 4 (Row 3) ────────────────
  {
    id: "wm_t4_cruel_drag",
    name: "Cruel Drag",
    icon: "spell_shadow_deathcoil",
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: "wm_t3_gravitational_lock",
    spell: {
      name: "Cruel Drag",
      description: "Spend 2 AP, 3 VP: Manually lock your gears and reel in. Dash directly to an enemy tethered to you (any distance up to 60 ft), slamming into them with a colossal body-check for 2d8 smashing damage and knocking them Prone on a failed Fortitude save. If they are lighter than you, they are instead dragged 10 feet back toward your original position.",
      flavorText: "Distance is a rumor he doesn't spread.",
      source: "talent", class: "Warden", treeId: "monolith",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 2,
      targetingMode: "single", rangeType: "ranged", range: 60, targetRestrictions: ["tethered-enemy"],
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 3, cooldownUnit: "round",
      resourceCosts: { vengeance_points: { baseAmount: 3 } },
      saveType: "fortitude",
      damageTypes: ["smashing"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      visualTheme: "iron", tags: ["mobility", "gap-closer", "prone", "vp-cost", "tether", "warden"]
    },
    rankUpgrades: [
      { description: "Deals 3d8 smashing damage; the slam also staggers (loses 1 AP next turn).", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } },
      { description: "Drag distance increases to 15 feet and you gain 2 Vengeance Points when this ability hits." }
    ]
  },
  {
    id: "wm_t4_enduring_bulwark",
    name: "Enduring Bulwark",
    icon: "ability_warrior_intensifyrage",
    maxRanks: 2,
    position: { x: 2, y: 3 },
    requires: "wm_t3_penitent_resolve",
    spell: {
      name: "Enduring Bulwark",
      description: "Spend 1 AP: Plant yourself completely (you cannot move this turn). Gain 50% damage resistance and +4 DR against all incoming smashing damage until the start of your next turn.",
      flavorText: "A wall that chose to be one.",
      source: "talent", class: "Warden", treeId: "monolith",
      spellType: "ACTIVE", category: "defense",
      actionPoints: 1,
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 1, cooldownUnit: "round",
      durationConfig: { durationType: "rounds", durationValue: 1, durationUnit: "round" },
      visualTheme: "iron", tags: ["defense", "resistance", "smashing", "plant", "warden"]
    },
    rankUpgrades: [
      { description: "The +4 DR extends to all physical damage types, not only smashing." }
    ]
  },

  // ──────────────── TIER 5 (Row 4) ────────────────
  {
    id: "wm_t5_entangling_field",
    name: "Entangling Field",
    icon: "spell_shadow_darkbind",
    maxRanks: 3,
    position: { x: 1, y: 4 },
    requires: "wm_t4_enduring_bulwark",
    spell: {
      name: "Entangling Field",
      description: "Passive: Slack chains drift from your grafts, alive with habit. Enemies adjacent to you have their movement reduced by 10 feet while you have any Calcified Armor.",
      flavorText: "The chains miss being around wrists. They reach.",
      source: "talent", class: "Warden", treeId: "monolith",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", rangeType: "self", auraRadius: 5,
      visualTheme: "iron", tags: ["passive", "aura", "slow", "warden"]
    },
    rankUpgrades: [
      { description: "Slow increases to 15 feet and affected enemies suffer -1 to hit you." },
      { description: "Affected enemies cannot Disengage or take the Retreat maneuver away from your square." }
    ]
  },
  {
    id: "wm_t5_iron_gaol",
    name: "Iron Gaol",
    icon: "spell_shadow_shackleundead",
    maxRanks: 3,
    position: { x: 2, y: 4 },
    requires: "wm_t4_cruel_drag",
    spell: {
      name: "Iron Gaol",
      description: "Spend 3 AP, 6 VP: Erupt spectral iron bars around a creature within 30 feet, trapping it in a brutal cage for 2 rounds. Caged creatures physically cannot leave the cage by any means of movement and cannot teleport. A caged creature takes +1d6 bonus damage from all your attacks while confined.",
      flavorText: "He builds his prisons into the ground so they last.",
      source: "talent", class: "Warden", treeId: "monolith",
      spellType: "ACTIVE", category: "control",
      actionPoints: 3,
      targetingMode: "single", rangeType: "ranged", range: 30, targetRestrictions: ["enemy"],
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 5, cooldownUnit: "round",
      resourceCosts: { vengeance_points: { baseAmount: 6 } },
      durationConfig: { durationType: "rounds", durationValue: 2, durationUnit: "round" },
      saveType: "spirit",
      visualTheme: "iron", tags: ["control", "cage", "teleport-block", "vp-cost", "signature", "warden"]
    },
    rankUpgrades: [
      { description: "Cage duration increases to 3 rounds." },
      { description: "Bonus damage against caged creatures increases to +2d6 and caged creatures cannot take reactions." }
    ]
  },

  // ──────────────── TIER 6 (Row 5) ────────────────
  {
    id: "wm_t6_unbreakable_mass",
    name: "Unbreakable Mass",
    icon: "spell_fire_elemental_totem",
    maxRanks: 3,
    position: { x: 1, y: 5 },
    requires: "wm_t5_entangling_field",
    spell: {
      name: "Unbreakable Mass",
      description: "Passive: While you have 5 or more points of active Calcified Armor, you are immune to being Prone or pushed, and count as one size larger for grapple, shove, and carry-capacity purposes.",
      flavorText: "Part of him has simply stopped being negotiable anatomy.",
      source: "talent", class: "Warden", treeId: "monolith",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "iron", tags: ["passive", "immunity", "calcified-armor", "size", "warden"]
    },
    rankUpgrades: [
      { description: "Threshold drops to 3 points of Calcified Armor; you additionally count as one size larger for blocking corridors." },
      { description: "Whenever you would lose Calcified Armor to decay while above the threshold, gain 1 Vengeance Point instead." }
    ]
  },
  {
    id: "wm_t6_chokepoint_doctrine",
    name: "Chokepoint Doctrine",
    icon: "ability_warrior_weaponmastery",
    maxRanks: 2,
    position: { x: 2, y: 5 },
    requires: "wm_t5_entangling_field",
    spell: {
      name: "Chokepoint Doctrine",
      description: "Passive: You treat your own square and all adjacent squares as blocked terrain for enemies while you have any Calcified Armor. Enemies attempting to move through must succeed on a contested Might check against your Fortitude or stop where they began.",
      flavorText: "'Around?' There is no around.",
      source: "talent", class: "Warden", treeId: "monolith",
      spellType: "PASSIVE", category: "control",
      targetingMode: "self", rangeType: "self", auraRadius: 5,
      visualTheme: "iron", tags: ["passive", "body-block", "zone-control", "chokepoint", "warden"]
    },
    rankUpgrades: [
      { description: "Failed movers take 1d8 smashing damage from the wall of chain as they rebound." }
    ]
  },
  {
    id: "wm_t6_colossal_slam",
    name: "Colossal Slam",
    icon: "spell_fire_selfdestruct",
    maxRanks: 3,
    position: { x: 3, y: 5 },
    requires: "wm_t5_iron_gaol",
    spell: {
      name: "Colossal Slam",
      description: "Spend 3 AP, 4 VP: Bring everything you are down on the ground. All creatures within 10 feet take 4d6 smashing damage and are knocked Prone on a failed Reflex save. Any tethered enemy within 30 feet is violently hauled 10 feet closer to you whether they save or not.",
      flavorText: "The earth files a complaint. It is denied.",
      source: "talent", class: "Warden", treeId: "monolith",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 3,
      targetingMode: "aoe", rangeType: "self-centered", range: 10,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 4, cooldownUnit: "round",
      resourceCosts: { vengeance_points: { baseAmount: 4 } },
      saveType: "reflex",
      damageTypes: ["smashing"],
      primaryDamage: { dice: "4d6", flat: 0, procChance: 100 },
      visualTheme: "iron", tags: ["aoe", "prone", "pull", "vp-cost", "finisher", "warden"]
    },
    rankUpgrades: [
      { description: "Damage increases to 5d6 and haul distance increases to 15 feet.", primaryDamage: { dice: "5d6", flat: 0, procChance: 100 } },
      { description: "Prone duration doubles on failure and allies adjacent to you gain +2 DR for 1 round from the resulting dust-and-shockwave cover." }
    ]
  },

  // ──────────────── TIER 7 (Row 6 — Capstone Row) ────────────────
  {
    id: "wm_t7_avatar_of_the_monolith",
    name: "Avatar of the Monolith",
    icon: "spell_fire_elementaldevastation",
    maxRanks: 1,
    position: { x: 0.5, y: 6 },
    requires: "wm_t6_unbreakable_mass",
    spell: {
      name: "Avatar of the Monolith",
      description: "CAPSTONE: Spend 2 AP and 8 VP: fuse into living siege architecture for 3 rounds. Gain +5 Damage Reduction against all damage (stacking with Calcified Armor), become immune to fear, stun, Prone, push, and pull, and you always intercept 100% of area damage aimed at your tethered targets. At the end of each of your rounds, all enemies tethered to you are automatically hauled 10 feet into adjacency with you.",
      flavorText: "He asked the mountain what kept it standing through the Shattering. Then he asked harder.",
      source: "talent", class: "Warden", treeId: "monolith",
      spellType: "ACTIVE", category: "buff",
      actionPoints: 2,
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "once_per_combat", cooldownValue: 1, cooldownUnit: "combat",
      resourceCosts: { vengeance_points: { baseAmount: 8 } },
      durationConfig: { durationType: "rounds", durationValue: 3, durationUnit: "round" },
      visualTheme: "iron", tags: ["capstone", "transformation", "immunity", "interception", "vp-cost", "signature", "warden"]
    },
    rankUpgrades: []
  },
  {
    id: "wm_t7_monolith_doctrine",
    name: "Monolith Doctrine",
    icon: "inv_misc_book_09",
    maxRanks: 3,
    position: { x: 1.5, y: 6 },
    requires: "wm_t6_chokepoint_doctrine",
    spell: {
      name: "Monolith Doctrine",
      description: "Passive: All of your Iron Brace reactions, Penitent Resolve stances, and Enduring Bulwark plants gain +1 DR. Chokepoint Doctrine's blocked terrain now ignores size differences.",
      flavorText: "Doctrine is what remains when options run out. He made sure nothing else remained.",
      source: "talent", class: "Warden", treeId: "monolith",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "iron", tags: ["passive", "scaling", "doctrine", "capstone-row", "warden"]
    },
    rankUpgrades: [
      { description: "DR bonus increases to +2." },
      { description: "DR bonus increases to +3 and Iron Gaol no longer costs 3 AP (costs 1 AP)." }
    ]
  },
  {
    id: "wm_t7_eternal_calcification",
    name: "Eternal Calcification",
    icon: "ability_warrior_shieldreflection",
    maxRanks: 2,
    position: { x: 2.5, y: 6 },
    requires: "wm_t6_colossal_slam",
    spell: {
      name: "Eternal Calcification",
      description: "Passive: Your Calcified Armor cap increases by +2 beyond its current maximum, and attack rolls that hit you while you have 10+ Calcified Armor score a critical hit only on a natural 20.",
      flavorText: "There are layers of him no blade has met yet.",
      source: "talent", class: "Warden", treeId: "monolith",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "iron", tags: ["passive", "crit-shrug", "calcified-armor", "capstone-row", "warden"]
    },
    rankUpgrades: [
      { description: "Cap increases by an additional +2 and blight damage against you loses its +50% vulnerability bonus while any Calcified Armor persists (it still dissolves armor on hit)." }
    ]
  },
  {
    id: "wm_t7_judgment_of_stillness",
    name: "Judgment of Stillness",
    icon: "ability_warrior_revenge",
    maxRanks: 2,
    position: { x: 3.5, y: 6 },
    requires: "wm_t6_chokepoint_doctrine",
    spell: {
      name: "Judgment of Stillness",
      description: "Passive: Whenever an enemy ends its turn inside your threat radius without having attacked you since your last turn, the Monolith judges its cowardice: 2d6 smashing damage and the Entangled Slow (-15 ft).",
      flavorText: "Running past is its own confession.",
      source: "talent", class: "Warden", treeId: "monolith",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "aura", rangeType: "self", auraRadius: 15,
      damageTypes: ["smashing"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      visualTheme: "iron", tags: ["passive", "retaliation-aura", "punish", "capstone-row", "warden"]
    },
    rankUpgrades: [
      { description: "Damage increases to 4d6 and judged enemies also lose their reaction.", primaryDamage: { dice: "4d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "wm_t7_immovable_soul",
    name: "Immovable Soul",
    icon: "spell_shadow_truevision",
    maxRanks: 2,
    position: { x: 4.25, y: 6 },
    requires: "wm_t6_unbreakable_mass",
    spell: {
      name: "Immovable Soul",
      description: "Passive: The body calcified first; now the will follows. Gain +2 to all saving throws. You are immune to fear while tethered to at least one living creature — whatever is chained to him cannot abandon him to despair.",
      flavorText: "The paradox of the Monolith: nothing holds him together except everything he holds.",
      source: "talent", class: "Warden", treeId: "monolith",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "iron", tags: ["passive", "saves", "fear-immunity", "tether", "capstone-row", "warden"]
    },
    rankUpgrades: [
      { description: "Saving throw bonus increases to +4 and once per combat you may reduce any calculation of movement-drag or shove distance against you to zero after seeing it." }
    ]
  }
];
