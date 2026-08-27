// ============================================
// CRUSADER — DAWN BASTION (v2: talents are spells)
// Spec: Starlight Armor, Active Soak Scaling, Consecrated Bulwark, Party Protection
// Resource: Radiant Fervor (0-100)
// ============================================

export const CRUSADER_DAWN_BASTION = [
  // ─── TIER 1 (y: 0) ───
  {
    id: "cdb_t1_bastion_armor",
    name: "Starlight Carapace",
    icon: "spell_holy_devotionaura",
    maxRanks: 3,
    position: { x: 0.5, y: 0 },
    requires: null,
    spell: {
      name: "Starlight Carapace",
      description: "Passive: Inscribe starlight into your heavy plate. Gain +2 Passive DR and +1 bonus to all Active Soak die rolls.",
      flavorText: "The plate was forged in starlight so it would never yield to darkness.",
      source: "talent", class: "Crusader", treeId: "dawn_bastion",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "holy", tags: ["passive", "dr", "soak", "defense", "crusader"]
    },
    rankUpgrades: [
      { description: "Bonus increases to +3 Passive DR and +2 bonus to Active Soak die rolls." },
      { description: "Bonus increases to +4 Passive DR and +3 bonus to Active Soak die rolls; taking physical damage generates +2 Radiant Fervor." }
    ]
  },
  {
    id: "cdb_t1_shield_slam",
    name: "Radiant Shield Slam",
    icon: "ability_warrior_shieldbash",
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    spell: {
      name: "Radiant Shield Slam",
      description: "Spend 1 AP: Slam your shield into target foe for 1d8 smashing + 1d6 sacred damage. Generates +10 Radiant Fervor and interrupts enemy concentration.",
      flavorText: "A shield is an argument made of solid iron.",
      source: "talent", class: "Crusader", treeId: "dawn_bastion",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 1, targetingMode: "single", rangeType: "melee", range: 5,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 0, cooldownUnit: "round",
      damageTypes: ["smashing", "sacred"],
      primaryDamage: { dice: "1d8", flat: 0, procChance: 100 },
      secondaryDamage: { dice: "1d6", flat: 0, procChance: 100, damageType: "sacred" },
      visualTheme: "holy", tags: ["melee", "builder", "interrupt", "crusader"]
    },
    rankUpgrades: [
      { description: "Damage increases to 1d10 smashing + 1d8 sacred, and generates +15 Radiant Fervor.", primaryDamage: { dice: "1d10", flat: 0, procChance: 100 }, secondaryDamage: { dice: "1d8", flat: 0, procChance: 100, damageType: "sacred" } },
      { description: "Damage increases to 2d8 smashing + 2d6 sacred; target is Dazed (-2 to hit for 1 round) and generates +20 Radiant Fervor.", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 }, secondaryDamage: { dice: "2d6", flat: 0, procChance: 100, damageType: "sacred" } }
    ]
  },
  {
    id: "cdb_t1_vow_of_protection",
    name: "Vow of the Aegis",
    icon: "spell_holy_blessingofprotection",
    maxRanks: 2,
    position: { x: 3.5, y: 0 },
    requires: null,
    spell: {
      name: "Vow of the Aegis",
      description: "Passive: Whenever an ally within 15 ft takes damage, gain +5 Radiant Fervor and redirect 15% of the damage into your own Active Soak pool.",
      flavorText: "Step behind the plate. Suffer nothing.",
      source: "talent", class: "Crusader", treeId: "dawn_bastion",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "holy", tags: ["passive", "redirect", "tank", "crusader"]
    },
    rankUpgrades: [
      { description: "Redirect percentage increases to 25%, gain +10 Radiant Fervor, and radius extends to 25 ft." }
    ]
  },

  // ─── TIER 2 (y: 1) ───
  {
    id: "cdb_t2_consecrated_bastion",
    name: "Sanctified Aegis Ground",
    icon: "spell_holy_consecration",
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: "cdb_t1_bastion_armor",
    spell: {
      name: "Sanctified Aegis Ground",
      description: "Passive: While standing on Consecrated Ground, your Active Soak dice gain advantage and you regenerate 5 temporary HP at the start of your turn.",
      flavorText: "Holy ground makes for unshakeable footwork.",
      source: "talent", class: "Crusader", treeId: "dawn_bastion",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "holy", tags: ["passive", "consecration", "regen", "crusader"]
    },
    rankUpgrades: [
      { description: "Temporary HP regeneration increases to 10 per turn; allies on your Consecrated Ground also gain +2 Passive DR." },
      { description: "Temporary HP regeneration increases to 15 per turn; Consecrated Ground you create lasts 2 rounds longer." }
    ]
  },
  {
    id: "cdb_t2_radiant_taunt",
    name: "Beacon of Solvan Challenge",
    icon: "spell_holy_righteousdefense",
    maxRanks: 3,
    position: { x: 2.5, y: 1 },
    requires: "cdb_t1_shield_slam",
    spell: {
      name: "Beacon of Solvan Challenge",
      description: "Spend 1 AP & 20 Fervor: Emit a brilliant flash of starlight in 20 ft radius. All enemies are forced to target you for 1 round or suffer Disadvantage on attacks against allies.",
      flavorText: "Look upon the star. You shall see nothing else.",
      source: "talent", class: "Crusader", treeId: "dawn_bastion",
      spellType: "ACTIVE", category: "debuff",
      actionPoints: 1, targetingMode: "aoe", rangeType: "self-centered", range: 20,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 2, cooldownUnit: "round",
      damageTypes: ["sacred"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "holy", tags: ["aoe", "taunt", "control", "crusader"]
    },
    rankUpgrades: [
      { description: "Taunt radius extends to 30 ft and grants you 10 temporary HP per enemy taunted." },
      { description: "Taunted enemies take 2d6 sacred damage per attack they attempt against targets other than you." }
    ]
  },

  // ─── TIER 3 (y: 2) ───
  {
    id: "cdb_t3_starlight_bulwark",
    name: "Starlight Bulwark Wall",
    icon: "spell_holy_powerwordbarrier",
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: "cdb_t2_consecrated_bastion",
    spell: {
      name: "Starlight Bulwark Wall",
      description: "Spend 2 AP & 35 Fervor: Raise a 15 ft wide wall of solid starlight lasting 2 rounds. All allies behind the wall gain Full Cover against ranged physical attacks and projectile spells.",
      flavorText: "Light hardened until arrows shatter against it.",
      source: "talent", class: "Crusader", treeId: "dawn_bastion",
      spellType: "ACTIVE", category: "buff",
      actionPoints: 2, targetingMode: "line", rangeType: "ranged", range: 20,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 3, cooldownUnit: "round",
      visualTheme: "holy", tags: ["wall", "cover", "ranged-defense", "crusader"]
    },
    rankUpgrades: [
      { description: "Wall width extends to 20 ft and lasts 3 rounds." },
      { description: "Enemy spells that hit the wall have 50% of their damage reflected back at the caster as sacred damage." }
    ]
  },
  {
    id: "cdb_t3_retributive_mirror",
    name: "Retributive Mirror",
    icon: "spell_holy_eyeforaneye",
    maxRanks: 2,
    position: { x: 2.5, y: 2 },
    requires: "cdb_t2_radiant_taunt",
    spell: {
      name: "Retributive Mirror",
      description: "Passive: Whenever you successfully soak or absorb melee damage, the attacker takes 1d8 sacred retaliation damage.",
      flavorText: "Every blow struck against Sol's wall echoes back into the hand that swung.",
      source: "talent", class: "Crusader", treeId: "dawn_bastion",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "single", damageTypes: ["sacred"],
      primaryDamage: { dice: "1d8", flat: 0, procChance: 100 },
      visualTheme: "holy", tags: ["passive", "thorns", "retaliation", "crusader"]
    },
    rankUpgrades: [
      { description: "Retaliation damage increases to 2d8 sacred, and attackers are illuminated (cannot benefit from stealth or invisibility for 2 rounds).", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 } }
    ]
  },

  // ─── TIER 4 (y: 3) ───
  {
    id: "cdb_t4_immovable_sentinel",
    name: "Immovable Sentinel",
    icon: "ability_warrior_shieldwall",
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: "cdb_t3_starlight_bulwark",
    spell: {
      name: "Immovable Sentinel",
      description: "Passive: You are immune to being knocked Prone, pushed, or pulled. While stationary, gain +3 Passive DR against all incoming damage types.",
      flavorText: "Roots of starlight sink thirty paces into the bedrock.",
      source: "talent", class: "Crusader", treeId: "dawn_bastion",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "holy", tags: ["passive", "immunity", "anchor", "dr", "crusader"]
    },
    rankUpgrades: [
      { description: "Stationary DR increases to +5 Passive DR, and you gain Advantage on Constitution saving throws." },
      { description: "Stationary DR increases to +7 Passive DR; while stationary, adjacent allies gain +3 Passive DR as well." }
    ]
  },
  {
    id: "cdb_t4_bastion_rally",
    name: "Dawnward Rally",
    icon: "spell_holy_layonhands",
    maxRanks: 3,
    position: { x: 2.5, y: 3 },
    requires: "cdb_t3_retributive_mirror",
    spell: {
      name: "Dawnward Rally",
      description: "Spend 2 AP & 40 Fervor: Slam your shield to pulse waves of starlight across 30 ft. Cleanse 1 status condition from all allies and grant each ally 20 temporary HP.",
      flavorText: "The dawn does not ask the shadow's permission to break.",
      source: "talent", class: "Crusader", treeId: "dawn_bastion",
      spellType: "ACTIVE", category: "buff",
      actionPoints: 2, targetingMode: "aoe", rangeType: "self-centered", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 3, cooldownUnit: "round",
      visualTheme: "holy", tags: ["aoe", "cleanse", "temp-hp", "support", "crusader"]
    },
    rankUpgrades: [
      { description: "Temporary HP granted increases to 35, and affected allies gain +10 ft movement speed for 1 round." },
      { description: "Temporary HP granted increases to 50, and also cleanses all Blight, Poison, and Burn debuffs." }
    ]
  },

  // ─── TIER 5 (y: 4) ───
  {
    id: "cdb_t5_unyielding_phalanx",
    name: "Living Phalanx",
    icon: "ability_warrior_defensivestance",
    maxRanks: 3,
    position: { x: 1, y: 4 },
    requires: "cdb_t4_immovable_sentinel",
    spell: {
      name: "Living Phalanx",
      description: "Passive: For every ally within 10 ft of you, gain +1 Passive DR and +5% sacred damage resistance (up to +4 DR / +20% resistance).",
      flavorText: "A single shield is armor. Five shields are a fortress.",
      source: "talent", class: "Crusader", treeId: "dawn_bastion",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "holy", tags: ["passive", "phalanx", "scaling-dr", "crusader"]
    },
    rankUpgrades: [
      { description: "Cap increases to +6 DR and +30% resistance, and radius extends to 15 ft." },
      { description: "Allies within range also receive half the DR bonus (+1 to +3 DR)." }
    ]
  },
  {
    id: "cdb_t5_sacred_redirection",
    name: "Sacred Sacrifice Redirection",
    icon: "spell_holy_painsupression",
    maxRanks: 2,
    position: { x: 2.5, y: 4 },
    requires: "cdb_t4_bastion_rally",
    spell: {
      name: "Sacred Sacrifice Redirection",
      description: "REACTION — When an ally within 30 ft would suffer a fatal blow, intercept the strike: you take the damage instead (mitigated by your Soak/DR), and the ally is restored to 20% max health.",
      flavorText: "Aex fell so none beneath him had to. The Crusader does the same.",
      source: "talent", class: "Crusader", treeId: "dawn_bastion",
      spellType: "REACTION", category: "buff",
      actionPoints: 0, targetingMode: "single", rangeType: "ranged", range: 30,
      castTimeType: "reaction", castTimeValue: 1,
      cooldownValue: 1, cooldownUnit: "combat",
      visualTheme: "holy", tags: ["reaction", "cheat-death", "sacrifice", "crusader"]
    },
    rankUpgrades: [
      { description: "After intercepting the strike, you gain +50 Radiant Fervor and immunity to all damage for 1 round." }
    ]
  },

  // ─── TIER 6 (y: 5) ───
  {
    id: "cdb_t6_monolith_of_the_vigil",
    name: "Monolith of the Vigil",
    icon: "spell_holy_divinemission",
    maxRanks: 3,
    position: { x: 1, y: 5 },
    requires: "cdb_t5_unyielding_phalanx",
    spell: {
      name: "Monolith of the Vigil",
      description: "Spend 2 AP & 50 Fervor: Drop a starlight anchor into the earth. For 3 rounds, create a 20 ft dome of celestial light: all allies inside take 50% reduced damage from all sources.",
      flavorText: "Beneath the monolith, the storm of battle turns to silence.",
      source: "talent", class: "Crusader", treeId: "dawn_bastion",
      spellType: "ACTIVE", category: "buff",
      actionPoints: 2, targetingMode: "aoe", rangeType: "self-centered", range: 20,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 4, cooldownUnit: "round",
      visualTheme: "holy", tags: ["aoe", "dome", "damage-reduction", "crusader"]
    },
    rankUpgrades: [
      { description: "Damage reduction inside the dome increases to 60%, and dome radius extends to 25 ft." },
      { description: "Enemies that enter the dome take 3d8 sacred damage and are pushed back 10 ft." }
    ]
  },
  {
    id: "cdb_t6_bastion_endurance",
    name: "Heart of the Sun Fortress",
    icon: "spell_holy_unyieldingfaith",
    maxRanks: 2,
    position: { x: 2.5, y: 5 },
    requires: "cdb_t5_sacred_redirection",
    spell: {
      name: "Heart of the Sun Fortress",
      description: "Passive: Maximum Health increased by +25%. Whenever your health drops below 50%, immediately gain 50 Radiant Fervor and a 40 HP temporary shield (once per combat).",
      flavorText: "Wounds only expose the starlight furnace within.",
      source: "talent", class: "Crusader", treeId: "dawn_bastion",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "holy", tags: ["passive", "hp-boost", "emergency-shield", "crusader"]
    },
    rankUpgrades: [
      { description: "Maximum Health increased by +40%, and emergency shield value increases to 80 HP." }
    ]
  },

  // ─── TIER 7 (Capstone Row, y: 6) ───
  {
    id: "cdb_t7_avatar_of_the_bulwark",
    name: "Avatar of the Unbroken Dawn",
    icon: "spell_holy_guardianspirit",
    maxRanks: 1,
    position: { x: 1, y: 6 },
    requires: "cdb_t6_monolith_of_the_vigil",
    spell: {
      name: "Avatar of the Unbroken Dawn",
      description: "CAPSTONE — Spend 3 AP & 100 Fervor: Become the Living Star Fortress for 3 rounds. Become completely immune to all physical and magical damage. While active, every attack made against any ally within 30 ft is automatically redirected to you and completely nullified, triggering a 2d8 sacred backblast at the attacker.",
      flavorText: "For three rounds, no sword cuts, no spell burns, and no companion falls.",
      source: "talent", class: "Crusader", treeId: "dawn_bastion",
      spellType: "ACTIVE", category: "buff",
      actionPoints: 3, targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "once_per_combat", cooldownValue: 1, cooldownUnit: "combat",
      durationRounds: 3,
      visualTheme: "holy", tags: ["capstone", "ultimate", "invulnerability", "redirect", "crusader"]
    },
    rankUpgrades: []
  },
  {
    id: "cdb_t7_eternal_vigil_vow",
    name: "Eternal Vigil Vow",
    icon: "spell_holy_sealofprotection",
    maxRanks: 2,
    position: { x: 2.5, y: 6 },
    requires: "cdb_t6_bastion_endurance",
    spell: {
      name: "Eternal Vigil Vow",
      description: "Passive: All Active Soak dice you roll explode on maximum values (roll additional soak die). Passive DR applied to allies through your auras and abilities is permanently doubled.",
      flavorText: "The vigil has lasted ten centuries. It will not break today.",
      source: "talent", class: "Crusader", treeId: "dawn_bastion",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "holy", tags: ["passive", "capstone-row", "exploding-dice", "aura-double", "crusader"]
    },
    rankUpgrades: [
      { description: "Exploding soak dice can chain indefinitely, and whenever you soak 20+ damage in a single round, refund 1 AP on your next turn." }
    ]
  }
];
