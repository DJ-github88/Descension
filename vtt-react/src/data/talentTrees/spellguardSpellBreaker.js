// ============================================
// SPELLGUARD — SPELL BREAKER (v2: talents are spells)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50.
// ============================================

export const SPELLGUARD_SPELL_BREAKER = [
  {
    id: "sb_t1_reflective_barrier",
    name: "Reflective Barrier",
    icon: "spell_holy_dispelmagic",
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    spell: {
      name: "Reflective Barrier",
      description: "For 30 seconds, 25 points of the magical damage you take is reflected back at the attacker as arcane damage.",
      flavorText: "Return to sender. That is the whole art.",
      source: "talent", class: "Spellguard", treeId: "spell_breaker",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 12, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { aep: { baseAmount: 10 } },
      durationRounds: 3, durationRealTime: 30, durationUnit: "seconds",
      buffs: ["reflection"], damageTypes: ["arcane"], visualTheme: "arcane", tags: ["reflection", "defense", "spellguard"]
    },
    rankUpgrades: [
      { description: "For 30 seconds, 25 points of the magical damage you take is reflected back at the attacker as arcane damage, and you take 10 points less magical damage." },
      { description: "For 40 seconds, 25 points of the magical damage you take is reflected back at the attacker as arcane damage.", durationRounds: 4, durationRealTime: 40 }
    ]
  },
  {
    id: "sb_t1_spell_disruption",
    name: "Spell Disruption",
    icon: "spell_shadow_curseofachimonde",
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: null,
    spell: {
      name: "Spell Disruption",
      description: "Counter a spell being cast within 30 feet: the caster must succeed a saving throw or their spell fails.",
      flavorText: "Objection. Sustained.",
      source: "talent", class: "Spellguard", treeId: "spell_breaker",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "single", rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 10, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { aep: { baseAmount: 10 } },
      debuffs: ["counterspell"], visualTheme: "arcane", tags: ["counterspell", "interrupt", "spellguard"]
    },
    rankUpgrades: [
      { description: "Counter a spell being cast within 30 feet: the caster must succeed a saving throw or their spell fails. On a successful counter, you gain 5 AEP." },
      { description: "Counter a spell being cast within 30 feet: the caster must succeed a saving throw or their spell fails. On a successful counter, you gain 5 AEP and the caster is silenced for 1 turn." }
    ]
  },
  {
    id: "sb_t1_counter_magic",
    name: "Counter Magic",
    icon: "spell_arcane_blink",
    maxRanks: 2,
    position: { x: 3, y: 1 },
    requires: null,
    spell: {
      name: "Counter Magic",
      description: "Every successful counter or reflection feeds you: gain 2 additional AEP whenever you counter or reflect a spell.",
      flavorText: "Their rebuttal arrives as ammunition.",
      source: "talent", class: "Spellguard", treeId: "spell_breaker",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "resource", "aep", "spellguard"]
    },
    rankUpgrades: [
      { description: "Every successful counter or reflection feeds you: gain 4 additional AEP whenever you counter or reflect a spell." }
    ]
  },

  {
    id: "sb_t2_mirror_shield",
    name: "Mirror Shield",
    icon: "spell_holy_powerwordshield",
    maxRanks: 3,
    position: { x: 0, y: 3 },
    requires: "sb_t1_reflective_barrier",
    spell: {
      name: "Mirror Shield",
      description: "Raise a perfect mirror: the next 1 spell cast at you is reflected in full — damage and effects — back at its caster. Lasts 30 seconds.",
      flavorText: "The caster meets the only opponent they truly fear.",
      source: "talent", class: "Spellguard", treeId: "spell_breaker",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 20, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { aep: { baseAmount: 15 } },
      durationRounds: 3, durationRealTime: 30, durationUnit: "seconds",
      buffs: ["mirror-shield"], damageTypes: ["arcane"], visualTheme: "arcane", tags: ["reflection", "shield", "spellguard"]
    },
    rankUpgrades: [
      { description: "Raise a perfect mirror: the next 2 spells cast at you are reflected in full — damage and effects — back at their casters. Lasts 30 seconds." },
      { description: "Raise a perfect mirror: the next 3 spells cast at you are reflected in full — damage and effects — back at their casters. Lasts 30 seconds." }
    ]
  },
  {
    id: "sb_t2_echo_damage",
    name: "Echo Damage",
    icon: "spell_arcane_arcane03",
    maxRanks: 3,
    position: { x: 4, y: 3 },
    requires: "sb_t1_spell_disruption",
    spell: {
      name: "Echo Damage",
      description: "Reflected magic returns with interest: spells you reflect deal an additional 1d4 arcane damage to the caster.",
      flavorText: "The echo is always louder than the shout.",
      source: "talent", class: "Spellguard", treeId: "spell_breaker",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["arcane"],
      primaryDamage: { dice: "1d4", flat: 0, procChance: 100 },
      visualTheme: "arcane", tags: ["passive", "reflection", "damage", "spellguard"]
    },
    rankUpgrades: [
      { description: "Reflected magic returns with interest: spells you reflect deal an additional 1d6 arcane damage to the caster.", primaryDamage: { dice: "1d6", flat: 0, procChance: 100 } },
      { description: "Reflected magic returns with interest: spells you reflect deal an additional 1d8 arcane damage to the caster.", primaryDamage: { dice: "1d8", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "sb_t3_perfect_reflection",
    name: "Perfect Reflection",
    icon: "spell_holy_sealofprotection",
    maxRanks: 3,
    position: { x: 0, y: 4.5 },
    requires: "sb_t2_echo_damage",
    spell: {
      name: "Perfect Reflection",
      description: "Your mirrors admit no negotiation: reflected spells ignore the caster's resistances.",
      flavorText: "A perfect angle forgives nothing.",
      source: "talent", class: "Spellguard", treeId: "spell_breaker",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "reflection", "penetration", "spellguard"]
    },
    rankUpgrades: [
      { description: "Your mirrors admit no negotiation: reflected spells ignore the caster's resistances and deal 15% more damage." },
      { description: "Your mirrors admit no negotiation: reflected spells ignore the caster's resistances, deal 20% more damage, and cannot be countered." }
    ]
  },
  {
    id: "sb_t3_mana_burn",
    name: "Mana Burn",
    icon: "spell_fire_soulburn",
    maxRanks: 3,
    position: { x: 4, y: 4.5 },
    requires: "sb_t1_counter_magic",
    spell: {
      name: "Mana Burn",
      description: "Reflection scorches the source: when you reflect a spell, its caster loses 1d4 mana.",
      flavorText: "What they spent to hurt you, they spend again to fail.",
      source: "talent", class: "Spellguard", treeId: "spell_breaker",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", damageTypes: ["arcane"], visualTheme: "arcane", tags: ["passive", "reflection", "mana", "spellguard"]
    },
    rankUpgrades: [
      { description: "Reflection scorches the source: when you reflect a spell, its caster loses 2d4 mana." },
      { description: "Reflection scorches the source: when you reflect a spell, its caster loses 3d4 mana." }
    ]
  },

  {
    id: "sb_t4_mirror_field",
    name: "Mirror Field",
    icon: "spell_arcane_prismaticcloak",
    maxRanks: 2,
    position: { x: 0, y: 5.5 },
    requires: "sb_t2_mirror_shield",
    spell: {
      name: "Mirror Field",
      description: "Flood a 20-foot zone with hanging mirrors for 1 minute: allies inside reflect 25 points of magical damage they take back at attackers.",
      flavorText: "An ambush that attacks itself.",
      source: "talent", class: "Spellguard", treeId: "spell_breaker",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "aoe", rangeType: "ranged", range: 30, aoeShape: "circle", aoeSize: 20,
      castTimeType: "short", castTimeValue: 1.5,
      cooldownCategory: "long", cooldownValue: 45, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: true,
      resourceCosts: { aep: { baseAmount: 20 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      buffs: ["mirror-field"], damageTypes: ["arcane"], visualTheme: "arcane", tags: ["reflection", "aoe", "zone", "spellguard"]
    },
    rankUpgrades: [
      { description: "Flood a 20-foot zone with hanging mirrors for 1 minute: allies inside reflect 25 points of magical damage they take back at attackers, and each reflection grants you 3 AEP." }
    ]
  },
  {
    id: "sb_t4_spell_nullification",
    name: "Spell Nullification",
    icon: "spell_shadow_antimagicshell",
    maxRanks: 3,
    position: { x: 4, y: 5.5 },
    requires: "sb_t3_mana_burn",
    spell: {
      name: "Spell Nullification",
      description: "Refuse the spell entirely: counter a spell within 30 feet so completely that it is nullified, and you gain 5 AEP from its collapse.",
      flavorText: "Some arguments are not answered. They are dismissed.",
      source: "talent", class: "Spellguard", treeId: "spell_breaker",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "single", rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 15, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { aep: { baseAmount: 10 } },
      debuffs: ["counterspell"], visualTheme: "arcane", tags: ["counterspell", "nullify", "spellguard"]
    },
    rankUpgrades: [
      { description: "Refuse the spell entirely: counter a spell within 30 feet so completely that it is nullified, and you gain 8 AEP from its collapse." },
      { description: "Refuse the spell entirely: counter a spell within 30 feet so completely that it is nullified, and you gain 10 AEP from its collapse and silence its caster for 1 turn." }
    ]
  },

  {
    id: "sb_t5_unbreakable_mirror",
    name: "Unbreakable Mirror",
    icon: "inv_sword_39",
    maxRanks: 2,
    position: { x: 1, y: 5 },
    requires: "sb_t3_perfect_reflection",
    spell: {
      name: "Unbreakable Mirror",
      description: "Your reflective works are tempered beyond glass: you gain +2 Damage Reduction to magical damage.",
      flavorText: "Glass breaks. The idea of glass does not.",
      source: "talent", class: "Spellguard", treeId: "spell_breaker",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "resistance", "spellguard"]
    },
    rankUpgrades: [
      { description: "Your reflective works are tempered beyond glass: you gain +4 Damage Reduction to magical damage and immunity to blindness." }
    ]
  },
  {
    id: "sb_t5_reciprocal_ward",
    name: "Reciprocal Ward",
    icon: "spell_nature_thorns",
    maxRanks: 3,
    position: { x: 3, y: 5 },
    requires: "sb_t4_mirror_field",
    spell: {
      name: "Reciprocal Ward",
      description: "For 30 seconds, melee attackers who strike you take 1d6 arcane damage in return.",
      flavorText: "Touch the artwork. See what the artwork does.",
      source: "talent", class: "Spellguard", treeId: "spell_breaker",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 15, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { aep: { baseAmount: 10 } },
      durationRounds: 3, durationRealTime: 30, durationUnit: "seconds",
      damageTypes: ["arcane"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      buffs: ["retaliation"], visualTheme: "arcane", tags: ["retaliation", "defense", "spellguard"]
    },
    rankUpgrades: [
      { description: "For 30 seconds, melee attackers who strike you take 2d6 arcane damage in return.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } },
      { description: "For 30 seconds, melee attackers who strike you take 3d6 arcane damage in return and suffer -2 to their next attack roll.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "sb_t6_reflection_nova",
    name: "Reflection Nova",
    icon: "spell_arcane_blast",
    maxRanks: 1,
    position: { x: 1, y: 7 },
    requires: "sb_t4_mirror_field",
    spell: {
      name: "Reflection Nova",
      description: "Overload every mirror at once: until your next turn, all spells cast at you are automatically reflected, and at turn's end you release the stored energy as a nova dealing 4d6 arcane damage to all enemies within 30 feet.",
      flavorText: "Then the mirrors gave back everything at the same time.",
      source: "talent", class: "Spellguard", treeId: "spell_breaker",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 120, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { aep: { baseAmount: 30 } },
      damageTypes: ["arcane"],
      primaryDamage: { dice: "4d6", flat: 0, procChance: 100 },
      visualTheme: "arcane", tags: ["ultimate-defense", "reflection", "aoe", "nova", "spellguard"]
    }
  },
  {
    id: "sb_t6_mirror_soul",
    name: "Mirror Soul",
    icon: "spell_arcane_portalironforge",
    maxRanks: 2,
    position: { x: 2, y: 7 },
    requires: "sb_t5_unbreakable_mirror",
    spell: {
      name: "Mirror Soul",
      description: "You have become the surface itself: Reflective Barrier and Mirror Shield cost 5 fewer AEP to cast.",
      flavorText: "At some point, the mirror studied the mage.",
      source: "talent", class: "Spellguard", treeId: "spell_breaker",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "reflection", "cost", "spellguard"]
    },
    rankUpgrades: [
      { description: "You have become the surface itself: Reflective Barrier and Mirror Shield cost 10 fewer AEP to cast (minimum 5)." }
    ]
  },
  {
    id: "sb_t6_prismatic_shear",
    name: "Prismatic Shear",
    icon: "ability_mage_massdispel",
    maxRanks: 2,
    position: { x: 3, y: 7 },
    requires: "sb_t4_spell_nullification",
    spell: {
      name: "Prismatic Shear",
      description: "Counter a spell being cast within 30 feet; when the caster fails their save, the shear lashes them for 2d8 arcane damage in addition to disrupting the spell.",
      flavorText: "The counter is also a blade. Filing paperwork with an edge.",
      source: "talent", class: "Spellguard", treeId: "spell_breaker",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 20, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { aep: { baseAmount: 10 } },
      damageTypes: ["arcane"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      debuffs: ["counterspell"], visualTheme: "arcane", tags: ["counterspell", "damage", "spellguard"]
    },
    rankUpgrades: [
      { description: "Counter a spell being cast within 30 feet; when the caster fails their save, the shear lashes them for 4d8 arcane damage in addition to disrupting the spell.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "sb_t7_perfect_mirror",
    name: "Perfect Mirror",
    icon: "spell_arcane_polymorph",
    maxRanks: 1,
    position: { x: 0.5, y: 8 },
    requires: "sb_t6_reflection_nova",
    spell: {
      name: "Perfect Mirror",
      description: "ULTIMATE: For 1 round, every spell targeting you or allies within 30 feet is reflected at its caster with double damage and full effects.",
      flavorText: "For one round, the enemy army is you.",
      source: "talent", class: "Spellguard", treeId: "spell_breaker",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 180, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { aep: { baseAmount: 40 } },
      durationRounds: 1, durationRealTime: 6, durationUnit: "seconds",
      buffs: ["perfect-mirror"], damageTypes: ["arcane"], visualTheme: "arcane", tags: ["ultimate", "capstone", "reflection", "aoe", "spellguard"]
    }
  },
  {
    id: "sb_t7_mirror_mastery",
    name: "Mirror Mastery",
    icon: "inv_misc_gem_01",
    maxRanks: 5,
    position: { x: 1.5, y: 8 },
    requires: "sb_t6_mirror_soul",
    spell: {
      name: "Mirror Mastery",
      description: "Every surface serves the doctrine: all reflected damage you deal is increased by +1d6 damage.",
      flavorText: "Angles within angles.",
      source: "talent", class: "Spellguard", treeId: "spell_breaker",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "capstone", "reflection", "damage", "spellguard"]
    },
    rankUpgrades: [
      { description: "Every surface serves the doctrine: all reflected damage you deal is increased by +1d8 damage." },
      { description: "Every surface serves the doctrine: all reflected damage you deal is increased by +1d8 damage." },
      { description: "Every surface serves the doctrine: all reflected damage you deal is increased by +2d8 damage." },
      { description: "Every surface serves the doctrine: all reflected damage you deal is increased by +2d8 damage." }
    ]
  },
  {
    id: "sb_t7_arcane_retribution",
    name: "Arcane Retribution",
    icon: "spell_arcane_arcane02",
    maxRanks: 3,
    position: { x: 2.5, y: 8 },
    requires: "sb_t6_mirror_soul",
    spell: {
      name: "Arcane Retribution",
      description: "Your wards die loudly: when one of your shields is destroyed, it detonates for 2d6 arcane damage to all enemies within 15 feet.",
      flavorText: "Breaking it was the easy part.",
      source: "talent", class: "Spellguard", treeId: "spell_breaker",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["arcane"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      visualTheme: "arcane", tags: ["passive", "capstone", "retaliation", "aoe", "spellguard"]
    },
    rankUpgrades: [
      { description: "Your wards die loudly: when one of your shields is destroyed, it detonates for 3d6 arcane damage to all enemies within 15 feet.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } },
      { description: "Your wards die loudly: when one of your shields is destroyed, it detonates for 4d6 arcane damage to all enemies within 20 feet.", primaryDamage: { dice: "4d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "sb_t7_thousand_faces",
    name: "Thousand Faces",
    icon: "spell_magic_lesserinvisibilty",
    maxRanks: 3,
    position: { x: 3.5, y: 8 },
    requires: "sb_t6_prismatic_shear",
    spell: {
      name: "Thousand Faces",
      description: "Split into 2 mirror images for 1 minute. Each image automatically dodges one spell targeted at you, then shatters, dealing 1d8 arcane damage to the caster.",
      flavorText: "Which of us cast the counter-spell? Wrong.",
      source: "talent", class: "Spellguard", treeId: "spell_breaker",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 60, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { aep: { baseAmount: 20 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      buffs: ["mirror-image"], damageTypes: ["arcane"], visualTheme: "arcane", tags: ["capstone", "images", "defense", "spellguard"]
    },
    rankUpgrades: [
      { description: "Split into 3 mirror images for 1 minute. Each image automatically dodges one spell targeted at you, then shatters, dealing 1d8 arcane damage to the caster." },
      { description: "Split into 4 mirror images for 1 minute. Each image automatically dodges one spell targeted at you, then shatters, dealing 2d8 arcane damage to the caster." }
    ]
  },
  {
    id: "sb_t7_eternal_vigil",
    name: "Eternal Vigil",
    icon: "spell_arcane_focusedpower",
    maxRanks: 3,
    position: { x: 2, y: 7.5 },
    requires: "sb_t6_prismatic_shear",
    spell: {
      name: "Eternal Vigil",
      description: "You stand watch beyond exhaustion: your maximum AEP increases by 5.",
      flavorText: "Someone must remain facing the door.",
      source: "talent", class: "Spellguard", treeId: "spell_breaker",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "capstone", "resource", "aep", "spellguard"]
    },
    rankUpgrades: [
      { description: "You stand watch beyond exhaustion: your maximum AEP increases by 10." },
      { description: "You stand watch beyond exhaustion: your maximum AEP increases by 15, and your first counter or reflection each combat costs no AEP." }
    ]
  }
];
