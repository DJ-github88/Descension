// ============================================
// WARDEN — SHADOWBLADE (v2: talents are spells)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50.
// Resource: Vengeance Points (VP). The assassin tree: marks, stealth, executes.
// ============================================

export const WARDEN_SHADOWBLADE = [
  {
    id: "wsb_t1_vengeful_pursuit",
    name: "Vengeful Pursuit",
    icon: "ability_hunter_assassinate",
    maxRanks: 3,
    position: { x: 1.5, y: 0 },
    requires: null,
    spell: {
      name: "Vengeful Pursuit",
      description: "Mark a target within 60 feet for 1 minute: your successful attacks against the marked target generate +1 VP.",
      flavorText: "The mark is a debt. You always collect.",
      source: "talent", class: "Warden", treeId: "shadowblade",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "single", rangeType: "ranged", range: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 6, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 0 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      debuffs: ["marked"], visualTheme: "shadow", tags: ["mark", "resource", "warden"]
    },
    rankUpgrades: [
      { description: "Mark a target within 60 feet for 1 minute: your attacks against the marked target generate +2 VP." },
      { description: "Mark a target within 90 feet for 1 minute: your attacks against the marked target generate +2 VP, and VP builds 50 points faster against marks.", durationRounds: 6 }
    ]
  },
  {
    id: "wsb_t1_shadow_stalker",
    name: "Shadow Stalker",
    icon: "ability_stealth",
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    spell: {
      name: "Shadow Stalker",
      description: "You can hide as 1 Action Point even after attacking, and stealth attacks generate +2 VP instead of +1.",
      flavorText: "The shadow was here first. You are just using it.",
      source: "talent", class: "Warden", treeId: "shadowblade",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "stealth", "warden"]
    },
    rankUpgrades: [
      { description: "You can hide as 1 Action Point even after attacking; stealth attacks generate +2 VP, and marked targets cannot detect you through blindsight or tremorsense." },
      { description: "You can hide as a free action once per turn after attacking; stealth attacks generate +3 VP, and marks cannot detect you through any sense." }
    ]
  },
  {
    id: "wsb_t1_precision_strike",
    name: "Precision Strike",
    icon: "ability_warrior_weaponmastery",
    maxRanks: 2,
    position: { x: 2.5, y: 0 },
    requires: null,
    spell: {
      name: "Precision Strike",
      description: "Spend 1 VP: your crit range expands to 19-20 against your marked target for one attack. On a crit, regain 1 VP.",
      flavorText: "One vein. One window. One strike.",
      source: "talent", class: "Warden", treeId: "shadowblade",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 8, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { vengeance: { baseAmount: 1 } },
      visualTheme: "shadow", tags: ["empower", "crit", "warden"]
    },
    rankUpgrades: [
      { description: "Spend 1 VP: your crit range expands to 18-20 against your marked target for one attack; on a crit, regain 2 VP." }
    ]
  },

  {
    id: "wsb_t2_predator_strike",
    name: "Predator Strike",
    icon: "ability_hunter_snipershot",
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: "wsb_t1_shadow_stalker",
    spell: {
      name: "Predator Strike",
      description: "Attacks against marked targets crit on 19-20. When you critically strike a marked target, teleport 10 feet to any enemy within 30 feet.",
      flavorText: "The herd never sees the second strike coming.",
      source: "talent", class: "Warden", treeId: "shadowblade",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "crit", "mobility", "warden"]
    },
    rankUpgrades: [
      { description: "Attacks against marked targets crit on 19-20; critical strikes let you teleport 20 feet, and the arrival strike is made with advantage." },
      { description: "Attacks against marks crit on 18-20; crits let you teleport 30 feet, and each teleport strike deals +2d6 slicing damage.", damageTypes: ["slicing"], primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "wsb_t2_death_mark",
    name: "Death Mark",
    icon: "ability_hunter_markedfordeath",
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: "wsb_t1_precision_strike",
    spell: {
      name: "Death Mark",
      description: "When your marked target dies, instantly gain 2 VP and mark a new target as a free action. Once per round.",
      flavorText: "The list is never finished. It is only ever current.",
      source: "talent", class: "Warden", treeId: "shadowblade",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "kill", "engine", "warden"]
    },
    rankUpgrades: [
      { description: "When your marked target dies, gain 3 VP, mark a new target freely, and your first attack on the new mark has advantage. Once per round." },
      { description: "When your marked target dies, gain 3 VP, mark a new target freely with advantage, and gain 5 temporary health. Once per round." }
    ]
  },

  {
    id: "wsb_t3_unseen_executioner",
    name: "Unseen Executioner",
    icon: "ability_rogue_shadowstrike",
    maxRanks: 3,
    position: { x: 1.5, y: 2 },
    requires: "wsb_t2_predator_strike",
    spell: {
      name: "Unseen Executioner",
      description: "Marked targets below half health suffer +1d6 bonus damage from your attacks. When you kill a marked target, you may hide as 1 Action Point.",
      flavorText: "Half health is a eulogy in progress.",
      source: "talent", class: "Warden", treeId: "shadowblade",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "execute", "stealth", "warden"]
    },
    rankUpgrades: [
      { description: "Marked targets below half health suffer +1d6 bonus damage from your attacks; killing a marked target lets you hide as a free action." },
      { description: "Marked targets below half health suffer +1d6 bonus damage from your attacks; marked kills grant a free hide and your next stealth attack scores a critical hit on 19-20." }
    ]
  },
  {
    id: "wsb_t2_execution_strike",
    name: "Execution Strike",
    icon: "ability_rogue_deadliness",
    maxRanks: 3,
    position: { x: 2.5, y: 1 },
    requires: null,
    spell: {
      name: "Execution Strike",
      description: "Spend 4 VP to attempt an execution on a target below half maximum Hit Points: the target must pass a Constitution save or take triple damage.",
      flavorText: "The paperwork says 'attempt'. The blade says otherwise.",
      source: "talent", class: "Warden", treeId: "shadowblade",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "melee", range: 5,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 15, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { vengeance: { baseAmount: 4 } },
      visualTheme: "shadow", tags: ["execute", "burst", "warden"]
    },
    rankUpgrades: [
      { description: "Spend 4 VP to attempt an execution on a target below half maximum Hit Points: Constitution save or take triple damage; a failed save also silences them for 1 round." },
      { description: "Spend 4 VP: execute a target below half maximum Hit Points — Constitution save or take QUADRUPLE damage and be silenced for 1 round. A successful save still takes double damage." }
    ]
  },

  {
    id: "wsb_t3_deadly_precision",
    name: "Deadly Precision",
    icon: "ability_hunter_focusedaim",
    maxRanks: 3,
    position: { x: 2.5, y: 2 },
    requires: null,
    spell: {
      name: "Deadly Precision",
      description: "Your attacks against marked targets ignore half and three-quarters cover, and marked targets have disadvantage on saves against your abilities.",
      flavorText: "Cover is a rumor spread by survivors.",
      source: "talent", class: "Warden", treeId: "shadowblade",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "cover", "penetration", "warden"]
    },
    rankUpgrades: [
      { description: "Your attacks against marks ignore ALL cover, and marked targets save against your abilities with disadvantage." },
      { description: "Attacks against marks ignore all cover, marks save with disadvantage AND cannot benefit from durability above 16 against you." }
    ]
  },
  {
    id: "wsb_t3_shadow_step",
    name: "Shadow Step",
    icon: "spell_shadow_shadowward",
    maxRanks: 2,
    position: { x: 2, y: 2 },
    requires: "wsb_t2_execution_strike",
    spell: {
      name: "Shadow Step",
      description: "Spend 1 VP: teleport 30 feet to a shadowed or dim location you can see. Your next attack within 6 seconds is made with advantage.",
      flavorText: "Distance is a courtesy you no longer observe.",
      source: "talent", class: "Warden", treeId: "shadowblade",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "self", rangeType: "self", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 10, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { vengeance: { baseAmount: 1 } },
      visualTheme: "shadow", tags: ["mobility", "stealth", "warden"]
    },
    rankUpgrades: [
      { description: "Spend 1 VP: teleport 60 feet to any shadowed location; your next attack within 6 seconds has advantage and deals +2d6 blight damage.", damageTypes: ["blight"], primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "wsb_t4_hunters_instinct",
    name: "Hunter's Instinct",
    icon: "ability_druid_predatoryinstincts",
    maxRanks: 3,
    position: { x: 1.5, y: 3 },
    requires: "wsb_t3_deadly_precision",
    spell: {
      name: "Hunter's Instinct",
      description: "You always know where the mark is. Your marked target is visible to you through walls, darkness, and invisibility.",
      flavorText: "There is no 'away' to get to.",
      source: "talent", class: "Warden", treeId: "shadowblade",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "tracking", "senses", "warden"]
    },
    rankUpgrades: [
      { description: "You always know where the mark is: visible through walls, darkness, and invisibility, and they cannot benefit from concealment against you." },
      { description: "The mark is laid bare: visible through everything, no concealment, and you gain +2 to attack rolls against marks in dim light or darkness." }
    ]
  },
  {
    id: "wsb_t4_apex_hunter",
    name: "Apex Hunter",
    icon: "ability_druid_predatoryinstincts",
    maxRanks: 2,
    position: { x: 2.5, y: 3 },
    requires: "wsb_t3_shadow_step",
    spell: {
      name: "Apex Hunter",
      description: "While you hold 8 or more VP, your attacks against marked targets deal +1d6 bonus damage, and you may spend 2 VP to make a follow-up attack as a reaction when hit.",
      flavorText: "At the top of the food chain, every meal is a reaction.",
      source: "talent", class: "Warden", treeId: "shadowblade",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "threshold", "empower", "warden"]
    },
    rankUpgrades: [
      { description: "While at 8+ VP, attacks against marks deal +1d8 bonus damage and your follow-up reaction attack costs 1 VP; killing blows below half health refund 2 VP." }
    ]
  },

  {
    id: "wsb_t5_quiver_of_debts",
    name: "Quiver of Debts",
    icon: "inv_weapon_bow_06",
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: "wsb_t4_hunters_instinct",
    spell: {
      name: "Quiver of Debts",
      description: "Every arrow remembers a name. Your ranged attacks against unmarked enemies deal +1d6 blight damage, and killing an unmarked enemy grants 1 VP.",
      flavorText: "The unmarked are simply not yet filed.",
      source: "talent", class: "Warden", treeId: "shadowblade",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["blight"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["passive", "ranged", "warden"]
    }
  },
  {
    id: "wsb_t5_ghost_protocol",
    name: "Ghost Protocol",
    icon: "spell_shadow_shadowwalk",
    maxRanks: 1,
    position: { x: 2.5, y: 4 },
    requires: "wsb_t4_apex_hunter",
    spell: {
      name: "Ghost Protocol",
      description: "Breaking sight is second nature. When an enemy targets you with an attack while you are hidden, you may spend 2 VP to become untargetable until the attack resolves.",
      flavorText: "Attacking a ghost is a scheduling problem.",
      source: "talent", class: "Warden", treeId: "shadowblade",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",       visualTheme: "shadow", tags: ["passive", "defense", "stealth", "warden"]
    }
  },

  {
    id: "wsb_t6_shadowblade_ascendant",
    name: "Shadowblade Ascendant",
    icon: "spell_shadow_demonicempathy",
    maxRanks: 1,
    position: { x: 1.5, y: 5 },
    requires: "wsb_t4_apex_hunter",
    spell: {
      name: "Shadowblade Ascendant",
      description: "Become a shadow entity for 1 minute: all your attacks are silent, you phase through walls and creatures, your attacks deal +4d6 blight damage, and your marked target cannot escape — teleporting with them if they flee. Costs all current VP (minimum 5).",
      flavorText: "The Warden stops walking and starts arriving.",
      source: "talent", class: "Warden", treeId: "shadowblade",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 180, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { vengeance: { baseAmount: 8 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      buffs: ["shadow-ascendant"], damageTypes: ["blight"],
      primaryDamage: { dice: "4d6", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["transform", "empower", "warden"]
    }
  },
  {
    id: "wsb_t6_vein_reader",
    name: "Vein Reader",
    icon: "ability_rogue_findweakness",
    maxRanks: 2,
    position: { x: 2, y: 5 },
    requires: "wsb_t3_deadly_precision",
    spell: {
      name: "Vein Reader",
      description: "You see the anatomy of weakness. Your attacks against marked targets ignore 3 of the target's durability.",
      flavorText: "Everyone has a map. Yours is circled.",
      source: "talent", class: "Warden", treeId: "shadowblade",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "durability-sunder", "warden"]
    },
    rankUpgrades: [
      { description: "You see the anatomy of weakness. Attacks against marked targets ignore 5 durability, and your critical hits against marks ignore durability entirely." }
    ]
  },

  {
    id: "wsb_t7_shadow_requiem",
    name: "Shadow Requiem",
    icon: "ability_rogue_shadowdance",
    maxRanks: 1,
    position: { x: 0.5, y: 6 },
    requires: "wsb_t6_shadowblade_ascendant",
    spell: {
      name: "Shadow Requiem",
      description: "ULTIMATE: Mark up to 3 targets simultaneously for 1 minute. While in Shadowblade Ascendant, each attack against a marked target chains to your other marks at 50 points damage, and each mark that dies during the Requiem immediately refunds 3 VP and extends the Ascendant form by 1 round.",
      flavorText: "One requiem, several names, no encores.",
      source: "talent", class: "Warden", treeId: "shadowblade",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 90,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 300, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { vengeance: { baseAmount: 6 }, mana: { baseAmount: 15 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      debuffs: ["requiem-mark"], damageTypes: ["blight"],
      visualTheme: "shadow", tags: ["ultimate", "capstone", "multi-mark", "warden"]
    }
  },
  {
    id: "wsb_t7_eternal_hunt",
    name: "Eternal Hunt",
    icon: "ability_hunter_assassinate",
    maxRanks: 5,
    position: { x: 1.5, y: 6 },
    requires: "wsb_t5_quiver_of_debts",
    spell: {
      name: "Eternal Hunt",
      description: "The hunt outlives the hunter's fatigue. Your maximum VP increases by 1.",
      flavorText: "The debt ledger gains a page.",
      source: "talent", class: "Warden", treeId: "shadowblade",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "capstone", "resource", "warden"]
    },
    rankUpgrades: [
      { description: "The hunt outlives the hunter's fatigue. Your maximum VP increases by 2." },
      { description: "The hunt outlives the hunter's fatigue. Your maximum VP increases by 3." },
      { description: "The hunt outlives the hunter's fatigue. Your maximum VP increases by 4." },
      { description: "The hunt outlives the hunter's fatigue. Your maximum VP increases by 5, and VP decays only every other round." }
    ]
  },
  {
    id: "wsb_t7_silent_takedown",
    name: "Silent Takedown",
    icon: "ability_rogue_ambush",
    maxRanks: 3,
    position: { x: 2.5, y: 6 },
    requires: "wsb_t6_vein_reader",
    spell: {
      name: "Silent Takedown",
      description: "Kills made from stealth leave no trace: no death cry, no body discovery, and witnesses must pass a Perception check to notice anything happened.",
      flavorText: "The room stays polite. The headcount changes.",
      source: "talent", class: "Warden", treeId: "shadowblade",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "capstone", "stealth", "warden"]
    },
    rankUpgrades: [
      { description: "Stealth kills are perfectly silent and invisible; witnesses need a Perception check at disadvantage, and failed witnesses cannot raise alarm for 1 round." },
      { description: "Stealth kills erase the victim from notice for 1 full round — allies of the dead simply continue as if nothing happened, then must save to realize." }
    ]
  },
  {
    id: "wsb_t7_blood_ledger",
    name: "Blood Ledger",
    icon: "inv_misc_book_09",
    maxRanks: 3,
    position: { x: 3.5, y: 6 },
    requires: "wsb_t6_vein_reader",
    spell: {
      name: "Blood Ledger",
      description: "Every name crossed out pays interest. Each enemy killed by your attacks grants you +5 points damage for 1 minute (stacks up to 5 times).",
      flavorText: "Accounting, aggressive edition.",
      source: "talent", class: "Warden", treeId: "shadowblade",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["blight"],
      visualTheme: "shadow", tags: ["passive", "capstone", "stacking", "warden"]
    },
    rankUpgrades: [
      { description: "Each enemy killed grants +8 points damage for 1 minute (max 6 stacks)." },
      { description: "Each kill grants +10 points damage and +1 VP for 1 minute (max 8 stacks); at full stacks your attacks against marks cannot miss." }
    ]
  },
  {
    id: "wsb_t7_predators_memory",
    name: "Predator's Memory",
    icon: "ability_hunter_longevity",
    maxRanks: 3,
    position: { x: 2, y: 6 },
    requires: "wsb_t6_vein_reader",
    spell: {
      name: "Predator's Memory",
      description: "You have hunted everything once. Your marks never benefit from resistances against your attacks.",
      flavorText: "You remember where each of them keeps their weakness.",
      source: "talent", class: "Warden", treeId: "shadowblade",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["blight", "slicing"],
      visualTheme: "shadow", tags: ["passive", "capstone", "penetration", "warden"]
    },
    rankUpgrades: [
      { description: "You have hunted everything once. Marks never benefit from resistance, and their immunities count as resistance against you." },
      { description: "You have hunted everything once. Marks get no resistance, immunities degrade to resistance, and your Execution Strike works on creatures immune to execution." }
    ]
  }
];
