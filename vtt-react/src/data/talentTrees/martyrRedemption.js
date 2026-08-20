// ============================================
// MARTYR — REDEMPTION (v3: Rebalanced Tier Budgets, Normalized Grid Coordinates)
// Schema: see talentSystem.mjs.
// Grid coordinates: x (0..4), y (0..6 representing Tiers 1..7).
//
// FANTASY: The Sacred Healer / Compassionate Conduit / Sol's Restoration.
// ============================================

export const MARTYR_REDEMPTION = [
  // ──────────────── TIER 1 (Row 0) ────────────────
  {
    id: "rdm_t1_lay_on_hands",
    name: "Lay on Hands",
    icon: "spell_holy_layonhands",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Lay on Hands",
      description: "Spend 1 AP and 1 Devotion: Lay hands on a creature within 5 feet to restore 1d8 Hit Points.",
      flavorText: "The light passes through you like a toll road. Worth it.",
      source: "talent", class: "Martyr", treeId: "redemption",
      spellType: "ACTIVE", category: "healing",
      actionPoints: 1,
      targetingMode: "single", rangeType: "touch", range: 5,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 1, cooldownUnit: "round",
      resourceCosts: { devotion: { baseAmount: 1 } },
      healing: { dice: "1d8", flat: 0 },
      visualTheme: "sacred", tags: ["healing", "touch", "martyr"]
    },
    rankUpgrades: [
      { description: "Restores 2d6 Hit Points.", healing: { dice: "2d6", flat: 0 } },
      { description: "Restores 2d8 Hit Points, and overhealing becomes temporary Hit Points (up to 4 temp HP).", healing: { dice: "2d8", flat: 0 } }
    ]
  },
  {
    id: "rdm_t1_healing_touch",
    name: "Radiant Grace",
    icon: "spell_holy_healingtouch",
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    spell: {
      name: "Radiant Grace",
      description: "Passive: Whenever you cast a healing spell on an ally, you both gain +1 to your next saving throw within 1 round.",
      flavorText: "Small mercies, delivered constantly.",
      source: "talent", class: "Martyr", treeId: "redemption",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "save-buff", "martyr"]
    },
    rankUpgrades: [
      { description: "Saving throw bonus increases to +2." },
      { description: "Saving throw bonus increases to +2 and target gains 3 temporary Hit Points." }
    ]
  },
  {
    id: "rdm_t1_purify",
    name: "Purifying Touch",
    icon: "spell_holy_purifyingpower",
    maxRanks: 2,
    position: { x: 3, y: 0 },
    requires: null,
    spell: {
      name: "Purifying Touch",
      description: "Spend 1 AP and 1 Devotion: Remove 1 Poison or Disease condition from a target within 30 feet.",
      flavorText: "You take a little of it with you. Sol insists.",
      source: "talent", class: "Martyr", treeId: "redemption",
      spellType: "ACTIVE", category: "utility",
      actionPoints: 1,
      targetingMode: "single", rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 2, cooldownUnit: "rounds",
      resourceCosts: { devotion: { baseAmount: 1 } },
      visualTheme: "sacred", tags: ["cleanse", "utility", "martyr"]
    },
    rankUpgrades: [
      { description: "Removes all Poison, Disease, and Curse conditions, and restores 1d6 Hit Points." }
    ]
  },

  // ──────────────── TIER 2 (Row 1) ────────────────
  {
    id: "rdm_t2_cure_wounds",
    name: "Sacred Mending",
    icon: "spell_holy_renew",
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: "rdm_t1_lay_on_hands",
    spell: {
      name: "Sacred Mending",
      description: "Spend 1 AP: Channel soothing radiant energy into an ally within 30 feet, restoring 1d8+2 Hit Points.",
      flavorText: "Sutures, but preached.",
      source: "talent", class: "Martyr", treeId: "redemption",
      spellType: "ACTIVE", category: "healing",
      actionPoints: 1,
      targetingMode: "single", rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 1, cooldownUnit: "round",
      healing: { dice: "1d8", flat: 2 },
      visualTheme: "sacred", tags: ["healing", "martyr"]
    },
    rankUpgrades: [
      { description: "Restores 2d6+2 Hit Points.", healing: { dice: "2d6", flat: 2 } },
      { description: "Restores 2d8+3 Hit Points and removes 1 bleed effect.", healing: { dice: "2d8", flat: 3 } }
    ]
  },
  {
    id: "rdm_t2_restoring_light",
    name: "Beacon of Solace",
    icon: "spell_holy_restoration",
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: "rdm_t1_purify",
    spell: {
      name: "Beacon of Solace",
      description: "Passive: Whenever you heal an ally below half maximum health, restore +1d4 additional Hit Points and generate 1 Devotion.",
      flavorText: "The darker the shadow, the brighter the light shines.",
      source: "talent", class: "Martyr", treeId: "redemption",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "bonus-heal", "martyr"]
    },
    rankUpgrades: [
      { description: "Bonus healing increases to +1d6 Hit Points." },
      { description: "Bonus healing increases to +1d8 Hit Points and target gains +10 feet movement speed for 1 round." }
    ]
  },

  // ──────────────── TIER 3 (Row 2) ────────────────
  {
    id: "rdm_t3_mass_healing",
    name: "Prayer of Radiance",
    icon: "spell_holy_prayerofhealing",
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: "rdm_t2_cure_wounds",
    spell: {
      name: "Prayer of Radiance",
      description: "Spend 1 AP and 2 Devotion: Heal all allies within a 20-foot radius for 1d8 Hit Points.",
      flavorText: "One light, many windows.",
      source: "talent", class: "Martyr", treeId: "redemption",
      spellType: "ACTIVE", category: "healing",
      actionPoints: 1,
      targetingMode: "aoe", aoeShape: "circle", aoeSize: 20, rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 2, cooldownUnit: "rounds",
      resourceCosts: { devotion: { baseAmount: 2 } },
      healing: { dice: "1d8", flat: 0 },
      visualTheme: "sacred", tags: ["aoe", "heal", "martyr"]
    },
    rankUpgrades: [
      { description: "Heals all allies in the radius for 2d6 Hit Points.", healing: { dice: "2d6", flat: 0 } },
      { description: "Heals all allies for 2d8 Hit Points and grants them +1 Armor for 1 round.", healing: { dice: "2d8", flat: 0 } }
    ]
  },
  {
    id: "rdm_t3_martyrs_sacrifice",
    name: "Blood of the Martyr",
    icon: "spell_holy_sealofsacrifice",
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: "rdm_t2_restoring_light",
    spell: {
      name: "Blood of the Martyr",
      description: "Spend 1 AP and sacrifice 4 HP: Instantly heal an ally within 40 feet for 2d8 Hit Points without consuming Devotion.",
      flavorText: "Your own lifeblood poured into another's cup.",
      source: "talent", class: "Martyr", treeId: "redemption",
      spellType: "ACTIVE", category: "healing",
      actionPoints: 1,
      targetingMode: "single", rangeType: "ranged", range: 40,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 2, cooldownUnit: "rounds",
      healing: { dice: "2d8", flat: 0 },
      visualTheme: "sacred", tags: ["sacrifice-heal", "martyr"]
    },
    rankUpgrades: [
      { description: "Sacrifice 4 HP: Restores 3d6 Hit Points to the ally.", healing: { dice: "3d6", flat: 0 } },
      { description: "Sacrifice 4 HP: Restores 3d8 Hit Points and grants the ally +2 Damage Reduction for 1 round.", healing: { dice: "3d8", flat: 0 } }
    ]
  },

  // ──────────────── TIER 4 (Row 3) ────────────────
  {
    id: "rdm_t4_divine_intervention",
    name: "Sol's Intervention",
    icon: "spell_holy_guardianspirit",
    maxRanks: 1,
    position: { x: 2, y: 3 },
    requires: ["rdm_t3_mass_healing", "rdm_t3_martyrs_sacrifice"],
    spell: {
      name: "Sol's Intervention",
      description: "Spend 1 AP and 2 Devotion: Place a protective guardian light on an ally for 2 rounds. If the ally would suffer lethal damage, they survive with 15 Hit Points and the light bursts, blinding adjacent enemies for 1 round.",
      flavorText: "Death itself is turned away at the threshold.",
      source: "talent", class: "Martyr", treeId: "redemption",
      spellType: "ACTIVE", category: "buff",
      actionPoints: 1,
      targetingMode: "single", rangeType: "ranged", range: 40,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 4, cooldownUnit: "rounds",
      resourceCosts: { devotion: { baseAmount: 2 } },
      visualTheme: "sacred", tags: ["cheat-death", "ally-save", "martyr"]
    }
  },

  // ──────────────── TIER 5 (Row 4) ────────────────
  {
    id: "rdm_t5_aura_of_grace",
    name: "Aura of Sanctity",
    icon: "spell_holy_auraoflight",
    maxRanks: 3,
    position: { x: 1, y: 4 },
    requires: "rdm_t4_divine_intervention",
    spell: {
      name: "Aura of Sanctity",
      description: "Passive: You and allies within 20 feet gain +2 Sacred and Blight resistance, and recover 2 Hit Points at the start of your turn while in combat.",
      flavorText: "An enduring warmth that wards against the chill of decay.",
      source: "talent", class: "Martyr", treeId: "redemption",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "regen", "aura", "martyr"]
    },
    rankUpgrades: [
      { description: "Resistance increases to +3, and allies recover 3 Hit Points per turn." },
      { description: "Resistance increases to +4, allies recover 4 Hit Points per turn, and gain +1 to all saving throws." }
    ]
  },
  {
    id: "rdm_t5_channel_radiance",
    name: "Radiant Burst",
    icon: "spell_holy_holysmite",
    maxRanks: 2,
    position: { x: 3, y: 4 },
    requires: "rdm_t4_divine_intervention",
    spell: {
      name: "Radiant Burst",
      description: "Passive: When you cast a single-target healing spell, an enemy within 20 feet of the target suffers sacred damage equal to half the amount healed.",
      flavorText: "The shadow flees as the light enters.",
      source: "talent", class: "Martyr", treeId: "redemption",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["sacred"],
      visualTheme: "sacred", tags: ["passive", "heal-damage", "martyr"]
    },
    rankUpgrades: [
      { description: "Enemy suffers full sacred damage equal to the amount healed (up to 12 damage maximum)." }
    ]
  },

  // ──────────────── TIER 6 (Row 5) ────────────────
  {
    id: "rdm_t6_resplendent_dawn",
    name: "Resplendent Dawn",
    icon: "spell_holy_holybolt",
    maxRanks: 3,
    position: { x: 2, y: 5 },
    requires: ["rdm_t5_aura_of_grace", "rdm_t5_channel_radiance"],
    spell: {
      name: "Resplendent Dawn",
      description: "Spend 2 AP and 3 Devotion: Unleash a 30-foot burst of solar dawn. Restores 3d8 Hit Points to all allies, removes all debilitating conditions, and deals 2d8 sacred damage to all enemies in the area.",
      flavorText: "The sun rises directly inside the sanctuary.",
      source: "talent", class: "Martyr", treeId: "redemption",
      spellType: "ACTIVE", category: "healing",
      actionPoints: 2,
      targetingMode: "aoe", aoeShape: "circle", aoeSize: 30, rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 3, cooldownUnit: "rounds",
      resourceCosts: { devotion: { baseAmount: 3 } },
      healing: { dice: "3d8", flat: 0 },
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      damageTypes: ["sacred"],
      visualTheme: "sacred", tags: ["nuke-heal", "aoe", "cleanse", "martyr"]
    },
    rankUpgrades: [
      { description: "Heals allies for 3d10 Hit Points and deals 2d10 sacred damage to enemies.", healing: { dice: "3d10", flat: 0 }, primaryDamage: { dice: "2d10", flat: 0, procChance: 100 } },
      { description: "Heals allies for 4d8 Hit Points, deals 3d8 sacred damage, and grants all allies +2 Armor for 2 rounds.", healing: { dice: "4d8", flat: 0 }, primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } }
    ]
  },

  // ──────────────── TIER 7 (Row 6 - Capstones) ────────────────
  {
    id: "rdm_t7_avatar_of_sol",
    name: "Avatar of the Redeeming Sun",
    icon: "spell_holy_mindvision",
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: "rdm_t6_resplendent_dawn",
    spell: {
      name: "Avatar of the Redeeming Sun",
      description: "ULTIMATE: Spend 2 AP and 3 Devotion: For 2 rounds, all your healing spells heal for maximum possible dice rolls, all overhealing is converted into permanent temporary Hit Points, and your presence emanates a 20-foot aura dealing 1d8 sacred damage to all enemies each turn.",
      flavorText: "You become the living sun. No wound remains unhealed.",
      source: "talent", class: "Martyr", treeId: "redemption",
      spellType: "ACTIVE", category: "buff",
      actionPoints: 2,
      targetingMode: "self",
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "turn_based", cooldownValue: 5, cooldownUnit: "rounds",
      resourceCosts: { devotion: { baseAmount: 3 } },
      visualTheme: "sacred", tags: ["ultimate", "max-heal", "martyr"]
    }
  },
  {
    id: "rdm_t7_undying_saint",
    name: "Saintly Ascension",
    icon: "spell_holy_divineprovidence",
    maxRanks: 2,
    position: { x: 1, y: 6 },
    requires: "rdm_t6_resplendent_dawn",
    spell: {
      name: "Saintly Ascension",
      description: "Passive: When you die or fall to 0 HP, your spirit lingers for 1 round: you can continue to cast spells normally, and when the round ends, you revive with 20 Hit Points (cooldown: 4 rounds).",
      flavorText: "The spirit outlasts the flesh by holy decree.",
      source: "talent", class: "Martyr", treeId: "redemption",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "cheat-death", "revive", "martyr"]
    },
    rankUpgrades: [
      { description: "Revives with 35 Hit Points, and upon reviving, heals all allies within 30 feet for 2d8 Hit Points." }
    ]
  },
  {
    id: "rdm_t7_boundless_grace",
    name: "Boundless Compassion",
    icon: "spell_holy_greaterblessingofsanctuary",
    maxRanks: 2,
    position: { x: 3, y: 6 },
    requires: "rdm_t6_resplendent_dawn",
    spell: {
      name: "Boundless Compassion",
      description: "Passive: Whenever you heal an ally, all other party members within 30 feet receive 25% of that healing.",
      flavorText: "A pool that overflows into every thirsting vessel.",
      source: "talent", class: "Martyr", treeId: "redemption",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "splash-heal", "martyr"]
    },
    rankUpgrades: [
      { description: "Other party members receive 50% of the healing and gain +1 to hit on their next turn." }
    ]
  }
];
