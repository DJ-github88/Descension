// ============================================
// TOXICOLOGIST — GADGETEER (v2: talents are spells)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50.
// The contraption tree: traps, gadgets, automation. Ember for explosives.
// ============================================

export const TOXICOLOGIST_GADGETEER = [
  {
    id: "gd_t1_mechanical_core",
    name: "Mechanical Core",
    icon: "inv_misc_wrench_01",
    maxRanks: 3,
    position: { x: 1.5, y: 4 },
    requires: null,
    spell: {
      name: "Mechanical Core",
      description: "Your body houses complex machinery. You gain proficiency with all tools and advantage on checks to repair or modify mechanical devices.",
      flavorText: "The clicking is normal. Probably.",
      source: "talent", class: "Toxicologist", treeId: "gadgeteer",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "tools", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Your body houses complex machinery. You gain proficiency with all tools, advantage on mechanical checks, and repairs take half the usual time." },
      { description: "Your body houses complex machinery. You gain proficiency with all tools, advantage on mechanical checks, repairs take half the usual time, and you may deploy one free simple contraption at the start of each combat." }
    ]
  },
  {
    id: "gd_t1_deploy_contraption",
    name: "Quick Deployment",
    icon: "inv_misc_enggizmos_03",
    maxRanks: 3,
    position: { x: 2, y: 5 },
    requires: null,
    spell: {
      name: "Quick Deployment",
      description: "Spend 1 Action Point: deploy a simple contraption (snare, alarm, or dart trap) at a location within 30 feet. The dart trap deals 1d6 stabbing damage when triggered.",
      flavorText: "Some assembly required. Not much.",
      source: "talent", class: "Toxicologist", treeId: "gadgeteer",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "aoe", rangeType: "ranged", range: 30, aoeShape: "circle", aoeSize: 5,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 10, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 5 } },
      damageTypes: ["stabbing"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "arcane", tags: ["deploy", "trap", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Spend 1 Action Point: deploy a simple contraption (snare, alarm, or dart trap) at a location within 30 feet. The dart trap deals 2d6 stabbing damage when triggered.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } },
      { description: "Spend 1 Action Point: deploy TWO simple contraptions within 30 feet. Dart traps deal 2d6 stabbing damage when triggered.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "gd_t1_power_cell",
    name: "Power Cell",
    icon: "inv_battery_02",
    maxRanks: 2,
    position: { x: 2.5, y: 4 },
    requires: null,
    spell: {
      name: "Power Cell",
      description: "Your gadgets draw power from your life force. Contraptions you deploy deal 1d6 additional damage, and may be overcharged to deal 2d6 instead — the contraption breaks after one use.",
      flavorText: "Overclocking the old-fashioned way.",
      source: "talent", class: "Toxicologist", treeId: "gadgeteer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["ember"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "arcane", tags: ["passive", "damage", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Your gadgets draw power from your life force. Contraptions you deploy deal 2d6 additional damage, and may be overcharged to deal 3d6 instead — the contraption breaks after one use." , primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "gd_t2_spring_mechanism",
    name: "Spring Mechanism",
    icon: "inv_misc_gear_01",
    maxRanks: 3,
    position: { x: 0.5, y: 3.5 },
    requires: "gd_t1_mechanical_core",
    spell: {
      name: "Spring Mechanism",
      description: "Your gadgets become spring-loaded. Contraptions have +10 feet of trigger range and can be triggered as reactions. You gain +1 to initiative rolls.",
      flavorText: "Springs: the original automation.",
      source: "talent", class: "Toxicologist", treeId: "gadgeteer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "traps", "initiative", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Your gadgets become spring-loaded. Contraptions have +20 feet of trigger range and can be triggered as reactions. You gain +2 to initiative rolls." },
      { description: "Your gadgets become spring-loaded. Contraptions have +30 feet of trigger range, can be triggered as reactions, and never trigger on allies. You gain +2 to initiative rolls." }
    ]
  },
  {
    id: "gd_t2_explosive_array",
    name: "Explosive Array",
    icon: "inv_misc_bomb_05",
    maxRanks: 3,
    position: { x: 3.5, y: 3.5 },
    requires: "gd_t1_power_cell",
    spell: {
      name: "Explosive Array",
      description: "Your explosives become devastating. Deploy a mine within 30 feet: when triggered, it deals 3d6 ember damage in a 10-foot radius and knocks enemies back 10 feet.",
      flavorText: "Perimeter security, loudly priced.",
      source: "talent", class: "Toxicologist", treeId: "gadgeteer",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "ranged", range: 30, aoeShape: "circle", aoeSize: 10,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 15, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 12 } },
      damageTypes: ["ember"],
      primaryDamage: { dice: "3d6", flat: 0, procChance: 100 },
      debuffs: ["knockback"], visualTheme: "fire", tags: ["explosive", "mine", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Your explosives become devastating. Deploy a mine within 30 feet: when triggered, it deals 3d6 ember damage in a 15-foot radius and knocks enemies back 10 feet.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } },
      { description: "Your explosives become devastating. Deploy a mine within 40 feet: when triggered, it deals 3d6 ember damage in a 20-foot radius, knocks enemies back 15 feet, and leaves ember terrain.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "gd_t3_trap_matrix",
    name: "Trap Matrix",
    icon: "inv_misc_enggizmos_03",
    maxRanks: 3,
    position: { x: 0.5, y: 4.5 },
    requires: "gd_t2_spring_mechanism",
    spell: {
      name: "Trap Matrix",
      description: "Your traps form a deadly network. When one of your traps triggers, all your traps within 20 feet gain advantage on their next trigger roll. You may have up to 4 active contraptions.",
      flavorText: "They are not traps. They are a discussion with the ground.",
      source: "talent", class: "Toxicologist", treeId: "gadgeteer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "traps", "network", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Your traps form a deadly network. When one of your traps triggers, all your traps within 30 feet gain advantage on their next trigger roll. You may have up to 6 active contraptions." },
      { description: "Your traps form a deadly network. When one of your traps triggers, all your traps within 30 feet immediately trigger as well at full effect. You may have up to 8 active contraptions." }
    ]
  },
  {
    id: "gd_t3_device_mastery",
    name: "Device Mastery",
    icon: "inv_misc_wrench_01",
    maxRanks: 3,
    position: { x: 3.5, y: 4.5 },
    requires: "gd_t2_explosive_array",
    spell: {
      name: "Device Mastery",
      description: "You become a master of all mechanical devices. As an action, modify any non-magical device or weapon: it gains +2 to attack and damage rolls for 1 minute.",
      flavorText: "Warranty voided, performance guaranteed.",
      source: "talent", class: "Toxicologist", treeId: "gadgeteer",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "single", rangeType: "touch", range: 5,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 20, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 10 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      buffs: ["modified"], visualTheme: "arcane", tags: ["modify", "buff", "toxicologist"]
    },
    rankUpgrades: [
      { description: "You become a master of all mechanical devices. As an action, modify any non-magical device or weapon: it gains +3 to attack and damage rolls for 1 minute." },
      { description: "You become a master of all mechanical devices. As an action, modify any device or weapon (even magical): it gains +4 to attack and damage rolls and one additional property for 1 minute." }
    ]
  },

  {
    id: "gd_t4_precision_engineering",
    name: "Precision Engineering",
    icon: "inv_misc_gear_02",
    maxRanks: 3,
    position: { x: 0, y: 5 },
    requires: "gd_t3_trap_matrix",
    spell: {
      name: "Precision Engineering",
      description: "Your contraptions become surgically precise. All contraptions ignore half and three-quarters cover, and enemies cannot gain advantage on saves against them.",
      flavorText: "Measured twice. Cut through everything.",
      source: "talent", class: "Toxicologist", treeId: "gadgeteer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "precision", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Your contraptions become surgically precise. All contraptions ignore all cover, and enemies cannot gain advantage on saves against them." },
      { description: "Your contraptions become surgically precise. All contraptions ignore all cover, enemies cannot gain advantage on saves against them, and traps trigger automatically without rolls." }
    ]
  },
  {
    id: "gd_t4_chain_reaction",
    name: "Chain Reaction",
    icon: "inv_misc_bomb_04",
    maxRanks: 2,
    position: { x: 4, y: 5 },
    requires: "gd_t3_device_mastery",
    spell: {
      name: "Chain Reaction",
      description: "Your contraptions create devastating chain reactions. When a contraption triggers, it can set off up to 2 other contraptions within 30 feet immediately at full effect.",
      flavorText: "Dominoes, but each domino is a bomb.",
      source: "talent", class: "Toxicologist", treeId: "gadgeteer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "fire", tags: ["passive", "chain", "traps", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Your contraptions create devastating chain reactions. When a contraption triggers, it can set off up to 4 other contraptions within 45 feet immediately at full effect." }
    ]
  },

  {
    id: "gd_t5_field_generator",
    name: "Field Generator",
    icon: "inv_misc_enggizmos_04",
    maxRanks: 3,
    position: { x: 0, y: 3 },
    requires: "gd_t4_precision_engineering",
    spell: {
      name: "Field Generator",
      description: "Deploy a projector that erects a force barrier. Create a 20-foot field within 30 feet for 1 minute: projectiles and enemies cannot pass through, allies can.",
      flavorText: "Doors, wherever you need them.",
      source: "talent", class: "Toxicologist", treeId: "gadgeteer",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "aoe", rangeType: "ranged", range: 30, aoeShape: "circle", aoeSize: 20,
      castTimeType: "short", castTimeValue: 1,
      cooldownCategory: "long", cooldownValue: 40, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: true,
      resourceCosts: { mana: { baseAmount: 20 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      buffs: ["barrier"], visualTheme: "arcane", tags: ["field", "control", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Deploy a projector that erects a force barrier. Create a 30-foot field within 30 feet for 1 minute: projectiles and enemies cannot pass through, allies can, and the field has 30 health." },
      { description: "Deploy a projector that erects a force barrier. Create a 30-foot field within 60 feet for 1 minute: enemies cannot pass, allies can, the field has 50 health, and enemies who touch it take 2d6 arcane damage.", damageTypes: ["arcane"], primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "gd_t5_automation_core",
    name: "Automation Core",
    icon: "inv_misc_punchcards_yellow",
    maxRanks: 2,
    position: { x: 4, y: 3 },
    requires: "gd_t4_chain_reaction",
    spell: {
      name: "Automation Core",
      description: "Your gadgets operate autonomously. Your contraptions can move 30 feet per round and attack or activate independently. You may command up to 3 contraptions per action.",
      flavorText: "You built helpers. They have opinions.",
      source: "talent", class: "Toxicologist", treeId: "gadgeteer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "automation", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Your gadgets operate autonomously. Your contraptions can move 60 feet per round, attack independently, and gain +2 to all rolls. You may command up to 5 contraptions per action." }
    ]
  },

  {
    id: "gd_t6_master_inventor",
    name: "Master Inventor",
    icon: "inv_misc_wrench_02",
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: "gd_t5_field_generator",
    spell: {
      name: "Master Inventor",
      description: "You can invent any mechanical device. Once per short rest, create a custom contraption with any combination of effects you can describe; it gains +2 to all its rolls and cannot be dispelled by non-magical means.",
      flavorText: "The blueprint exists for approximately nine seconds.",
      source: "talent", class: "Toxicologist", treeId: "gadgeteer",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "short", castTimeValue: 2,
      cooldownCategory: "long", cooldownValue: 90, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: false, interruptible: true,
      resourceCosts: { mana: { baseAmount: 25 } },
      visualTheme: "arcane", tags: ["invention", "custom", "toxicologist"]
    }
  },
  {
    id: "gd_t6_swarm_intelligence",
    name: "Swarm Intelligence",
    icon: "inv_misc_enggizmos_02",
    maxRanks: 2,
    position: { x: 2, y: 4.5 },
    requires: "gd_t5_field_generator",
    spell: {
      name: "Swarm Intelligence",
      description: "Your contraptions develop hive-mind intelligence. All your contraptions share senses within 100 feet, coordinate attacks, and gain +2 Durability Steps to equipped durability.",
      flavorText: "They hum in unison when you are not listening.",
      source: "talent", class: "Toxicologist", treeId: "gadgeteer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "network", "traps", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Your contraptions develop hive-mind intelligence. All your contraptions share senses within 100 feet, coordinate attacks, gain +4 Durability Steps to equipped durability, and can take reactions." }
    ]
  },
  {
    id: "gd_t6_repair_protocol",
    name: "Repair Protocol",
    icon: "inv_misc_gear_03",
    maxRanks: 2,
    position: { x: 3, y: 4 },
    requires: "gd_t5_automation_core",
    spell: {
      name: "Repair Protocol",
      description: "Your contraptions fix themselves. At the start of your turn, each of your contraptions restores 25% of its health.",
      flavorText: "Self-healing machinery is just gossip with tools.",
      source: "talent", class: "Toxicologist", treeId: "gadgeteer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "repair", "traps", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Your contraptions fix themselves. At the start of your turn, each of your contraptions restores 40% of its health, and destroyed contraptions redeploy at half health once per combat." }
    ]
  },

  {
    id: "gd_t7_technological_singularity",
    name: "Technological Singularity",
    icon: "inv_misc_enggizmos_01",
    maxRanks: 1,
    position: { x: 0, y: 3.5 },
    requires: "gd_t6_master_inventor",
    spell: {
      name: "Technological Singularity",
      description: "ULTIMATE: You become living technology incarnate for 1 minute: all contraption cooldowns are removed, you may deploy contraptions as free actions, and every contraption you control gains +3 to all rolls and double damage.",
      flavorText: "The singularity is not coming. It is here, and it brought spares.",
      source: "talent", class: "Toxicologist", treeId: "gadgeteer",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 240, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { mana: { baseAmount: 40 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      buffs: ["singularity"], visualTheme: "arcane", tags: ["ultimate", "capstone", "transform", "toxicologist"]
    }
  },
  {
    id: "gd_t7_prototype_stockpile",
    name: "Prototype Stockpile",
    icon: "inv_misc_bomb_05",
    maxRanks: 5,
    position: { x: 1, y: 3.5 },
    requires: "gd_t6_swarm_intelligence",
    spell: {
      name: "Prototype Stockpile",
      description: "Your coat holds more than physics suggests. The damage of all your contraptions is increased by 10%.",
      flavorText: "Spare parts and spares of the spares.",
      source: "talent", class: "Toxicologist", treeId: "gadgeteer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "capstone", "damage", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Your coat holds more than physics suggests. The damage of all your contraptions is increased by 20%." },
      { description: "Your coat holds more than physics suggests. The damage of all your contraptions is increased by 30%." },
      { description: "Your coat holds more than physics suggests. The damage of all your contraptions is increased by 45%." },
      { description: "Your coat holds more than physics suggests. The damage of all your contraptions is increased by 60%, and contraption deployment costs are halved." }
    ]
  },
  {
    id: "gd_t7_redundant_systems",
    name: "Redundant Systems",
    icon: "inv_misc_gear_02",
    maxRanks: 3,
    position: { x: 0, y: 4 },
    requires: "gd_t6_swarm_intelligence",
    spell: {
      name: "Redundant Systems",
      description: "Everything important has a backup. When a contraption is destroyed, it detonates in a final act of defiance dealing 2d6 ember damage to enemies within 10 feet.",
      flavorText: "Death rattle, industrial edition.",
      source: "talent", class: "Toxicologist", treeId: "gadgeteer",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["ember"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      visualTheme: "fire", tags: ["passive", "capstone", "explode", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Everything important has a backup. When a contraption is destroyed, it detonates dealing 4d6 ember damage to enemies within 15 feet.", primaryDamage: { dice: "4d6", flat: 0, procChance: 100 } },
      { description: "Everything important has a backup. When a contraption is destroyed, it detonates dealing 4d6 ember damage within 15 feet AND is instantly redeployed at half health once per combat.", primaryDamage: { dice: "4d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "gd_t7_cogwork_bastion",
    name: "Cogwork Bastion",
    icon: "inv_misc_enggizmos_04",
    maxRanks: 3,
    position: { x: 0, y: 4.5 },
    requires: "gd_t6_repair_protocol",
    spell: {
      name: "Cogwork Bastion",
      description: "You wear your workshop. While at least 2 of your contraptions are active, you gain +1 Durability Steps to equipped durability and 10% resistance to all damage.",
      flavorText: "The workshop protects its own.",
      source: "talent", class: "Toxicologist", treeId: "gadgeteer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "capstone", "defense", "toxicologist"]
    },
    rankUpgrades: [
      { description: "You wear your workshop. While at least 2 of your contraptions are active, you gain +2 Durability Steps to equipped durability and 20% resistance to all damage." },
      { description: "You wear your workshop. While at least 2 of your contraptions are active, you gain +3 Durability Steps to equipped durability, 25% resistance to all damage, and immunity to being disarmed or knocked prone." }
    ]
  },
  {
    id: "gd_t7_efficient_design",
    name: "Efficient Design",
    icon: "inv_misc_punchcards_yellow",
    maxRanks: 3,
    position: { x: 1, y: 4.5 },
    requires: "gd_t6_repair_protocol",
    spell: {
      name: "Efficient Design",
      description: "Every gear counts twice. The cooldowns of your contraption abilities are reduced by 15%.",
      flavorText: "Time-motion studies, weaponized.",
      source: "talent", class: "Toxicologist", treeId: "gadgeteer",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "capstone", "cooldown", "toxicologist"]
    },
    rankUpgrades: [
      { description: "Every gear counts twice. The cooldowns of your contraption abilities are reduced by 30%." },
      { description: "Every gear counts twice. The cooldowns of your contraption abilities are reduced by 45%." }
    ]
  }
];
