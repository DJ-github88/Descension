// ============================================
// BERSERKER — SAVAGE (v2: talents are spells)
// Spec: Hemorrhagic Ruin, High-Heat Burst, Self-Damage Scaling, Near-Death Executes
// Resource: Blood-Heat (0-100)
// ============================================

export const BERSERKER_SAVAGE = [
  // ─── TIER 1 (y: 0) ───
  {
    id: "bsv_t1_hunger_pact",
    name: "Hunger Pact Ignition",
    icon: "ability_warrior_bloodrage",
    maxRanks: 3,
    position: { x: 0.5, y: 0 },
    requires: null,
    spell: {
      name: "Hunger Pact Ignition",
      description: "Passive: Your ancestral starvation flares. Generate +50% more Blood-Heat from all attacks, and taking damage generates 1 Heat per 3 damage suffered.",
      flavorText: "The copper taste of kin-blood in the marrow.",
      source: "talent", class: "Berserker", treeId: "savage",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "blood", tags: ["passive", "builder", "blood-heat", "berserker"]
    },
    rankUpgrades: [
      { description: "Generate +75% more Blood-Heat from all attacks; melee strikes deal +1d4 slicing bonus damage.", primaryDamage: { dice: "1d4", flat: 0, procChance: 100 } },
      { description: "Generate +100% more Blood-Heat; critical hits grant an immediate +15 Blood-Heat and deal +1d8 slicing.", primaryDamage: { dice: "1d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "bsv_t1_reckless_slash",
    name: "Reckless Abandon",
    icon: "ability_rogue_eviscerate",
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    spell: {
      name: "Reckless Abandon",
      description: "Spend 1 AP & 5 HP: Split your own flesh to generate 20 Blood-Heat and strike with wild fury for 1d10 slicing + 1d6 smashing damage.",
      flavorText: "Pain is merely kinetic momentum waiting for direction.",
      source: "talent", class: "Berserker", treeId: "savage",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 1, targetingMode: "single", rangeType: "melee", range: 5,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 0, cooldownUnit: "round",
      damageTypes: ["slicing", "smashing"],
      primaryDamage: { dice: "1d10", flat: 0, procChance: 100 },
      secondaryDamage: { dice: "1d6", flat: 0, procChance: 100, damageType: "smashing" },
      visualTheme: "blood", tags: ["melee", "self-damage", "builder", "berserker"]
    },
    rankUpgrades: [
      { description: "Damage increases to 2d8 slicing + 1d8 smashing; generates 25 Blood-Heat.", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 }, secondaryDamage: { dice: "1d8", flat: 0, procChance: 100, damageType: "smashing" } },
      { description: "Damage increases to 2d10 slicing + 2d6 smashing; critical hits cost no HP and refund 1 AP.", primaryDamage: { dice: "2d10", flat: 0, procChance: 100 }, secondaryDamage: { dice: "2d6", flat: 0, procChance: 100, damageType: "smashing" } }
    ]
  },
  {
    id: "bsv_t1_frenzied_sprint",
    name: "Boiling Momentum",
    icon: "ability_warrior_charge",
    maxRanks: 2,
    position: { x: 3.5, y: 0 },
    requires: null,
    spell: {
      name: "Boiling Momentum",
      description: "Passive: Gain +5 ft movement speed. While in High-Heat (50+ Blood-Heat), you gain Advantage on checks to avoid or break grapples and difficult terrain costs no extra movement.",
      flavorText: "He runs like the blizzard is at his throat.",
      source: "talent", class: "Berserker", treeId: "savage",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "blood", tags: ["passive", "mobility", "heat-scaling", "berserker"]
    },
    rankUpgrades: [
      { description: "Movement speed bonus increases to +10 ft; at 75+ Blood-Heat you can charge through enemy squares freely." }
    ]
  },

  // ─── TIER 2 (y: 1) ───
  {
    id: "bsv_t2_hemorrhagic_cleave",
    name: "Hemorrhagic Cleave",
    icon: "ability_warrior_cleave",
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: "bsv_t1_hunger_pact",
    spell: {
      name: "Hemorrhagic Cleave",
      description: "Spend 2 AP & 20 Heat: Cleave in a 10 ft cone dealing 2d8 slicing damage and applying a 1d6 Bleed for 2 rounds to all foes struck.",
      flavorText: "Open the veins. Let Nordhalla's snow turn red.",
      source: "talent", class: "Berserker", treeId: "savage",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 2, targetingMode: "cone", rangeType: "melee", range: 10,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 1, cooldownUnit: "round",
      damageTypes: ["slicing"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      visualTheme: "blood", tags: ["cone", "aoe", "bleed", "spender", "berserker"]
    },
    rankUpgrades: [
      { description: "Damage increases to 3d8 slicing and Bleed increases to 2d6 per round.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } },
      { description: "Damage increases to 4d8 slicing; enemies bleeding from this attack take +20% damage from your single-target attacks.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "bsv_t2_meat_cleaver",
    name: "Sundering Hack",
    icon: "ability_warrior_sunder",
    maxRanks: 3,
    position: { x: 2.5, y: 1 },
    requires: "bsv_t1_reckless_slash",
    spell: {
      name: "Sundering Hack",
      description: "Passive: Spending 25+ Blood-Heat shreds 3 Passive DR from the target for 2 rounds, stacking up to 2 times.",
      flavorText: "Hacking bone until armor falls off the frame.",
      source: "talent", class: "Berserker", treeId: "savage",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "single",
      visualTheme: "blood", tags: ["passive", "armor-shred", "berserker"]
    },
    rankUpgrades: [
      { description: "Armor shred increases to -5 Passive DR per stack, stacking up to 3 times." },
      { description: "At maximum stacks, the target takes 2d8 slicing damage whenever it attempts an attack." }
    ]
  },

  // ─── TIER 3 (y: 2) ───
  {
    id: "bsv_t3_unbridled_adrenaline",
    name: "Unbridled Adrenaline",
    icon: "spell_shadow_deathpact",
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: "bsv_t2_hemorrhagic_cleave",
    spell: {
      name: "Unbridled Adrenaline",
      description: "Passive: When your health drops below 30%, your strikes completely bypass enemy physical resistances and deal +25% bonus critical damage.",
      flavorText: "The brink of death is where the Savage truly awakens.",
      source: "talent", class: "Berserker", treeId: "savage",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "blood", tags: ["passive", "near-death", "armor-ignore", "berserker"]
    },
    rankUpgrades: [
      { description: "Threshold expands to below 40% health, and critical damage bonus increases to +40%." },
      { description: "Threshold expands to below 50% health; while below 30% health, your attacks cannot miss." }
    ]
  },
  {
    id: "bsv_t3_blood_frenzy_surge",
    name: "Red Mist Surge",
    icon: "ability_druid_enrage",
    maxRanks: 2,
    position: { x: 2.5, y: 2 },
    requires: "bsv_t2_meat_cleaver",
    spell: {
      name: "Red Mist Surge",
      description: "Spend 1 AP: Instantly jump to 75 Blood-Heat at the cost of 10% max HP. For 2 rounds, gain +1 extra attack per round.",
      flavorText: "A red veil descends. Thinking stops; butchery commences.",
      source: "talent", class: "Berserker", treeId: "savage",
      spellType: "ACTIVE", category: "buff",
      actionPoints: 1, targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 3, cooldownUnit: "round",
      visualTheme: "blood", tags: ["self-damage", "burst-heat", "extra-attack", "berserker"]
    },
    rankUpgrades: [
      { description: "HP cost reduced to 5% max HP, and gain +2d6 bonus slicing damage on all strikes during the surge.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } }
    ]
  },

  // ─── TIER 4 (y: 3) ───
  {
    id: "bsv_t4_decapitating_strike",
    name: "Decapitating Strike",
    icon: "ability_warrior_decapitate",
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: "bsv_t3_unbridled_adrenaline",
    spell: {
      name: "Decapitating Strike",
      description: "Spend 2 AP & 40 Heat: Overhead executioner blow dealing 4d10 slicing damage. Against targets below 30% HP, damage is doubled.",
      flavorText: "Sever the neck before the scream forms.",
      source: "talent", class: "Berserker", treeId: "savage",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 2, targetingMode: "single", rangeType: "melee", range: 5,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 2, cooldownUnit: "round",
      damageTypes: ["slicing"],
      primaryDamage: { dice: "4d10", flat: 0, procChance: 100 },
      visualTheme: "blood", tags: ["execute", "burst", "spender", "berserker"]
    },
    rankUpgrades: [
      { description: "Damage increases to 5d10 slicing, and execute threshold expands to below 40% HP.", primaryDamage: { dice: "5d10", flat: 0, procChance: 100 } },
      { description: "Damage increases to 7d10 slicing; killing a foe instantly resets this ability's cooldown and refunds 40 Heat.", primaryDamage: { dice: "7d10", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "bsv_t4_flesh_harvest",
    name: "Flesh Feast",
    icon: "spell_shadow_lifedrain",
    maxRanks: 3,
    position: { x: 2.5, y: 3 },
    requires: "bsv_t3_blood_frenzy_surge",
    spell: {
      name: "Flesh Feast",
      description: "Passive: Whenever you kill a creature or score a critical strike with a slicing attack, heal for 15% of the damage dealt.",
      flavorText: "The Skald feast never ends. Every corpse feeds the march.",
      source: "talent", class: "Berserker", treeId: "savage",
      spellType: "PASSIVE", category: "heal",
      targetingMode: "self",
      visualTheme: "blood", tags: ["passive", "lifesteal", "sustain", "berserker"]
    },
    rankUpgrades: [
      { description: "Healing increases to 25% of damage dealt and also restores 10 Blood-Heat." },
      { description: "Healing increases to 35% of damage dealt; excess healing is converted into temporary Grit shielding." }
    ]
  },

  // ─── TIER 5 (y: 4) ───
  {
    id: "bsv_t5_caldera_combustion",
    name: "Caldera Eruption",
    icon: "spell_fire_incinerate",
    maxRanks: 3,
    position: { x: 1, y: 4 },
    requires: "bsv_t4_decapitating_strike",
    spell: {
      name: "Caldera Eruption",
      description: "Passive: While at 80+ Blood-Heat, all your melee strikes erupt with volcanic heat: deal +2d8 ember damage and ignite enemies for 1d8 ember per round for 2 rounds.",
      flavorText: "The blood does not merely flow; it boils into slag.",
      source: "talent", class: "Berserker", treeId: "savage",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["ember"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      visualTheme: "fire", tags: ["passive", "fire-burst", "ignite", "berserker"]
    },
    rankUpgrades: [
      { description: "Eruption damage increases to +3d8 ember and ignite deals 2d8 ember per round.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } },
      { description: "Eruption damage increases to +4d8 ember; burning enemies take +20% damage from all slicing attacks." }
    ]
  },
  {
    id: "bsv_t5_berserk_resilience",
    name: "Pain-Driven Fury",
    icon: "ability_warrior_endlessrage",
    maxRanks: 2,
    position: { x: 2.5, y: 4 },
    requires: "bsv_t4_flesh_harvest",
    spell: {
      name: "Pain-Driven Fury",
      description: "Passive: You cannot be Stunned or Incapacitated while above 50 Blood-Heat. Taking critical hits grants +30 Blood-Heat.",
      flavorText: "Concussion is merely another reason to swing harder.",
      source: "talent", class: "Berserker", treeId: "savage",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "blood", tags: ["passive", "cc-immunity", "berserker"]
    },
    rankUpgrades: [
      { description: "You are also immune to Fear, Charm, and Sleep while above 50 Blood-Heat; critical hits taken grant +50 Blood-Heat." }
    ]
  },

  // ─── TIER 6 (y: 5) ───
  {
    id: "bsv_t6_whirlwind_of_ruin",
    name: "Whirlwind of Ruin",
    icon: "ability_whirlwind",
    maxRanks: 3,
    position: { x: 1, y: 5 },
    requires: "bsv_t5_caldera_combustion",
    spell: {
      name: "Whirlwind of Ruin",
      description: "Spend 3 AP & 60 Heat: Spin in a 15 ft radius death cyclone dealing 6d8 slicing + 4d6 ember damage. Hits apply Hemorrhagic Cleave's Bleed to all targets.",
      flavorText: "Two axes, six corpses, zero hesitation.",
      source: "talent", class: "Berserker", treeId: "savage",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 3, targetingMode: "aoe", rangeType: "self-centered", range: 15,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 3, cooldownUnit: "round",
      damageTypes: ["slicing", "ember"],
      primaryDamage: { dice: "6d8", flat: 0, procChance: 100 },
      secondaryDamage: { dice: "4d6", flat: 0, procChance: 100, damageType: "ember" },
      visualTheme: "blood", tags: ["aoe", "whirlwind", "cyclone", "berserker"]
    },
    rankUpgrades: [
      { description: "Damage increases to 8d8 slicing + 6d6 ember, and radius extends to 20 ft.", primaryDamage: { dice: "8d8", flat: 0, procChance: 100 }, secondaryDamage: { dice: "6d6", flat: 0, procChance: 100, damageType: "ember" } },
      { description: "Damage increases to 10d8 slicing + 8d6 ember; every target killed extends your current round's Action Points by +1.", primaryDamage: { dice: "10d8", flat: 0, procChance: 100 }, secondaryDamage: { dice: "8d6", flat: 0, procChance: 100, damageType: "ember" } }
    ]
  },
  {
    id: "bsv_t6_limitless_heat",
    name: "Limitless Furnace",
    icon: "spell_fire_soulburn",
    maxRanks: 2,
    position: { x: 2.5, y: 5 },
    requires: "bsv_t5_berserk_resilience",
    spell: {
      name: "Limitless Furnace",
      description: "Passive: Maximum Blood-Heat increased to 125. Overheat / Metabolic Burnout penalties are halved.",
      flavorText: "His heart was forged to withstand a caldera.",
      source: "talent", class: "Berserker", treeId: "savage",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "blood", tags: ["passive", "cap-increase", "burnout-mitigation", "berserker"]
    },
    rankUpgrades: [
      { description: "Maximum Blood-Heat increased to 150, and you are completely immune to Metabolic Burnout penalties." }
    ]
  },

  // ─── TIER 7 (Capstone Row, y: 6) ───
  {
    id: "bsv_t7_avatar_of_the_hunger_pact",
    name: "Avatar of the Hunger Pact",
    icon: "ability_rogue_bloodyeye",
    maxRanks: 1,
    position: { x: 1, y: 6 },
    requires: "bsv_t6_whirlwind_of_ruin",
    spell: {
      name: "Avatar of the Hunger Pact",
      description: "CAPSTONE — Spend 3 AP & 100 Heat: Surrender body entirely to the ancestral Hunger for 3 rounds. Health cannot drop below 1 HP, melee weapon range increases by 5 ft, every strike triggers an automatic Decapitating Strike execute regardless of target HP, and slicing damage dealt is converted 50% into health.",
      flavorText: "Grum Bloodhammer stands in his skin. The ancestors take the wheel.",
      source: "talent", class: "Berserker", treeId: "savage",
      spellType: "ACTIVE", category: "buff",
      actionPoints: 3, targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "once_per_combat", cooldownValue: 1, cooldownUnit: "combat",
      durationRounds: 3,
      visualTheme: "blood", tags: ["capstone", "ultimate", "undying", "frenzy", "berserker"]
    },
    rankUpgrades: []
  },
  {
    id: "bsv_t7_relentless_massacre",
    name: "Relentless Massacre",
    icon: "ability_warrior_bloodrage",
    maxRanks: 2,
    position: { x: 2.5, y: 6 },
    requires: "bsv_t6_limitless_heat",
    spell: {
      name: "Relentless Massacre",
      description: "Passive: Landing a killing blow instantly grants 2 Action Points and resets the cooldown on all Savage offensive abilities.",
      flavorText: "One falls. Two more step up to die.",
      source: "talent", class: "Berserker", treeId: "savage",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "blood", tags: ["passive", "capstone-row", "ap-reset", "snowball", "berserker"]
    },
    rankUpgrades: [
      { description: "Also grants +100% critical strike chance on your next attack after scoring a kill." }
    ]
  }
];
