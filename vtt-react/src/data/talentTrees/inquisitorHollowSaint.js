// ============================================
// INQUISITOR — HOLLOW SAINT (v2: talents are spells)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50.
// The possession tree: internal Wyrd-hound, pursuit, the Ascended Form.
// ============================================

export const INQUISITOR_HOLLOW_SAINT = [
  {
    id: "hsw_t1_hollow_pursuit",
    name: "Hollow Pursuit",
    icon: "ability_hunter_markedfordeath",
    maxRanks: 3,
    position: { x: 1, y: 1.5 },
    requires: null,
    spell: {
      name: "Hollow Pursuit",
      description: "The Inquisitor purges with cold iron that remembers the Wyrd's first name. Gain +10 feet movement speed permanently, and track supernatural targets by scent within 60 feet.",
      flavorText: "You cannot be slowed. The thing inside won't allow it.",
      source: "talent", class: "Inquisitor", treeId: "hollow_saint",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["slicing"],
      visualTheme: "shadow", tags: ["passive", "pursuit", "senses", "inquisitor"]
    },
    rankUpgrades: [
      { description: "The Inquisitor purges with cold iron that remembers the Wyrd's first name. +10 feet speed, scent-tracking to 60 feet, and melee attacks deal +1d6 blight damage." , damageTypes: ["slicing", "blight"], primaryDamage: { dice: "1d6", flat: 0, procChance: 100 } },
      { description: "+10 feet speed, scent-tracking, melee attacks +2d6 blight, and you cannot be slowed or rooted while holding 3+ Authority.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "hsw_t1_wyrd_embrace",
    name: "Wyrd Embrace",
    icon: "spell_shadow_possession",
    maxRanks: 3,
    position: { x: 2, y: 3 },
    requires: null,
    spell: {
      name: "Wyrd Embrace",
      description: "Channel a Wyrd-hound within yourself: your Internal Dominance Die starts at d10, and your melee attacks deal 1d6 additional blight damage but degrade your Internal DD by 1 step.",
      flavorText: "The leash points inward now.",
      source: "talent", class: "Inquisitor", treeId: "hollow_saint",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["blight"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["internal-dd", "hybrid", "core", "inquisitor"]
    },
    rankUpgrades: [
      { description: "Internal DD starts at d10; melee attacks deal 2d6 additional blight but degrade Internal DD one step.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } },
      { description: "Internal DD starts at d12; melee attacks deal 3d6 additional blight and degrade Internal DD one step.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "hsw_t1_pursuit_mastery",
    name: "Pursuit Mastery",
    icon: "ability_rogue_sprint",
    maxRanks: 2,
    position: { x: 3, y: 1.5 },
    requires: null,
    spell: {
      name: "Pursuit Mastery",
      description: "Movement speed increases by 5 feet per Authority you hold, and when a supernatural target moves away from you, use your reaction to move up to your speed toward them.",
      flavorText: "Leaving is also a confession.",
      source: "talent", class: "Inquisitor", treeId: "hollow_saint",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["slicing"],
      visualTheme: "shadow", tags: ["passive", "pursuit", "reaction", "inquisitor"]
    },
    rankUpgrades: [
      { description: "+5 feet speed per Authority; reactive pursuit moves do not provoke opportunity attacks, and the pursuing strike gains advantage." }
    ]
  },

  {
    id: "hsw_t2_corruption_aura",
    name: "Corruption Aura",
    icon: "spell_shadow_contagion",
    maxRanks: 3,
    position: { x: 0, y: 1.5 },
    requires: "hsw_t1_wyrd_embrace",
    spell: {
      name: "Corruption Aura",
      description: "The internal hound bleeds into the world: enemies within 10 feet take 1d6 blight damage at the start of their turns.",
      flavorText: "Standing near you is inadvisable and possibly heretical.",
      source: "talent", class: "Inquisitor", treeId: "hollow_saint",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["blight"],
      isDot: true, dotDuration: 99, dotTick: "1d6",
      visualTheme: "shadow", tags: ["passive", "aura", "internal", "inquisitor"]
    },
    rankUpgrades: [
      { description: "Enemies within 15 feet take 2d6 blight damage at the start of their turns.", dotTick: "2d6" },
      { description: "Enemies within 15 feet take 3d6 blight per turn, and enemies who remain inside for 3 rounds gain a Stage 0 rot-Seed.", dotTick: "3d6" }
    ]
  },
  {
    id: "hsw_t2_condemn",
    name: "Condemn",
    icon: "ability_paladin_judgementsofthejust",
    maxRanks: 3,
    position: { x: 4, y: 1.5 },
    requires: "hsw_t1_pursuit_mastery",
    spell: {
      name: "Condemn",
      description: "Spend 3 Authority: knock a target within 30 feet back 20 feet and pin them to the ground — they take 3d8 sacred damage and are stunned for 1 round.",
      flavorText: "The sentence is physical.",
      source: "talent", class: "Inquisitor", treeId: "hollow_saint",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 20, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { authority: { baseAmount: 3 } },
      damageTypes: ["sacred"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      debuffs: ["stun"], visualTheme: "shadow", tags: ["pin", "control", "judgment", "inquisitor"]
    },
    rankUpgrades: [
      { description: "Spend 3 Authority: knock back 20 feet, 4d8 sacred damage, stunned 1 round, and pinned targets cannot teleport.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 } },
      { description: "Spend 3 Authority: knock back 30 feet, 4d8 sacred damage, stunned 2 rounds, no teleport, and adjacent enemies are knocked prone.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "hsw_t3_inner_peace",
    name: "Inner Peace",
    icon: "spell_shadow_mindrot",
    maxRanks: 3,
    position: { x: 1, y: 4 },
    requires: "hsw_t2_corruption_aura",
    spell: {
      name: "Inner Peace",
      description: "The Inquisitor purges with cold iron that remembers the Wyrd's first name. When your Internal DD reaches 0 and the hound takes control, you regain command after 1 turn instead of 2.",
      flavorText: "Inner peace, in this context, means winning the argument faster.",
      source: "talent", class: "Inquisitor", treeId: "hollow_saint",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["blight"],
      visualTheme: "shadow", tags: ["passive", "internal-dd", "control", "inquisitor"]
    },
    rankUpgrades: [
      { description: "The Inquisitor purges with cold iron that remembers the Wyrd's first name. The hound's control turn deals +2d6 blight damage to enemies only.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } },
      { description: "Regain command same-turn; the hound's rampage deals +3d6 blight to enemies only and generates 2 Authority for you when it ends." , primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "hsw_t3_marked_for_death",
    name: "Marked for Death",
    icon: "ability_hunter_assassinate",
    maxRanks: 3,
    position: { x: 3, y: 4 },
    requires: "hsw_t2_condemn",
    spell: {
      name: "Marked for Death",
      description: "Mark a supernatural target for 10 minutes: you see them through walls, they cannot become invisible, and your attacks against them deal 2d6 additional sacred damage.",
      flavorText: "The mark is not a spell. It is a verdict in progress.",
      source: "talent", class: "Inquisitor", treeId: "hollow_saint",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "single", rangeType: "ranged", range: 90,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 10, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { authority: { baseAmount: 1 } },
      durationRounds: 60, durationRealTime: 600, durationUnit: "seconds",
      damageTypes: ["sacred"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      debuffs: ["marked"], visualTheme: "shadow", tags: ["mark", "tracking", "inquisitor"]
    },
    rankUpgrades: [
      { description: "Mark a supernatural target: seen through walls, no invisibility, your attacks deal +3d6 sacred damage to them.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } },
      { description: "The mark: seen through everything, no invisibility, +4d6 sacred from your attacks, and they cannot benefit from allies' auras.", primaryDamage: { dice: "4d6", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "hsw_t4_rein_in_fury",
    name: "Rein In Fury",
    icon: "spell_shadow_darkregeneration",
    maxRanks: 3,
    position: { x: 1.5, y: 5.5 },
    requires: "hsw_t3_inner_peace",
    spell: {
      name: "Rein In Fury",
      description: "You have learned to milk the possession: spend 2 Authority to restore your Internal DD by one step.",
      flavorText: "The hound respects routine. Occasionally.",
      source: "talent", class: "Inquisitor", treeId: "hollow_saint",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 10, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { authority: { baseAmount: 2 } },
      visualTheme: "shadow", tags: ["internal-dd", "restore", "inquisitor"]
    },
    rankUpgrades: [
      { description: "Spend 2 Authority to restore one Internal DD step; if used while the hound rampages, the rampage ends immediately." },
      { description: "Spend 1 Authority for an Internal DD step; ending a rampage this way grants 5 temporary health, and the restore can be used twice per round." }
    ]
  },
  {
    id: "hsw_t4_corruption_nova",
    name: "Corruption Nova",
    icon: "spell_shadow_shadowfury",
    maxRanks: 2,
    position: { x: 2.5, y: 5.5 },
    requires: "hsw_t3_marked_for_death",
    spell: {
      name: "Corruption Nova",
      description: "Unleash the internal hound's fury in a 20-foot burst: 3d6 blight damage to all enemies. Resets your Internal DD to d6 regardless of its level.",
      flavorText: "The hound goes out. Everything regrets it.",
      source: "talent", class: "Inquisitor", treeId: "hollow_saint",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 20,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 25, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { mana: { baseAmount: 10 } },
      damageTypes: ["blight"],
      primaryDamage: { dice: "3d6", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["nova", "internal", "inquisitor"]
    },
    rankUpgrades: [
      { description: "Unleash the hound in a 30-foot burst: 5d6 blight damage, and victims are frightened for 1 round. Internal DD resets to d6.", primaryDamage: { dice: "5d6", flat: 0, procChance: 100 }, debuffs: ["frightened"] }
    ]
  },

  {
    id: "hsw_t5_hounds_endurance",
    name: "Hound's Endurance",
    icon: "spell_shadow_soul_link",
    maxRanks: 3,
    position: { x: 1.5, y: 6.5 },
    requires: "hsw_t4_rein_in_fury",
    spell: {
      name: "Hound's Endurance",
      description: "The hound inside keeps you standing: your maximum health increases by 10, and while your Internal DD is d8 or higher you regenerate 1d4 health per round.",
      flavorText: "It guards the house it lives in.",
      source: "talent", class: "Inquisitor", treeId: "hollow_saint",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      healing: { dice: "1d4", flat: 0 },
      visualTheme: "shadow", tags: ["passive", "health", "internal", "inquisitor"]
    },
    rankUpgrades: [
      { description: "Max health +15; at d8+ Internal DD you regenerate 2d4 health per round.", healing: { dice: "2d4", flat: 0 } },
      { description: "Max health +20; at d8+ regenerate 3d4 per round, and you cannot be frightened — the hound growls back.", healing: { dice: "3d4", flat: 0 } }
    ]
  },
  {
    id: "hsw_t5_no_escape",
    name: "No Escape",
    icon: "ability_hunter_passthrough",
    maxRanks: 2,
    position: { x: 2.5, y: 6.5 },
    requires: "hsw_t4_corruption_nova",
    spell: {
      name: "No Escape",
      description: "Marked targets cannot disengage, dash, or teleport away from you: if they try, your pursuit reaction triggers twice and pins them for 1 round on a hit.",
      flavorText: "Flight is evidence. Flight is also futile.",
      source: "talent", class: "Inquisitor", treeId: "hollow_saint",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", damageTypes: ["slicing"],
      visualTheme: "shadow", tags: ["pursuit", "mark", "control", "inquisitor"]
    },
    rankUpgrades: [
      { description: "Marked targets fleeing trigger pursuit reactions twice; each pursuit hit deals +1d6 blight damage.", damageTypes: ["slicing", "blight"], primaryDamage: { dice: "1d6", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "hsw_t6_ascended_form",
    name: "Hollow Sovereign",
    icon: "spell_shadow_summonfelguard",
    maxRanks: 1,
    position: { x: 1, y: 7.5 },
    requires: "hsw_t5_hounds_endurance",
    spell: {
      name: "Hollow Sovereign",
      description: "You no longer lose control at Internal DD 0. Instead, enter Ascended Form for 3 rounds: +4 to Strength and Constitution checks, your melee attacks deal 4d10 blight damage, and Corruption Aura doubles. After it ends, take 4d10 wyrd damage and Internal DD resets to d6.",
      flavorText: "The leash broke in both directions. Nobody agrees on who holds it now.",
      source: "talent", class: "Inquisitor", treeId: "hollow_saint",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["blight"],
      primaryDamage: { dice: "4d10", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["transform", "internal-dd", "climax", "inquisitor"]
    }
  },
  {
    id: "hsw_t6_confession",
    name: "Confession",
    icon: "spell_shadow_psychicscream",
    maxRanks: 2,
    position: { x: 2, y: 7.5 },
    requires: "hsw_t5_no_escape",
    spell: {
      name: "Confession",
      description: "Pinned or marked enemies volunteer everything: enemies under your Condemn or Mark have their position broadcast to all allies and take 1d6 extra damage from everyone.",
      flavorText: "The truth wants out. You just hold the door.",
      source: "talent", class: "Inquisitor", treeId: "hollow_saint",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", damageTypes: ["sacred"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["mark", "support", "inquisitor"]
    },
    rankUpgrades: [
      { description: "Condemned or marked enemies take 2d6 extra damage from ALL sources and allies gain advantage on attacks against them.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "hsw_t6_hollow_bones",
    name: "Hollow Bones",
    icon: "spell_shadow_shadetruesight",
    maxRanks: 2,
    position: { x: 3, y: 7.5 },
    requires: "hsw_t5_hounds_endurance",
    spell: {
      name: "Hollow Bones",
      description: "The hound has hollowed you into something tireless: you cannot be exhausted, and you do not need to sleep — trances of 2 hours restore you fully.",
      flavorText: "The body was mostly luggage anyway.",
      source: "talent", class: "Inquisitor", treeId: "hollow_saint",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "endurance", "utility", "inquisitor"]
    },
    rankUpgrades: [
      { description: "You cannot be exhausted or slept magically; 2-hour trances restore fully, and during vigils your scent-tracking range increases by 30 feet." }
    ]
  },

  {
    id: "hsw_t7_saint_and_hound",
    name: "Saint and Hound",
    icon: "spell_shadow_metamorphosis",
    maxRanks: 1,
    position: { x: 0, y: 8 },
    requires: "hsw_t6_ascended_form",
    spell: {
      name: "Saint and Hound",
      description: "ULTIMATE: Saint and hound sign a joint writ. For 1 minute: Ascended Form persists without its ending backlash, your Internal DD cannot degrade below d8, all melee attacks deal maximum damage and apply your Corruption Aura's rot directly, and each supernatural enemy that dies within 60 feet restores 1 Authority and 2d6 health to you. Costs all current Authority (minimum 4).",
      flavorText: "Two names on the writ now. The iron holds them both.",
      source: "talent", class: "Inquisitor", treeId: "hollow_saint",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 300, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { authority: { baseAmount: 6 }, mana: { baseAmount: 20 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      buffs: ["saint-and-hound"], damageTypes: ["blight"],
      visualTheme: "shadow", tags: ["ultimate", "capstone", "transform", "inquisitor"]
    }
  },
  {
    id: "hsw_t7_writ_of_hunger",
    name: "Writ of Hunger",
    icon: "inv_scroll_03",
    maxRanks: 5,
    position: { x: 1, y: 8 },
    requires: "hsw_t6_hollow_bones",
    spell: {
      name: "Writ of Hunger",
      description: "The writ grows longer: your Authority maximum increases by 1.",
      flavorText: "The hound signs with its teeth.",
      source: "talent", class: "Inquisitor", treeId: "hollow_saint",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "capstone", "authority", "inquisitor"]
    },
    rankUpgrades: [
      { description: "The writ grows longer: your Authority maximum increases by 2." },
      { description: "The writ grows longer: your Authority maximum increases by 3." },
      { description: "The writ grows longer: your Authority maximum increases by 4." },
      { description: "The writ grows longer: Authority maximum +5, and Condemn costs 2 Authority." }
    ]
  },
  {
    id: "hsw_t7_tireless_pursuer",
    name: "Tireless Pursuer",
    icon: "ability_rogue_sprint",
    maxRanks: 3,
    position: { x: 2, y: 8 },
    requires: "hsw_t6_hollow_bones",
    spell: {
      name: "Tireless Pursuer",
      description: "The pursuit never rests: your movement speed increases by 10 feet, and your pursuit reactions no longer consume your reaction.",
      flavorText: "You have been chasing something for years. The legs remember.",
      source: "talent", class: "Inquisitor", treeId: "hollow_saint",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["slicing"],
      visualTheme: "shadow", tags: ["passive", "capstone", "pursuit", "inquisitor"]
    },
    rankUpgrades: [
      { description: "+15 feet movement; pursuit reactions are free and can trigger twice per round." },
      { description: "+20 feet movement; unlimited pursuit reactions, and each pursuit strike slows the target 10 feet." }
    ]
  },
  {
    id: "hsw_t7_rot_crown",
    name: "Rot Crown",
    icon: "spell_shadow_contagion",
    maxRanks: 3,
    position: { x: 3, y: 8 },
    requires: "hsw_t6_confession",
    spell: {
      name: "Rot Crown",
      description: "Your Corruption Aura learns from the garden: enemies inside it have their healing reduced by 25%.",
      flavorText: "The crown is invisible. The effects are not.",
      source: "talent", class: "Inquisitor", treeId: "hollow_saint",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", damageTypes: ["blight"],
      visualTheme: "shadow", tags: ["passive", "capstone", "aura", "anti-heal", "inquisitor"]
    },
    rankUpgrades: [
      { description: "Enemies in your aura heal 25% less and take 1d6 extra blight from your attacks." },
      { description: "Aura-borne enemies heal 50% less, and allies inside your aura are immune to their healing reduction — the rot knows the household." }
    ]
  },
  {
    id: "hsw_t7_last_confession",
    name: "Last Confession",
    icon: "ability_paladin_judgementsofthejust",
    maxRanks: 3,
    position: { x: 4, y: 8 },
    requires: "hsw_t6_confession",
    spell: {
      name: "Last Confession",
      description: "Condemn's verdict sharpens: condemned targets below half health take 50% more damage from you.",
      flavorText: "Everyone confesses eventually. You simply expedite the paperwork.",
      source: "talent", class: "Inquisitor", treeId: "hollow_saint",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["sacred"],
      visualTheme: "shadow", tags: ["passive", "capstone", "execute", "inquisitor"]
    },
    rankUpgrades: [
      { description: "Condemned targets below half health take 75% more damage from you." },
      { description: "Condemned targets below half health take DOUBLE damage from you, and your killing blow on a condemned enemy generates 3 Authority." }
    ]
  }
];
