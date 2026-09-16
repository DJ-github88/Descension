// ============================================
// CRUSADER — DAWN BASTION (v3: talents are spells)
// Fantasy: the immovable shield of Solvan doctrine. Active Soak, Passive DR,
// taunts, consecrated bulwarks, party protection, and sacred retribution.
// Economy: 8/6/6/5/5/5 + 15 = 50 pts across 7 tiers (19 nodes).
// Layout: RAMPART — a keep at the crown widening into a fortress foundation;
// the ultimate is gated behind BOTH the ward and endurance branches.
// ============================================

export const CRUSADER_DAWN_BASTION = [
  // ─── TIER 1 (y: 0) ───
  {
    id: "cdb_t1_bastion_armor",
    name: "Starlight Carapace",
    icon: "Radiant/Radiant Golden Shield",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Starlight Carapace",
      description: "Passive — Inscribe starlight into your plate. Gain +2 Passive DR and +1 bonus to all Active Soak die rolls.",
      flavorText: "The plate was forged in starlight so it would never yield to darkness.",
      source: "talent", class: "Crusader", treeId: "dawn_bastion",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "holy", tags: ["passive", "dr", "soak", "defense", "crusader"]
    },
    rankUpgrades: [
      { description: "The bonus increases to +3 Passive DR and +2 on Active Soak die rolls, and taking physical damage generates +2 Fervor." },
      { description: "The bonus increases to +4 Passive DR and +3 on Active Soak die rolls, and soaking 15+ damage in a round generates +5 Fervor." }
    ]
  },
  {
    id: "cdb_t1_shield_slam",
    name: "Radiant Shield Slam",
    icon: "Bludgeoning/Warrior Hammer Shield",
    maxRanks: 3,
    position: { x: 2.5, y: 0 },
    requires: null,
    spell: {
      name: "Radiant Shield Slam",
      description: "Spend 1 AP: slam your shield into a foe for 1d8 smashing + 1d6 sacred damage, generate +10 Fervor, and interrupt enemy concentration.",
      flavorText: "A shield is an argument made of solid iron.",
      source: "talent", class: "Crusader", treeId: "dawn_bastion",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 1, targetingMode: "single", rangeType: "melee", range: 5,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 1, cooldownUnit: "rounds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 3 } },
      damageTypes: ["smashing", "sacred"],
      primaryDamage: { dice: "1d8", flat: 0, procChance: 100 },
      secondaryDamage: { dice: "1d6", flat: 0, procChance: 100, damageType: "sacred" },
      visualTheme: "holy", tags: ["melee", "builder", "interrupt", "crusader"]
    },
    rankUpgrades: [
      { description: "Damage increases to 1d10 smashing + 1d8 sacred and the slam generates +15 Fervor.", primaryDamage: { dice: "1d10", flat: 0, procChance: 100 }, secondaryDamage: { dice: "1d8", flat: 0, procChance: 100, damageType: "sacred" } },
      { description: "Damage increases to 2d8 smashing + 2d6 sacred, the target is Dazed (-2 to hit for 1 round), and the slam generates +20 Fervor.", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 }, secondaryDamage: { dice: "2d6", flat: 0, procChance: 100, damageType: "sacred" } }
    ]
  },
  {
    id: "cdb_t1_vow_of_protection",
    name: "Vow of the Aegis",
    icon: "Radiant/Golden Embrace",
    maxRanks: 2,
    position: { x: 4, y: 0 },
    requires: null,
    spell: {
      name: "Vow of the Aegis",
      description: "Passive — When an ally within 15 ft takes damage, gain +5 Fervor and pull 15% of that damage into your own Active Soak pool.",
      flavorText: "Step behind the plate. Suffer nothing.",
      source: "talent", class: "Crusader", treeId: "dawn_bastion",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "holy", tags: ["passive", "redirect", "tank", "crusader"]
    },
    rankUpgrades: [
      { description: "You pull 25% of the damage and gain +10 Fervor, and the vow reaches allies within 25 ft." }
    ]
  },

  // ─── TIER 2 (y: 1.5) ───
  {
    id: "cdb_t2_consecrated_bastion",
    name: "Sanctified Aegis Ground",
    icon: "Radiant/Radiant Magical Rune",
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: "cdb_t1_bastion_armor",
    spell: {
      name: "Sanctified Aegis Ground",
      description: "Passive — While standing on Consecrated Ground you roll Active Soak dice with advantage and gain 5 temporary HP at the start of your turn.",
      flavorText: "Holy ground makes for unshakeable footwork.",
      source: "talent", class: "Crusader", treeId: "dawn_bastion",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "holy", tags: ["passive", "consecration", "regen", "crusader"]
    },
    rankUpgrades: [
      { description: "The temporary HP becomes 10 per turn, and allies on your Consecrated Ground gain +2 Passive DR." },
      { description: "The temporary HP becomes 15 per turn, and Consecrated Ground you create lasts 2 rounds longer." }
    ]
  },
  {
    id: "cdb_t2_radiant_taunt",
    name: "Beacon of Solvan Challenge",
    icon: "Radiant/Radiant Light Burst",
    maxRanks: 3,
    position: { x: 4, y: 1 },
    requires: "cdb_t1_shield_slam",
    spell: {
      name: "Beacon of Solvan Challenge",
      description: "Spend 1 AP & 20 Fervor: a 20 ft starlight flare forces every enemy to target you or suffer Disadvantage on attacks against your allies for 1 round.",
      flavorText: "Look upon the star. You shall see nothing else.",
      source: "talent", class: "Crusader", treeId: "dawn_bastion",
      spellType: "ACTIVE", category: "debuff",
      actionPoints: 1, targetingMode: "aoe", rangeType: "self-centered", range: 20,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 1, cooldownUnit: "rounds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { mana: { baseAmount: 5 } },
      damageTypes: ["sacred"],
      visualTheme: "holy", tags: ["aoe", "taunt", "control", "crusader"]
    },
    rankUpgrades: [
      { description: "The flare reaches 30 ft and you gain 10 temporary HP per enemy taunted." },
      { description: "Taunted enemies that attack anyone other than you take 2d6 sacred damage.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } }
    ]
  },

  // ─── TIER 3 (y: 3) ───
  {
    id: "cdb_t3_starlight_bulwark",
    name: "Starlight Wall",
    icon: "Force/Radiating Barrier",
    maxRanks: 3,
    position: { x: 0.5, y: 2 },
    requires: "cdb_t2_consecrated_bastion",
    spell: {
      name: "Starlight Wall",
      description: "Spend 2 AP & 35 Fervor: raise a 15 ft wall of solid starlight for 2 rounds. Allies behind it gain Full Cover against ranged physical attacks and projectile spells.",
      flavorText: "Light hardened until arrows shatter against it.",
      source: "talent", class: "Crusader", treeId: "dawn_bastion",
      spellType: "ACTIVE", category: "buff",
      actionPoints: 2, targetingMode: "line", rangeType: "ranged", range: 20,
      aoeShape: "line", aoeSize: 15,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 1, cooldownUnit: "rounds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 7 } },
      visualTheme: "holy", tags: ["wall", "cover", "ranged-defense", "crusader"]
    },
    rankUpgrades: [
      { description: "The wall extends to 20 ft and lasts 3 rounds." },
      { description: "Enemy spells that strike the wall have 50% of their damage reflected back at the caster as sacred damage." }
    ]
  },
  {
    id: "cdb_t3_retributive_mirror",
    name: "Retributive Mirror",
    icon: "Radiant/Golden Ring",
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: "cdb_t2_radiant_taunt",
    spell: {
      name: "Retributive Mirror",
      description: "Passive — Whenever you soak or absorb melee damage, the attacker takes 1d8 sacred retaliation damage.",
      flavorText: "Every blow struck against Sol's wall echoes back into the hand that swung.",
      source: "talent", class: "Crusader", treeId: "dawn_bastion",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "single", damageTypes: ["sacred"],
      primaryDamage: { dice: "1d8", flat: 0, procChance: 100 },
      visualTheme: "holy", tags: ["passive", "thorns", "retaliation", "crusader"]
    },
    rankUpgrades: [
      { description: "Retaliation increases to 2d8 sacred and the attacker is illuminated (cannot benefit from stealth or invisibility) for 2 rounds.", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 } },
      { description: "Retaliation increases to 3d8 sacred and also triggers when you absorb damage dealt to an ally through Vow of the Aegis.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } }
    ]
  },

  // ─── TIER 4 (y: 4.5) ───
  {
    id: "cdb_t4_immovable_sentinel",
    name: "Immovable Sentinel",
    icon: "General/Defend",
    maxRanks: 3,
    position: { x: 1.5, y: 3 },
    requires: "cdb_t3_starlight_bulwark",
    spell: {
      name: "Immovable Sentinel",
      description: "Passive — You are immune to being knocked Prone, pushed, or pulled. While stationary, gain +3 Passive DR against all damage.",
      flavorText: "Roots of starlight sink thirty paces into the bedrock.",
      source: "talent", class: "Crusader", treeId: "dawn_bastion",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "holy", tags: ["passive", "immunity", "anchor", "dr", "crusader"]
    },
    rankUpgrades: [
      { description: "Stationary DR increases to +5 and you gain advantage on Constitution saving throws." },
      { description: "Stationary DR increases to +7, and while stationary adjacent allies gain +3 Passive DR." }
    ]
  },
  {
    id: "cdb_t4_bastion_rally",
    name: "Dawnward Rally",
    icon: "Radiant/Radiant Beam of Healing",
    maxRanks: 2,
    position: { x: 3.5, y: 3 },
    requires: "cdb_t3_retributive_mirror",
    spell: {
      name: "Dawnward Rally",
      description: "Spend 2 AP & 40 Fervor: slam your shield to pulse starlight across 30 ft. Cleanse 1 condition from each ally and grant each of them 20 temporary HP.",
      flavorText: "The dawn does not ask the shadow's permission to break.",
      source: "talent", class: "Crusader", treeId: "dawn_bastion",
      spellType: "ACTIVE", category: "buff",
      actionPoints: 2, targetingMode: "aoe", rangeType: "self-centered", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 1, cooldownUnit: "rounds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { mana: { baseAmount: 8 } },
      visualTheme: "holy", tags: ["aoe", "cleanse", "temp-hp", "support", "crusader"]
    },
    rankUpgrades: [
      { description: "The temporary HP becomes 40, affected allies gain +10 ft movement speed for 1 round, and the rally also cleanses Blight, Poison, and Burn effects." }
    ]
  },

  // ─── TIER 5 (y: 6) ───
  {
    id: "cdb_t5_unyielding_phalanx",
    name: "Living Phalanx",
    icon: "Bludgeoning/Fist Shield",
    maxRanks: 3,
    position: { x: 0, y: 4 },
    requires: "cdb_t4_immovable_sentinel",
    spell: {
      name: "Living Phalanx",
      description: "Passive — For every ally within 10 ft you gain +1 Passive DR and +5% sacred resistance, up to +4 DR and +20% resistance.",
      flavorText: "A single shield is armour. Five shields are a fortress.",
      source: "talent", class: "Crusader", treeId: "dawn_bastion",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "holy", tags: ["passive", "phalanx", "scaling-dr", "crusader"]
    },
    rankUpgrades: [
      { description: "The cap rises to +6 Passive DR and +30% sacred resistance, and the aura reaches 15 ft." },
      { description: "Allies within the aura also receive half of your bonus (+1 to +3 Passive DR)." }
    ]
  },
  {
    id: "cdb_t5_sacred_redirection",
    name: "Sacrifice Interposition",
    icon: "Radiant/Prayer of the Desperate",
    maxRanks: 2,
    position: { x: 2.5, y: 4 },
    requires: "cdb_t4_bastion_rally",
    spell: {
      name: "Sacrifice Interposition",
      description: "REACTION: When an ally within 30 ft would be reduced to 0 HP, intercept the strike — you take the damage instead (mitigated by your Soak and DR) and the ally is restored to 20% of their maximum health.",
      flavorText: "Aex fell so none beneath him had to. The Crusader does the same.",
      source: "talent", class: "Crusader", treeId: "dawn_bastion",
      spellType: "ACTIVE", actionType: "reaction", category: "buff",
      actionPoints: 0, targetingMode: "single", rangeType: "ranged", range: 30,
      castTimeType: "reaction", castTimeValue: 1,
      reactionTrigger: "When an ally within 30 ft would be reduced to 0 HP",
      cooldownCategory: "once_per_combat", cooldownValue: 1, cooldownUnit: "combat",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 8 } },
      visualTheme: "holy", tags: ["reaction", "cheat-death", "sacrifice", "crusader"]
    },
    rankUpgrades: [
      { description: "After intercepting the strike you gain +50 Fervor and immunity to all damage for 1 round." }
    ]
  },

  // ─── TIER 6 (y: 7.5) ───
  {
    id: "cdb_t6_monolith_of_the_vigil",
    name: "Monolith of the Vigil",
    icon: "Radiant/Golden Bell",
    maxRanks: 1,
    position: { x: 0, y: 5 },
    requires: "cdb_t5_unyielding_phalanx",
    spell: {
      name: "Monolith of the Vigil",
      description: "Spend 3 AP & 50 Fervor: drop a starlight anchor into the earth. For 3 rounds a 20 ft dome of celestial light surrounds it: allies inside take 50% less damage from all sources.",
      flavorText: "Beneath the monolith, the storm of battle turns to silence.",
      source: "talent", class: "Crusader", treeId: "dawn_bastion",
      spellType: "ACTIVE", category: "buff",
      actionPoints: 3, targetingMode: "aoe", rangeType: "self-centered", range: 20,
      aoeShape: "circle", aoeSize: 20,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 1, cooldownUnit: "rounds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: false, interruptible: false,
      resourceCosts: { mana: { baseAmount: 10 } },
      visualTheme: "holy", tags: ["aoe", "dome", "damage-reduction", "crusader"]
    },
    rankUpgrades: []
  },
  {
    id: "cdb_t6_bastion_endurance",
    name: "Heart of the Sun Fortress",
    icon: "Radiant/Radiant Golden Knight",
    maxRanks: 2,
    position: { x: 1.5, y: 5 },
    requires: ["cdb_t5_unyielding_phalanx", "cdb_t5_sacred_redirection"],
    spell: {
      name: "Heart of the Sun Fortress",
      description: "Passive — Maximum Health increased by +25%. Dropping below 50% health grants 50 Fervor and a 40 HP starlight shield (once per combat).",
      flavorText: "Wounds only expose the starlight furnace within.",
      source: "talent", class: "Crusader", treeId: "dawn_bastion",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "holy", tags: ["passive", "hp-boost", "emergency-shield", "crusader"]
    },
    rankUpgrades: [
      { description: "Maximum Health increases by +40%, and the emergency shield becomes 80 HP and also triggers when you drop below 30% health." }
    ]
  },
  {
    id: "cdb_t6_consecration_engine",
    name: "Consecration Engine",
    icon: "Radiant/Radiant Divinity",
    maxRanks: 2,
    position: { x: 4, y: 5 },
    requires: "cdb_t5_sacred_redirection",
    spell: {
      name: "Consecration Engine",
      description: "Passive — Consecrated Ground you create is 5 ft larger and lasts 2 rounds longer. Allies standing on it gain +5 Fervor at the start of their turn.",
      flavorText: "The Vigil does not merely hold ground. It makes the ground holy.",
      source: "talent", class: "Crusader", treeId: "dawn_bastion",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self",
      visualTheme: "holy", tags: ["passive", "consecration", "support", "crusader"]
    },
    rankUpgrades: [
      { description: "The ground is 10 ft larger and lasts 3 rounds longer, and allies on it also gain +1 Passive DR." }
    ]
  },

  // ─── TIER 7 (y: 8) ───
  {
    id: "cdb_t7_avatar_of_the_bulwark",
    name: "Avatar of the Unbroken Dawn",
    icon: "Radiant/Winged Angel",
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ["cdb_t6_monolith_of_the_vigil", "cdb_t6_bastion_endurance"],
    requiresAll: true,
    spell: {
      name: "Avatar of the Unbroken Dawn",
      description: "ULTIMATE — Spend 3 AP & 100 Fervor: become the Living Star Fortress for 3 rounds. You are immune to all damage; every attack against an ally within 30 ft is redirected to you, completely nullified, and answered with a 2d8 sacred backblast.",
      flavorText: "For three rounds, no sword cuts, no spell burns, and no companion falls.",
      source: "talent", class: "Crusader", treeId: "dawn_bastion",
      spellType: "ACTIVE", category: "buff",
      actionPoints: 3, targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "once_per_combat", cooldownValue: 1, cooldownUnit: "combat",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: false, interruptible: false,
      resourceCosts: { mana: { baseAmount: 15 } },
      durationRounds: 3,
      visualTheme: "holy", tags: ["ultimate", "capstone", "invulnerability", "redirect", "crusader"]
    },
    rankUpgrades: []
  },
  {
    id: "cdb_t7_bastion_doctrine",
    name: "Bastion Doctrine",
    icon: "General/Guard",
    maxRanks: 5,
    position: { x: 0, y: 6 },
    requires: "cdb_t6_monolith_of_the_vigil",
    spell: {
      name: "Bastion Doctrine",
      description: "Passive — While you are adjacent to an ally, you both gain +1 Passive DR.",
      flavorText: "Every rank of the doctrine is another stone in the wall.",
      source: "talent", class: "Crusader", treeId: "dawn_bastion",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "holy", tags: ["passive", "doctrine", "guardian", "crusader"]
    },
    rankUpgrades: [
      { description: "The shared bonus becomes +2 Passive DR, and Starlight Interposition also grants the protected ally +2 Passive DR for 1 round." },
      { description: "The shared bonus becomes +3 Passive DR, and soaking damage for an ally generates +5 Fervor." },
      { description: "The shared bonus becomes +4 Passive DR, and allies you protect gain +2 on their Active Soak die rolls." },
      { description: "The shared bonus becomes +5 Passive DR, and allies you guard cannot be forced to move or knocked Prone." }
    ]
  },
  {
    id: "cdb_t7_vigil_reservoir",
    name: "Vigil Reservoir",
    icon: "Radiant/Divine Illumination",
    maxRanks: 3,
    position: { x: 0.75, y: 6 },
    requires: "cdb_t6_bastion_endurance",
    spell: {
      name: "Vigil Reservoir",
      description: "Passive — You enter combat with 25 Fervor, and standing on your own Consecrated Ground generates an additional +5 Fervor per round.",
      flavorText: "A fortress that stores the dawn inside its walls never truly sleeps.",
      source: "talent", class: "Crusader", treeId: "dawn_bastion",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self",
      visualTheme: "holy", tags: ["passive", "reservoir", "fervor-gen", "crusader"]
    },
    rankUpgrades: [
      { description: "You enter combat with 45 Fervor and the consecrated bonus becomes +10 per round." },
      { description: "You enter combat with 65 Fervor, and once you reach the Fervor cap, banking 80+ Fervor no longer inflicts Zealous Scorching." }
    ]
  },
  {
    id: "cdb_t7_eternal_vigil_vow",
    name: "Eternal Vigil Vow",
    icon: "Radiant/Sacred Symbol",
    maxRanks: 3,
    position: { x: 3.25, y: 6 },
    requires: "cdb_t6_consecration_engine",
    spell: {
      name: "Eternal Vigil Vow",
      description: "Passive — Your Active Soak dice explode on maximum rolls (roll an additional soak die), and Passive DR you grant to allies is doubled.",
      flavorText: "The vigil has lasted ten centuries. It will not break today.",
      source: "talent", class: "Crusader", treeId: "dawn_bastion",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "holy", tags: ["passive", "capstone-row", "exploding-dice", "crusader"]
    },
    rankUpgrades: [
      { description: "Exploding soak dice can chain indefinitely, and soaking 20+ damage in a single round refunds 1 AP on your next turn." },
      { description: "Allies protected by your auras and barriers gain an additional +3 Passive DR." }
    ]
  },
  {
    id: "cdb_t7_sacrifice_of_the_sun",
    name: "Sacrifice of the Sun",
    icon: "Radiant/Redemption",
    maxRanks: 3,
    position: { x: 4, y: 6 },
    requires: "cdb_t6_consecration_engine",
    spell: {
      name: "Sacrifice of the Sun",
      description: "Passive — Sacred Redirection and Starlight Interposition cost 10 less Fervor, and when you intercept damage for an ally, allies within 20 ft gain 10 temporary HP.",
      flavorText: "The sun spends itself so that others may keep their warmth.",
      source: "talent", class: "Crusader", treeId: "dawn_bastion",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "holy", tags: ["passive", "capstone-row", "interposition", "crusader"]
    },
    rankUpgrades: [
      { description: "Intercepts grant 20 temporary HP and +2 Passive DR for 1 round." },
      { description: "If an intercept would reduce you to 0 HP, you are instead left at 1 HP (once per combat)." }
    ]
  }
];
