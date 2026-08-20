// ============================================
// BERSERKER — PRIMAL RAGE (v3: spec identity redesign)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50.
//
// SPEC IDENTITY: The Unstoppable Juggernaut / Escalation Bruiser.
// Where Blood Frenzy operates on low health and sacrifice, and Savage Instincts coordinates
// the pack, Primal Rage is about ascending through Rage States:
//   Smoldering -> Frenzied -> Carnage -> Obliteration.
// You have massive, high-impact active spenders that crush armor and trigger seismic impact.
//
// SIGNATURE ACTIVES:
//   - Savage Leap (t1):           Charge/leap into melee, instantly entering Frenzied state
//   - Battle Cry (t2):            Taunt/terrify enemies and force attention
//   - Carnage Cleave (t3):        High-heat cone strike that sunders armor
//   - Cataclysmic Blow (t4):      Seismic slam knocking enemies back and down
//   - Seismic Roar (t5):          Stun/disrupt nearby enemies with pure vocal power
//   - Obliterating Strike (t6):   Massive 100-heat finisher that shatters reality
//   - Berserker God (t7):         ULTIMATE — Permanent Obliteration state
// ============================================

export const BERSERKER_PRIMAL_RAGE = [
  // ──────────────── TIER 1 (8 pts) ────────────────
  {
    id: "prg_t1_savage_leap",
    name: "Savage Leap",
    icon: "ability_warrior_savageblow",
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    spell: {
      name: "Savage Leap",
      description: "Leap up to 30 feet to an enemy target, crashing down for 2d6 smashing damage. Instantly enter Frenzied Rage State and generate 20 Blood-Heat.",
      flavorText: "The fastest route between two points is an angry Nordhallan.",
      source: "talent", class: "Berserker", treeId: "primal_rage",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 12, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { bloodHeat: { baseAmount: 0 } },
      damageTypes: ["smashing"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      visualTheme: "primal", tags: ["gap-closer", "mobility", "rage-state", "berserker"]
    },
    rankUpgrades: [
      { description: "Leap up to 40 feet: deals 3d6 smashing damage, generates 30 Blood-Heat, and slows the target for 1 round.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 }, range: 40 },
      { description: "Leap up to 50 feet: deals 4d6 smashing damage, generates 40 Blood-Heat, and knocks the target prone.", primaryDamage: { dice: "4d6", flat: 0, procChance: 100 }, range: 50 }
    ]
  },
  {
    id: "prg_t1_inner_fire",
    name: "Inner Furnace",
    icon: "spell_fire_innerfire",
    maxRanks: 3,
    position: { x: 2.5, y: 0 },
    requires: null,
    spell: {
      name: "Inner Furnace",
      description: "Your attacks generate 2 additional Blood-Heat. While in Frenzied or higher Rage State, weapon attacks deal +1d4 ember damage.",
      flavorText: "The furnace was lit the day you were born. War only feeds it.",
      source: "talent", class: "Berserker", treeId: "primal_rage",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["ember"],
      primaryDamage: { dice: "1d4", flat: 0, procChance: 100 },
      visualTheme: "fire", tags: ["passive", "resource", "blood-heat", "berserker"]
    },
    rankUpgrades: [
      { description: "Attacks generate 3 additional Blood-Heat. While Frenzied+, attacks deal +1d6 ember damage.", primaryDamage: { dice: "1d6", flat: 0, procChance: 100 } },
      { description: "Attacks generate 4 additional Blood-Heat. While Frenzied+, attacks deal +1d8 ember damage, and your Blood-Heat decays 1 less per round.", primaryDamage: { dice: "1d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "prg_t1_fury_momentum",
    name: "Fury Momentum",
    icon: "ability_warrior_bloodfrenzy",
    maxRanks: 2,
    position: { x: 4, y: 0 },
    requires: null,
    spell: {
      name: "Fury Momentum",
      description: "You gain +1 weapon damage for each Rage State above Smoldering (Frenzied: +1, Carnage: +2, Obliteration: +3). Movement speed +5ft while Carnage+.",
      flavorText: "Every state of fury has a voice. This one speaks in momentum.",
      source: "talent", class: "Berserker", treeId: "primal_rage",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "fire", tags: ["passive", "damage", "rage-state", "berserker"]
    },
    rankUpgrades: [
      { description: "Gain +2 weapon damage per Rage State above Smoldering (+2 / +4 / +6). Movement speed +10ft while Carnage+." }
    ]
  },

  // ──────────────── TIER 2 (6 pts) ────────────────
  {
    id: "prg_t2_battle_cry",
    name: "Challenging Roar",
    icon: "ability_warrior_commandingshout",
    maxRanks: 3,
    position: { x: 1, y: 1.5 },
    requires: "prg_t1_savage_leap",
    spell: {
      name: "Challenging Roar",
      description: "Unleash a deafening war-shout: all enemies within 20 feet must make a Will save or be forced to attack only you for 1 round. Gain 20 Blood-Heat and +2 Durability Steps to equipped durability for 1 round.",
      flavorText: "Look at me. There is nothing else in this room worth your fear.",
      source: "talent", class: "Berserker", treeId: "primal_rage",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 20,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 15, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { bloodHeat: { baseAmount: 0 } },
      buffs: ["taunt", "armor-boost"], visualTheme: "primal", tags: ["taunt", "control", "berserker"]
    },
    rankUpgrades: [
      { description: "25-foot shout: forces enemies to attack you, grants 30 Blood-Heat and +3 Durability Steps to equipped durability. Cooldown drops to 12s.", cooldownValue: 12, aoeSize: 25 },
      { description: "30-foot shout: enemies who fail save take 2d6 ember damage on their turn if they do not attack you. Gain 40 Blood-Heat and +4 Durability Steps to equipped durability.", aoeSize: 30 }
    ]
  },
  {
    id: "prg_t2_rage_retention",
    name: "Rage Retention",
    icon: "spell_shadow_mindsteal",
    maxRanks: 3,
    position: { x: 3, y: 1.5 },
    requires: "prg_t1_inner_fire",
    spell: {
      name: "Rage Retention",
      description: "Cold endurance preserves your fury between bouts. Your Blood-Heat decay rate is reduced by 2 per round. Overheat threshold increases by 10.",
      flavorText: "The fire banked is the fire kept.",
      source: "talent", class: "Berserker", treeId: "primal_rage",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "rime", tags: ["passive", "resource", "decay", "berserker"]
    },
    rankUpgrades: [
      { description: "Blood-Heat decay reduced by 4 per round. Overheat threshold +20." },
      { description: "Blood-Heat NEVER decays during active combat. Overheat threshold +30, and entering Carnage state grants 15 temporary health." }
    ]
  },

  // ──────────────── TIER 3 (6 pts) ────────────────
  {
    id: "prg_t3_carnage_strike",
    name: "Carnage Cleave",
    icon: "ability_warrior_cleave",
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: "prg_t2_battle_cry",
    spell: {
      name: "Carnage Cleave",
      description: "Spend 30 Blood-Heat: execute a wide 180-degree sweeping cleave in melee. Deals 3d8 slashing damage to all enemies in front of you and sunders their durability (-2 Durability Steps to target's durability for 1 round).",
      flavorText: "One swing, multiple arguments concluded.",
      source: "talent", class: "Berserker", treeId: "primal_rage",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "melee", range: 5, aoeShape: "cone", aoeSize: 180,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 8, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { bloodHeat: { baseAmount: 30 } },
      damageTypes: ["slicing"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      debuffs: ["sunder"], visualTheme: "primal", tags: ["melee", "cleave", "aoe", "berserker"]
    },
    rankUpgrades: [
      { description: "Spend 30 Blood-Heat: cleave deals 4d8 slashing damage and sunders durability (-3 Durability Steps to target's durability for 2 rounds).", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 } },
      { description: "Spend 30 Blood-Heat: cleave deals 5d8 slashing damage, sunders durability (-4 Durability Steps to target's durability), and critical strikes generate 20 Blood-Heat instead of costing.", primaryDamage: { dice: "5d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "prg_t3_unbridled_momentum",
    name: "Unbridled Momentum",
    icon: "spell_fire_playingwithfire",
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: "prg_t2_rage_retention",
    spell: {
      name: "Unbridled Momentum",
      description: "While in Carnage or Obliteration Rage State, your weapon attacks cleave for 20% damage to an adjacent enemy, and your movement ignores difficult terrain.",
      flavorText: "Stopping is not an option in this weather.",
      source: "talent", class: "Berserker", treeId: "primal_rage",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "fire", tags: ["passive", "cleave", "momentum", "berserker"]
    },
    rankUpgrades: [
      { description: "In Carnage/Obliteration: weapon attacks cleave for 20% damage to up to 2 adjacent enemies." },
      { description: "In Carnage/Obliteration: weapon attacks cleave for 20% damage to all adjacent enemies, and you are immune to being knocked down or pushed." }
    ]
  },

  // ──────────────── TIER 4 (5 pts) ────────────────
  {
    id: "prg_t4_cataclysmic_blow",
    name: "Cataclysmic Blow",
    icon: "ability_warrior_titansgrip",
    maxRanks: 3,
    position: { x: 1, y: 4.5 },
    requires: "prg_t3_carnage_strike",
    spell: {
      name: "Cataclysmic Blow",
      description: "Spend 50 Blood-Heat: slam your weapon into the earth with seismic force. Deals 4d10 smashing damage to your target, knocks it 15 feet back, and knocks all adjacent enemies prone.",
      flavorText: "Glaciers remember that sound. So will they.",
      source: "talent", class: "Berserker", treeId: "primal_rage",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "melee", range: 5,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 16, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { bloodHeat: { baseAmount: 50 } },
      damageTypes: ["smashing"],
      primaryDamage: { dice: "4d10", flat: 0, procChance: 100 },
      debuffs: ["knockback", "prone"], visualTheme: "primal", tags: ["melee", "damage", "knockback", "berserker"]
    },
    rankUpgrades: [
      { description: "Spend 50 Blood-Heat: deals 5d10 smashing damage, knocks target 20ft back, and creates a 10ft crater of difficult terrain.", primaryDamage: { dice: "5d10", flat: 0, procChance: 100 } },
      { description: "Spend 50 Blood-Heat: deals 6d10 smashing damage, target is stunned for 1 round, and adjacent enemies take 3d10 collateral damage.", primaryDamage: { dice: "6d10", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "prg_t4_rage_echo",
    name: "Echo of Fury",
    icon: "spell_shadow_unholyfrenzy",
    maxRanks: 2,
    position: { x: 3.5, y: 4.5 },
    requires: "prg_t3_unbridled_momentum",
    spell: {
      name: "Echo of Fury",
      description: "When you defeat an enemy, emit a burst of inspiriting rage: you instantly gain 25 Blood-Heat, and all allies within 30 feet gain +2 to their next attack roll.",
      flavorText: "One death, answered by a chorus.",
      source: "talent", class: "Berserker", treeId: "primal_rage",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "kill", "ally", "berserker"]
    },
    rankUpgrades: [
      { description: "Defeating an enemy grants you 40 Blood-Heat and your next ability costs 0 Blood-Heat. Allies gain +3 to attack rolls and +10ft movement speed." }
    ]
  },

  // ──────────────── TIER 5 (5 pts) ────────────────
  {
    id: "prg_t5_seismic_roar",
    name: "Seismic Roar",
    icon: "spell_nature_ancestralguardian",
    maxRanks: 2,
    position: { x: 1, y: 6 },
    requires: "prg_t4_cataclysmic_blow",
    spell: {
      name: "Seismic Roar",
      description: "Spend 40 Blood-Heat: roar with tectonic fury. All enemies in a 25-foot cone take 3d8 thunder damage, are interrupted, and must save or be stunned for 1 round.",
      flavorText: "The mountain does not whisper.",
      source: "talent", class: "Berserker", treeId: "primal_rage",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "self", range: 25, aoeShape: "cone", aoeSize: 25,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 24, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: false,
      resourceCosts: { bloodHeat: { baseAmount: 40 } },
      damageTypes: ["smashing"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      debuffs: ["stun"], visualTheme: "primal", tags: ["aoe", "cone", "stun", "berserker"]
    },
    rankUpgrades: [
      { description: "30-foot cone deals 4d8 smashing damage, stuns for 1 round, and knocks all flying enemies to the ground.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 }, range: 30 }
    ]
  },
  {
    id: "prg_t5_fury_mastery",
    name: "Rage Efficiency",
    icon: "spell_nature_unrelentingstorm",
    maxRanks: 3,
    position: { x: 3, y: 6 },
    requires: "prg_t4_rage_echo",
    spell: {
      name: "Rage Efficiency",
      description: "Your Blood-Heat spending abilities (Carnage Cleave, Cataclysmic Blow, Seismic Roar) cost 10 less Blood-Heat.",
      flavorText: "Spend it like it was saved for this exact moment. It was.",
      source: "talent", class: "Berserker", treeId: "primal_rage",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "cost", "blood-heat", "berserker"]
    },
    rankUpgrades: [
      { description: "Blood-Heat spenders cost 15 less Blood-Heat and deal 10% more damage." },
      { description: "Blood-Heat spenders cost 20 less Blood-Heat, deal 20% more damage, and you gain 1 Action Point upon entering Obliteration state." }
    ]
  },

  // ──────────────── TIER 6 (5 pts) ────────────────
  {
    id: "prg_t6_obliterating_strike",
    name: "Obliterating Strike",
    icon: "spell_fire_meteorstorm",
    maxRanks: 1,
    position: { x: 1, y: 7.5 },
    requires: "prg_t5_seismic_roar",
    spell: {
      name: "Obliterating Strike",
      description: "Spend 75 Blood-Heat: execute your ultimate melee strike. Deals 6d10 smashing damage to your target and 3d10 to all enemies within 15 feet. Ignores all target durability.",
      flavorText: "The mountain did not move. You did.",
      source: "talent", class: "Berserker", treeId: "primal_rage",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "melee", range: 5, aoeShape: "circle", aoeSize: 15,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 45, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { bloodHeat: { baseAmount: 75 } },
      damageTypes: ["smashing"],
      primaryDamage: { dice: "6d10", flat: 0, procChance: 100 },
      visualTheme: "primal", tags: ["melee", "nuke", "aoe", "berserker"]
    },
    rankUpgrades: []
  },
  {
    id: "prg_t6_rage_overflow",
    name: "Overheat Redirection",
    icon: "spell_shadow_shadowwordpain",
    maxRanks: 2,
    position: { x: 2.5, y: 7.5 },
    requires: "prg_t5_fury_mastery",
    spell: {
      name: "Overheat Redirection",
      description: "When you would Overheat (reach 100 Blood-Heat), instead of suffering stun, your next ability is cast instantly for 0 cost and deals maximum possible damage.",
      flavorText: "Nothing wasted. Not even the catastrophe.",
      source: "talent", class: "Berserker", treeId: "primal_rage",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "fire", tags: ["passive", "overheat", "berserker"]
    },
    rankUpgrades: [
      { description: "Overheat never stuns you. When reaching 100 Blood-Heat, you gain 25 temporary health, your next TWO abilities deal maximum damage, and your Obliterating Strike cooldown refreshes." }
    ]
  },
  {
    id: "prg_t6_apocalyptic_wrath",
    name: "Avatar's Stature",
    icon: "spell_fire_elementaldevastation",
    maxRanks: 2,
    position: { x: 4, y: 7.5 },
    requires: "prg_t5_fury_mastery",
    spell: {
      name: "Avatar's Stature",
      description: "While in the Obliteration Rage State, your size increases by one category, weapon range extends by +5ft, and you take 20% less damage from all sources.",
      flavorText: "The saga ends with weather, not warriors.",
      source: "talent", class: "Berserker", treeId: "primal_rage",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "fire", tags: ["passive", "obliteration", "berserker"]
    },
    rankUpgrades: [
      { description: "In Obliteration state: +5ft reach, 25% all-damage reduction, and you are immune to being knocked down or pushed." }
    ]
  },

  // ──────────────── TIER 7 / CAPSTONE (15 pts) ────────────────
  {
    id: "prg_t7_berserker_god",
    name: "Obliteration Avatar",
    icon: "spell_shadow_unholystrength",
    maxRanks: 1,
    position: { x: 0.5, y: 8 },
    requires: "prg_t6_obliterating_strike",
    spell: {
      name: "Obliteration Avatar",
      description: "ULTIMATE: Lock yourself into the Obliteration Rage State for 1 minute: Blood-Heat never decays below 75, all weapon attacks deal +3d8 smashing damage, and your attacks send shockwaves in a 15-foot line behind the target.",
      flavorText: "The moment they sing about. You live there now.",
      source: "talent", class: "Berserker", treeId: "primal_rage",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 180, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { bloodHeat: { baseAmount: 50 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      damageTypes: ["smashing"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      buffs: ["avatar"], visualTheme: "fire", tags: ["ultimate", "capstone", "obliteration", "berserker"]
    },
    rankUpgrades: []
  },
  {
    id: "prg_t7_god_mode",
    name: "Living Avalanche Doctrine",
    icon: "spell_holy_weaponmastery",
    maxRanks: 5,
    position: { x: 1.5, y: 8 },
    requires: "prg_t6_obliterating_strike",
    spell: {
      name: "Living Avalanche Doctrine",
      description: "Your devastating strikes shake the earth. All smashing damage you deal is increased by 10%.",
      flavorText: "Avatar is a job description.",
      source: "talent", class: "Berserker", treeId: "primal_rage",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["smashing"],
      visualTheme: "rime", tags: ["passive", "capstone", "damage", "berserker"]
    },
    rankUpgrades: [
      { description: "Smashing damage increased by 20%." },
      { description: "Smashing damage increased by 35%." },
      { description: "Smashing damage increased by 50%." },
      { description: "Smashing damage increased by 70%, and Cataclysmic Blow and Obliterating Strike knock all targets prone unconditionally." }
    ]
  },
  {
    id: "prg_t7_hunger_made_flesh",
    name: "Rage Engine",
    icon: "spell_shadow_bloodboil",
    maxRanks: 3,
    position: { x: 2.5, y: 8 },
    requires: "prg_t6_rage_overflow",
    spell: {
      name: "Rage Engine",
      description: "All Blood-Heat generation from all attacks and abilities is increased by 20%. Savage Leap generates double Blood-Heat.",
      flavorText: "The Pact signed itself.",
      source: "talent", class: "Berserker", treeId: "primal_rage",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "blight", tags: ["passive", "capstone", "resource", "berserker"]
    },
    rankUpgrades: [
      { description: "Blood-Heat generation increased by 35%. Savage Leap cooldown reduced by 4 seconds." },
      { description: "Blood-Heat generation increased by 50%. Savage Leap has 2 charges and refunds its cooldown on kill." }
    ]
  },
  {
    id: "prg_t7_apocalyptic_aura",
    name: "Tectonic Shockwave",
    icon: "spell_fire_selfdestruct",
    maxRanks: 3,
    position: { x: 3.5, y: 8 },
    requires: "prg_t6_apocalyptic_wrath",
    spell: {
      name: "Tectonic Shockwave",
      description: "While in the Obliteration Rage State, enemies within 15 feet take 2d6 smashing damage at the start of your turn as the ground breaks beneath them.",
      flavorText: "Stand near the avatar at your own risk. The snow knows better.",
      source: "talent", class: "Berserker", treeId: "primal_rage",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["smashing"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      visualTheme: "fire", tags: ["passive", "capstone", "aura", "berserker"]
    },
    rankUpgrades: [
      { description: "Obliteration aura deals 3d6 smashing damage and reduces enemy movement speed by 10ft.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } },
      { description: "Obliteration aura deals 4d6 smashing damage, reduces enemy movement speed by 15ft, and imposes -2 to enemy attack rolls.", primaryDamage: { dice: "4d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "prg_t7_unending_saga",
    name: "Unending Cleave",
    icon: "spell_nature_unrelentingstorm",
    maxRanks: 3,
    position: { x: 4.5, y: 8 },
    requires: "prg_t6_apocalyptic_wrath",
    spell: {
      name: "Unending Cleave",
      description: "Whenever you land a critical strike or defeat an enemy with a Blood-Heat spending ability, its cooldown is immediately refunded.",
      flavorText: "Skalds dispute how it ends. It does not.",
      source: "talent", class: "Berserker", treeId: "primal_rage",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "primal", tags: ["passive", "capstone", "reset", "berserker"]
    },
    rankUpgrades: [
      { description: "Critical strikes and kills refund cooldown AND refund 50% of the Blood-Heat spent." },
      { description: "Critical strikes and kills refund cooldown, refund 100% of Blood-Heat spent, and grant a free melee attack." }
    ]
  }
];
