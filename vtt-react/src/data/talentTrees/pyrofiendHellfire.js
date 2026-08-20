// ============================================
// PYROFIEND — HELLFIRE (v2: talents are spells)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50.
// Resource: Vengeance Points (VP) / Inferno Levels. The drain tree: agony, vitality, demon form, soul chains.
// ============================================

export const PYROFIEND_HELLFIRE = [
  {
    id: "hf_t1_ember_resilience",
    name: "Ember Resilience",
    icon: "spell_shadow_shadowwordpain",
    maxRanks: 3,
    position: { x: 1.5, y: 0 },
    requires: null,
    spell: {
      name: "Ember Resilience",
      description: "The Wyrd-touched core within you mends flesh even as it burns. You gain 2 health each time you ascend an Inferno Level, and ember damage cannot reduce you below 1 health.",
      flavorText: "The fire that lives in you pays rent in skin.",
      source: "talent", class: "Pyrofiend", treeId: "hellfire",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["ember"],
      visualTheme: "fire", tags: ["passive", "survival", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "The Wyrd-touched core within you mends flesh even as it burns. You gain 4 health each time you ascend an Inferno Level, and ember damage cannot reduce you below 1 health." },
      { description: "The Wyrd-touched core within you mends flesh even as it burns. You gain 6 health each time you ascend an Inferno Level, and ember damage cannot reduce you below 1 health." }
    ]
  },
  {
    id: "hf_t1_soul_fire",
    name: "Soul Fire",
    icon: "spell_fire_soulburn",
    maxRanks: 3,
    position: { x: 0.5, y: 0 },
    requires: null,
    spell: {
      name: "Soul Fire",
      description: "Ember hunger infuses every spark you cast, each flame a leech upon the soul. Your ember spells deal 1d4 additional ember damage, and you heal for 25% of the ember damage you deal.",
      flavorText: "Every flame is a mouth.",
      source: "talent", class: "Pyrofiend", treeId: "hellfire",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["ember"],
      primaryDamage: { dice: "1d4", flat: 0, procChance: 100 },
      visualTheme: "fire", tags: ["passive", "lifesteal", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "Ember hunger infuses every spark you cast, each flame a leech upon the soul. Your ember spells deal 1d6 additional ember damage, and you heal for 25% of the ember damage you deal.", primaryDamage: { dice: "1d6", flat: 0, procChance: 100 } },
      { description: "Ember hunger infuses every spark you cast, each flame a leech upon the soul. Your ember spells deal 1d8 additional ember damage, and you heal for 40% of the ember damage you deal.", primaryDamage: { dice: "1d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "hf_t1_dark_empowerment",
    name: "Dark Empowerment",
    icon: "spell_shadow_soulburn",
    maxRanks: 2,
    position: { x: 3.5, y: 0 },
    requires: null,
    spell: {
      name: "Dark Empowerment",
      description: "Every wound is a step deeper into Abyssal power. When you take ember damage, ascend 1 Inferno Level.",
      flavorText: "The Abyss rewards attendance.",
      source: "talent", class: "Pyrofiend", treeId: "hellfire",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["ember"],
      visualTheme: "fire", tags: ["passive", "ascent", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "Every wound is a step deeper into Abyssal power. When you take ember damage, ascend 1 Inferno Level, and when you take non-ember damage, reduce your next Inferno drawback self-damage by 1d6." }
    ]
  },

  {
    id: "hf_t2_drain_life",
    name: "Drain Life",
    icon: "spell_shadow_lifedrain",
    maxRanks: 3,
    position: { x: 3, y: 1.5 },
    requires: "hf_t1_ember_resilience",
    spell: {
      name: "Drain Life",
      description: "The Abyss teaches you to take what burns, making their agony your vitality. Deal 3d6 ember damage to a target within 60 feet and heal for the damage dealt.",
      flavorText: "Generosity, reversed.",
      source: "talent", class: "Pyrofiend", treeId: "hellfire",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "ranged", range: 60,
      castTimeType: "short", castTimeValue: 1.5,
      cooldownCategory: "medium", cooldownValue: 12, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: true,
      resourceCosts: { mana: { baseAmount: 15 } },
      damageTypes: ["ember"],
      primaryDamage: { dice: "3d6", flat: 0, procChance: 100 },
      visualTheme: "fire", tags: ["drain", "healing", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "The Abyss teaches you to take what burns, making their agony your vitality. Deal 4d6 ember damage to a target within 60 feet and heal for the damage dealt.", primaryDamage: { dice: "4d6", flat: 0, procChance: 100 } },
      { description: "The Abyss teaches you to take what burns, making their agony your vitality. Deal 6d6 ember damage to a target within 60 feet and heal for 125% of the damage dealt.", primaryDamage: { dice: "6d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "hf_t2_cinderward",
    name: "Cinderward",
    icon: "spell_fire_twilightfireward",
    maxRanks: 3,
    position: { x: 2.5, y: 1.5 },
    requires: "hf_t1_soul_fire",
    spell: {
      name: "Cinderward",
      description: "Abyssal flames coalesce into a barrier of Wyrd-touched protection. When you ascend to a new Inferno Level, gain a shield absorbing 2d6 damage per level reached.",
      flavorText: "Every promotion comes with benefits.",
      source: "talent", class: "Pyrofiend", treeId: "hellfire",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "fire", tags: ["passive", "shield", "ascent", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "Abyssal flames coalesce into a barrier of Wyrd-touched protection. When you ascend to a new Inferno Level, gain a shield absorbing 3d6 damage per level reached." },
      { description: "Abyssal flames coalesce into a barrier of Wyrd-touched protection. When you ascend to a new Inferno Level, gain a shield absorbing 4d6 damage per level reached; when the shield breaks, it deals its remaining absorb as ember damage to nearby enemies." }
    ]
  },
  {
    id: "hf_t2_soul_link",
    name: "Soul Link",
    icon: "spell_shadow_soulburn",
    maxRanks: 3,
    position: { x: 2, y: 1.5 },
    requires: "hf_t1_drain_life",
    spell: {
      name: "Soul Link",
      description: "Ember chains of Abyssal fire bind your soul to theirs. Link to an enemy within 60 feet for 1 minute: roll 1d6 when they take damage — on 4+, you heal 1d6.",
      flavorText: "Marriage of inconvenience.",
      source: "talent", class: "Pyrofiend", treeId: "hellfire",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "single", rangeType: "ranged", range: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 20, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 12 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      healing: { dice: "1d6", flat: 0 },
      buffs: ["soul-link"], visualTheme: "fire", tags: ["link", "lifesteal", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "Ember chains of Abyssal fire bind your soul to theirs. Link to an enemy within 60 feet for 1 minute: roll 1d6 when they take damage — on 4+, you heal 2d6.", healing: { dice: "2d6", flat: 0 } },
      { description: "Ember chains of Abyssal fire bind your soul to theirs. Link to an enemy within 60 feet for 1 minute: when they take damage, you heal 2d6 (no roll needed).", healing: { dice: "2d6", flat: 0 } }
    ]
  },

  {
    id: "hf_t3_demon_form",
    name: "Demon Form",
    icon: "spell_shadow_metamorphosis",
    maxRanks: 3,
    position: { x: 1, y: 2.5 },
    requires: "hf_t2_soul_link",
    spell: {
      name: "Demon Form",
      description: "Emberspire's true children shed their mortal guise. Transform for 1 minute: +2 Durability Steps to equipped durability, +1 to all saves, regenerate 1d8 health per round. Costs 2 Inferno Levels.",
      flavorText: "The guise was the disguise.",
      source: "talent", class: "Pyrofiend", treeId: "hellfire",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 120, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { infernoLevel: { baseAmount: 2 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      healing: { dice: "1d8", flat: 0, isHoT: true, hotDuration: 6, hotTick: "1d8" },
      buffs: ["demon-form"], visualTheme: "fire", tags: ["transform", "regen", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "Emberspire's true children shed their mortal guise. Transform for 1 minute: +4 Durability Steps to equipped durability, +2 to all saves, regenerate 2d8 health per round. Costs 2 Inferno Levels.", healing: { dice: "2d8", flat: 0, isHoT: true, hotDuration: 6, hotTick: "2d8" } },
      { description: "Emberspire's true children shed their mortal guise. Transform for 1 minute: +6 Durability Steps to equipped durability, +3 to all saves, regenerate 3d8 health per round, and your melee strikes deal +1d8 ember damage. Costs 2 Inferno Levels.", healing: { dice: "3d8", flat: 0, isHoT: true, hotDuration: 6, hotTick: "3d8" }, damageTypes: ["ember"], primaryDamage: { dice: "1d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "hf_t3_dark_barrier",
    name: "Dark Barrier",
    icon: "spell_shadow_antishadow",
    maxRanks: 2,
    position: { x: 4, y: 2.5 },
    requires: "hf_t3_demon_form",
    spell: {
      name: "Dark Barrier",
      description: "The Abyss radiates from you, a field of pure Wyrd-touched dread that breaks mortal will. Enemies within 15 feet have disadvantage on saving throws against your ember effects.",
      flavorText: "Willpower is flammable near you.",
      source: "talent", class: "Pyrofiend", treeId: "hellfire",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", visualTheme: "fire", tags: ["passive", "aura", "penetration", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "The Abyss radiates from you, a field of pure Wyrd-touched dread that breaks mortal will. Enemies within 30 feet have disadvantage on saving throws against your ember effects." }
    ]
  },
  {
    id: "hf_t3_hellish_aura",
    name: "Hellish Aura",
    icon: "spell_shadow_shadowwordpain",
    maxRanks: 3,
    position: { x: 0, y: 2.5 },
    requires: "hf_t3_demon_form",
    spell: {
      name: "Hellish Aura",
      description: "Your mere presence becomes a weapon. Enemies within 20 feet take 1d6 ember damage at the start of your turn and have -1 to attack rolls.",
      flavorText: "Atmosphere, weaponized.",
      source: "talent", class: "Pyrofiend", treeId: "hellfire",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["ember"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "fire", tags: ["passive", "aura", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "Your mere presence becomes a weapon. Enemies within 20 feet take 2d6 ember damage at the start of your turn and have -2 to attack rolls.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } },
      { description: "Your mere presence becomes a weapon. Enemies within 30 feet take 3d6 ember damage at the start of your turn and have -3 to attack rolls.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "hf_t4_eternal_torment",
    name: "Eternal Torment",
    icon: "spell_shadow_requiem",
    maxRanks: 2,
    position: { x: 0, y: 3.5 },
    requires: "hf_t3_dark_barrier",
    spell: {
      name: "Eternal Torment",
      description: "Death by your hand is never clean. Enemies killed by your ember damage explode, dealing 2d6 ember damage to enemies within 10 feet.",
      flavorText: "Funeral arrangements, abbreviated.",
      source: "talent", class: "Pyrofiend", treeId: "hellfire",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["ember"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      visualTheme: "fire", tags: ["passive", "execution", "explode", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "Death by your hand is never clean. Enemies killed by your ember damage explode, dealing 3d6 ember damage to enemies within 15 feet, and each explosion heals you 1d4.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "hf_t4_fear_realm",
    name: "Fear Realm",
    icon: "spell_shadow_shadowwordpain",
    maxRanks: 1,
    position: { x: 0.5, y: 3.5 },
    requires: "hf_t3_hellish_aura",
    spell: {
      name: "Fear Realm",
      description: "Emberspire nightmares bleed into reality. Create a 40-foot zone of terror within 60 feet for 3 rounds: enemies inside must save or be frightened, and take 2d6 wyrd damage per round.",
      flavorText: "Nightmare, zoned and permitted.",
      source: "talent", class: "Pyrofiend", treeId: "hellfire",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "aoe", rangeType: "ranged", range: 60, aoeShape: "circle", aoeSize: 40,
      castTimeType: "short", castTimeValue: 2,
      cooldownCategory: "long", cooldownValue: 60, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: true,
      resourceCosts: { mana: { baseAmount: 30 } },
      durationRounds: 3, durationRealTime: 18, durationUnit: "seconds",
      damageTypes: ["wyrd"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      isDot: true, dotDuration: 3, dotTick: "2d6",
      debuffs: ["frightened"], visualTheme: "fire", tags: ["zone", "fear", "pyrofiend"]
    }
  },

  {
    id: "hf_t5_soul_harvest",
    name: "Soul Harvest",
    icon: "spell_shadow_soulburn",
    maxRanks: 2,
    position: { x: 1, y: 4.5 },
    requires: "hf_t3_hellish_aura",
    spell: {
      name: "Soul Harvest",
      description: "The Abyss demands tribute, and you deliver souls by the handful. Consume the souls of all enemies in a 30-foot radius: deal 3d8 ember damage to each and heal for the total damage dealt. Costs 2 Inferno Levels.",
      flavorText: "Bulk rates apply.",
      source: "talent", class: "Pyrofiend", treeId: "hellfire",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 30,
      castTimeType: "short", castTimeValue: 2,
      cooldownCategory: "long", cooldownValue: 60, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: false, interruptible: true,
      resourceCosts: { infernoLevel: { baseAmount: 2 }, mana: { baseAmount: 10 } },
      damageTypes: ["ember"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      visualTheme: "fire", tags: ["drain", "aoe", "healing", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "The Abyss demands tribute, and you deliver souls by the handful. Consume the souls of all enemies in a 40-foot radius: deal 5d8 ember damage to each and heal for 150% of the total damage dealt. Costs 2 Inferno Levels.", primaryDamage: { dice: "5d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "hf_t5_demonic_dominion",
    name: "Demonic Dominion",
    icon: "spell_shadow_antishadow",
    maxRanks: 2,
    position: { x: 1.5, y: 4.5 },
    requires: "hf_t4_eternal_torment",
    spell: {
      name: "Demonic Dominion",
      description: "Emberspire's legions heed your command. Your summoned demons gain +2 to all rolls and deal +1d6 ember damage.",
      flavorText: "Management has its privileges.",
      source: "talent", class: "Pyrofiend", treeId: "hellfire",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["ember"],
      visualTheme: "fire", tags: ["passive", "summon", "buff", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "Emberspire's legions heed your command. Your summoned demons gain +4 to all rolls, deal +2d6 ember damage, and share your Soul Fire healing." }
    ]
  },

  {
    id: "hf_t6_immortal",
    name: "Immortal",
    icon: "spell_shadow_requiem",
    maxRanks: 3,
    position: { x: 1.5, y: 5.5 },
    requires: "hf_t4_fear_realm",
    spell: {
      name: "Immortal",
      description: "Emberspire's gift of undeath keeps you standing when all others fall to ash. At Inferno Level 5 or higher, you cannot die from health loss; instead you persist at 1 health. This does not protect against the Demon's Bargain.",
      flavorText: "Death got tired of the paperwork.",
      source: "talent", class: "Pyrofiend", treeId: "hellfire",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "fire", tags: ["passive", "survival", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "Emberspire's gift of undeath keeps you standing when all others fall to ash. At Inferno Level 4 or higher, you cannot die from health loss; instead you persist at 1 health. This does not protect against the Demon's Bargain." },
      { description: "Emberspire's gift of undeath keeps you standing when all others fall to ash. At Inferno Level 3 or higher, you cannot die from health loss; instead you persist at 1 health and immediately regain 10 health once per combat. This does not protect against the Demon's Bargain." }
    ]
  },

  {
    id: "hf_t7_prince_of_hell",
    name: "Prince of Hell",
    icon: "spell_shadow_soulburn",
    maxRanks: 1,
    position: { x: 0, y: 7 },
    requires: "hf_t5_soul_harvest",
    spell: {
      name: "Prince of Hell",
      description: "ULTIMATE: The Emberspire throne awaits — tear open the Abyss itself. Open a Hell Portal for 1 minute: up to 3 Wyrd-touched minions pour through under your command, and all enemies within 60 feet of the portal take 6d8 ember damage per round. Costs 4 Inferno Levels.",
      flavorText: "The kingdom has an open-door policy. The doors are the problem.",
      source: "talent", class: "Pyrofiend", treeId: "hellfire",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 60,
      castTimeType: "short", castTimeValue: 3,
      cooldownCategory: "long", cooldownValue: 300, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: false, interruptible: true,
      resourceCosts: { infernoLevel: { baseAmount: 4 }, mana: { baseAmount: 30 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      damageTypes: ["ember"],
      primaryDamage: { dice: "6d8", flat: 0, procChance: 100 },
      isDot: true, dotDuration: 6, dotTick: "6d8",
      visualTheme: "fire", tags: ["ultimate", "capstone", "summon", "portal", "pyrofiend"]
    }
  },
  {
    id: "hf_t7_soul_engine",
    name: "Soul Engine",
    icon: "spell_shadow_lifedrain",
    maxRanks: 5,
    position: { x: 0, y: 7.5 },
    requires: "hf_t5_soul_harvest",
    spell: {
      name: "Soul Engine",
      description: "You have industrialized the harvest. All healing you receive from Soul Fire, Drain Life, and Soul Link is increased by 10%.",
      flavorText: "Throughput is a virtue.",
      source: "talent", class: "Pyrofiend", treeId: "hellfire",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "self", visualTheme: "fire", tags: ["passive", "capstone", "lifesteal", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "You have industrialized the harvest. All healing you receive from Soul Fire, Drain Life, and Soul Link is increased by 20%." },
      { description: "You have industrialized the harvest. All healing you receive from Soul Fire, Drain Life, and Soul Link is increased by 30%." },
      { description: "You have industrialized the harvest. All healing you receive from Soul Fire, Drain Life, and Soul Link is increased by 45%." },
      { description: "You have industrialized the harvest. All healing you receive from Soul Fire, Drain Life, and Soul Link is increased by 60%." }
    ]
  },
  {
    id: "hf_t7_ash_immunity",
    name: "Ash Immunity",
    icon: "spell_fire_flamebolt",
    maxRanks: 3,
    position: { x: 0, y: 7.5 },
    requires: "hf_t5_soul_harvest",
    spell: {
      name: "Ash Immunity",
      description: "What is already ash cannot burn twice. You take 15% less damage from all sources while at Inferno Level 5 or higher.",
      flavorText: "Fully cooked, technically invincible.",
      source: "talent", class: "Pyrofiend", treeId: "hellfire",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "fire", tags: ["passive", "capstone", "defense", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "What is already ash cannot burn twice. You take 25% less damage from all sources while at Inferno Level 5 or higher." },
      { description: "What is already ash cannot burn twice. You take 35% less damage from all sources while at Inferno Level 4 or higher, and you are immune to frightened." }
    ]
  },
  {
    id: "hf_t7_burning_bargain",
    name: "Burning Bargain",
    icon: "spell_shadow_metamorphosis",
    maxRanks: 3,
    position: { x: 0, y: 6.5 },
    requires: "hf_t5_demonic_dominion",
    spell: {
      name: "Burning Bargain",
      description: "Demon Form grows more throne than transformation. While in Demon Form, you gain +10% of your maximum health as additional health.",
      flavorText: "The fine print favors the incumbent.",
      source: "talent", class: "Pyrofiend", treeId: "hellfire",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "fire", tags: ["passive", "capstone", "transform", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "Demon Form grows more throne than transformation. While in Demon Form, you gain +20% of your maximum health as additional health and +1 Durability Steps to equipped durability." },
      { description: "Demon Form grows more throne than transformation. While in Demon Form, you gain +30% of your maximum health as additional health, +1 Durability Steps to equipped durability, and your aura radius doubles." }
    ]
  },
  {
    id: "hf_t7_torment_economy",
    name: "Torment Economy",
    icon: "spell_shadow_requiem",
    maxRanks: 3,
    position: { x: 0, y: 5.5 },
    requires: "hf_t5_demonic_dominion",
    spell: {
      name: "Torment Economy",
      description: "Suffering, recycled. Each enemy affected by your Hellish Aura at the start of your turn restores 2 mana.",
      flavorText: "Their misery, monetized.",
      source: "talent", class: "Pyrofiend", treeId: "hellfire",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "fire", tags: ["passive", "capstone", "mana", "pyrofiend"]
    },
    rankUpgrades: [
      { description: "Suffering, recycled. Each enemy affected by your Hellish Aura at the start of your turn restores 4 mana." },
      { description: "Suffering, recycled. Each enemy affected by your Hellish Aura at the start of your turn restores 4 mana and reduces your Inferno drawback self-damage by 1." }
    ]
  }
];