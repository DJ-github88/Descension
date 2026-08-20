// ============================================
// MARTYR — REDEMPTION (v2: talents are spells)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50.
// Resource: Devotion Gauge. Damage/healing type: sacred. The healer tree.
// ============================================

export const MARTYR_REDEMPTION = [
  {
    id: "rdm_t1_lay_on_hands",
    name: "Lay on Hands",
    icon: "spell_holy_layonhands",
    maxRanks: 3,
    position: { x: 0.5, y: 0 },
    requires: null,
    spell: {
      name: "Lay on Hands",
      description: "The Martyr's touch channels Sol's radiant mercy. Lay hands on a creature within 5 feet to heal 2d6 health. Costs 1 Devotion.",
      flavorText: "The light passes through you like a toll road. Worth it.",
      source: "talent", class: "Martyr", treeId: "redemption",
      spellType: "ACTIVE", category: "healing",
      targetingMode: "single", rangeType: "touch", range: 5,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 6, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { devotion: { baseAmount: 1 } },
      healing: { dice: "2d6", flat: 0 },
      visualTheme: "sacred", tags: ["healing", "touch", "martyr"]
    },
    rankUpgrades: [
      { description: "The Martyr's touch channels Sol's radiant mercy. Lay hands on a creature within 5 feet to heal 4d6 health. Costs 1 Devotion.", healing: { dice: "4d6", flat: 0 } },
      { description: "The Martyr's touch channels Sol's radiant mercy. Lay hands on a creature within 5 feet to heal 6d6 health, and overfill grants the target 5 temporary health. Costs 1 Devotion.", healing: { dice: "6d6", flat: 0 } }
    ]
  },
  {
    id: "rdm_t1_healing_touch",
    name: "Healing Touch",
    icon: "spell_holy_healingtouch",
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    spell: {
      name: "Healing Touch",
      description: "The sacred light of Sol flows through your hands. Spend 1 Action Point to heal an ally within touch range for 1d8 plus your level.",
      flavorText: "Small mercies, delivered constantly.",
      source: "talent", class: "Martyr", treeId: "redemption",
      spellType: "ACTIVE", category: "healing",
      targetingMode: "single", rangeType: "touch", range: 5,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 8, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 5 } },
      healing: { dice: "1d8", flat: 2 },
      visualTheme: "sacred", tags: ["healing", "cheap", "martyr"]
    },
    rankUpgrades: [
      { description: "The sacred light of Sol flows through your hands. Spend 1 Action Point to heal an ally within touch range for 2d8 plus your level.", healing: { dice: "2d8", flat: 2 } },
      { description: "The sacred light of Sol flows through your hands. Spend 1 Action Point to heal an ally within touch range for 3d8 plus your level.", healing: { dice: "3d8", flat: 2 } }
    ]
  },
  {
    id: "rdm_t1_purify",
    name: "Purify",
    icon: "spell_holy_purifyingpower",
    maxRanks: 2,
    position: { x: 3.5, y: 0 },
    requires: null,
    spell: {
      name: "Purify",
      description: "The Martyr offers suffering to Sol to cleanse the impure. Remove all poison and disease effects from one creature within 30 feet.",
      flavorText: "You take a little of it with you. Sol insists.",
      source: "talent", class: "Martyr", treeId: "redemption",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "single", rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 12, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { devotion: { baseAmount: 1 } },
      visualTheme: "sacred", tags: ["cleanse", "utility", "martyr"]
    },
    rankUpgrades: [
      { description: "The Martyr offers suffering to Sol to cleanse the impure. Remove all poison, disease, and curse effects from one creature within 30 feet, and they regain 1d6 health." }
    ]
  },

  {
    id: "rdm_t2_cure_wounds",
    name: "Cure Wounds",
    icon: "spell_holy_renew",
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: "rdm_t1_lay_on_hands",
    spell: {
      name: "Cure Wounds",
      description: "Sol's sacred light knits flesh and spirit alike. Heal an ally within 30 feet for 3d8 plus your Spirit modifier.",
      flavorText: "Sutures, but preached.",
      source: "talent", class: "Martyr", treeId: "redemption",
      spellType: "ACTIVE", category: "healing",
      targetingMode: "single", rangeType: "ranged", range: 30,
      castTimeType: "short", castTimeValue: 1,
      cooldownCategory: "short", cooldownValue: 10, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { mana: { baseAmount: 10 } },
      healing: { dice: "3d8", flat: 0 },
      visualTheme: "sacred", tags: ["healing", "martyr"]
    },
    rankUpgrades: [
      { description: "Sol's sacred light knits flesh and spirit alike. Heal an ally within 30 feet for 5d8 plus your Spirit modifier.", healing: { dice: "5d8", flat: 0 } },
      { description: "Sol's sacred light knits flesh and spirit alike. Heal an ally within 30 feet for 7d8 plus your Spirit modifier; overhealing becomes a sacred shield.", healing: { dice: "7d8", flat: 0 } }
    ]
  },
  {
    id: "rdm_t2_restoring_light",
    name: "Restoring Light",
    icon: "spell_holy_restoration",
    maxRanks: 3,
    position: { x: 3.5, y: 1 },
    requires: "rdm_t1_purify",
    spell: {
      name: "Restoring Light",
      description: "Sol's purifying radiance shines through your sacrifice. Heal one condition (blinded, deafened, paralyzed, or frightened) from an ally within 30 feet.",
      flavorText: "The light also does windows.",
      source: "talent", class: "Martyr", treeId: "redemption",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "single", rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 15, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { devotion: { baseAmount: 2 } },
      visualTheme: "sacred", tags: ["cleanse", "condition", "martyr"]
    },
    rankUpgrades: [
      { description: "Sol's purifying radiance shines through your sacrifice. Heal TWO conditions (blinded, deafened, paralyzed, or frightened) from an ally within 30 feet." },
      { description: "Sol's purifying radiance shines through your sacrifice. Heal ALL conditions from an ally within 30 feet and grant them advantage on their next save." }
    ]
  },

  {
    id: "rdm_t3_mass_healing",
    name: "Mass Healing",
    icon: "spell_holy_prayerofhealing",
    maxRanks: 3,
    position: { x: 1.5, y: 2 },
    requires: "rdm_t2_cure_wounds",
    spell: {
      name: "Mass Healing",
      description: "Your martyred spirit spreads Sol's blessing to all nearby. Heal up to 3 creatures within 30 feet for 2d6 health each. Costs 2 Devotion.",
      flavorText: "One light, many windows.",
      source: "talent", class: "Martyr", treeId: "redemption",
      spellType: "ACTIVE", category: "healing",
      targetingMode: "aoe", rangeType: "ranged", range: 30, aoeShape: "circle", aoeSize: 30,
      castTimeType: "short", castTimeValue: 1.5,
      cooldownCategory: "medium", cooldownValue: 18, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: true,
      resourceCosts: { devotion: { baseAmount: 2 }, mana: { baseAmount: 10 } },
      healing: { dice: "2d6", flat: 0 },
      visualTheme: "sacred", tags: ["healing", "aoe", "martyr"]
    },
    rankUpgrades: [
      { description: "Your martyred spirit spreads Sol's blessing to all nearby. Heal up to 4 creatures within 30 feet for 3d6 health each. Costs 2 Devotion.", healing: { dice: "3d6", flat: 0 } },
      { description: "Your martyred spirit spreads Sol's blessing to all nearby. Heal up to 5 creatures within 40 feet for 4d6 health each. Costs 2 Devotion.", healing: { dice: "4d6", flat: 0 } }
    ]
  },
  {
    id: "rdm_t3_healing_aura",
    name: "Healing Aura",
    icon: "spell_holy_divineprovidence",
    maxRanks: 3,
    position: { x: 3.5, y: 2 },
    requires: "rdm_t2_restoring_light",
    spell: {
      name: "Healing Aura",
      description: "Sol's unwavering light emanates from your selfless form. Allies within 20 feet regain 1d6 health at the start of their turns. Costs 3 Devotion to ignite for 1 minute.",
      flavorText: "Standing near you is a medical plan.",
      source: "talent", class: "Martyr", treeId: "redemption",
      spellType: "ACTIVE", category: "healing",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 20,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 60, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { devotion: { baseAmount: 3 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      healing: { dice: "1d6", flat: 0, isHoT: true, hotDuration: 6, hotTick: "1d6" },
      buffs: ["healing-aura"], visualTheme: "sacred", tags: ["aura", "hot", "martyr"]
    },
    rankUpgrades: [
      { description: "Sol's unwavering light emanates from your selfless form. Allies within 30 feet regain 2d6 health at the start of their turns. Costs 3 Devotion for 1 minute.", healing: { dice: "2d6", flat: 0, isHoT: true, hotDuration: 6, hotTick: "2d6" } },
      { description: "Sol's unwavering light emanates from your selfless form. Allies within 30 feet regain 3d6 health at the start of their turns, and the aura also cleanses one poison per turn. Costs 3 Devotion for 1 minute.", healing: { dice: "3d6", flat: 0, isHoT: true, hotDuration: 6, hotTick: "3d6" } }
    ]
  },

  {
    id: "rdm_t4_greater_restoration",
    name: "Greater Restoration",
    icon: "spell_holy_greaterheal",
    maxRanks: 3,
    position: { x: 1.5, y: 3 },
    requires: "rdm_t3_mass_healing",
    spell: {
      name: "Greater Restoration",
      description: "Through your sacrifice, Sol's full glory restores the broken. Remove all curses, diseases, poisons, and conditions from one creature, and restore it to full consciousness. Costs 3 Devotion.",
      flavorText: "Full factory reset, blessed edition.",
      source: "talent", class: "Martyr", treeId: "redemption",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "single", rangeType: "ranged", range: 30,
      castTimeType: "short", castTimeValue: 1,
      cooldownCategory: "long", cooldownValue: 45, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: true,
      resourceCosts: { devotion: { baseAmount: 3 }, mana: { baseAmount: 15 } },
      visualTheme: "sacred", tags: ["cleanse", "restoration", "martyr"]
    },
    rankUpgrades: [
      { description: "Through your sacrifice, Sol's full glory restores the broken. Remove all curses, diseases, poisons, and conditions from one creature, restore consciousness, and heal 4d8. Costs 3 Devotion.", healing: { dice: "4d8", flat: 0 } },
      { description: "Through your sacrifice, Sol's full glory restores the broken. Remove all curses, diseases, poisons, and conditions from ALL allies within 15 feet, restore consciousness, and heal 4d8 each. Costs 3 Devotion.", healing: { dice: "4d8", flat: 0 } }
    ]
  },
  {
    id: "rdm_t4_blessed_sacrifice",
    name: "Blessed Sacrifice",
    icon: "spell_holy_blessingofsacrifice",
    maxRanks: 2,
    position: { x: 3, y: 3 },
    requires: "rdm_t3_healing_aura",
    spell: {
      name: "Blessed Sacrifice",
      description: "Your healing deepens as your own light dims. You may spend your own health to power healing spells at a rate of 5 health per 1 Devotion. This spending ignores your Devotion cap.",
      flavorText: "The ledger balances. Just not in your favor.",
      source: "talent", class: "Martyr", treeId: "redemption",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "resource", "sacrifice", "martyr"]
    },
    rankUpgrades: [
      { description: "Your healing deepens as your own light dims. You may spend your own health to power healing spells at a rate of 3 health per 1 Devotion, and healing done this way is increased by 25%." }
    ]
  },

  {
    id: "rdm_t5_miracle",
    name: "Miracle",
    icon: "spell_holy_holyguidance",
    maxRanks: 3,
    position: { x: 2, y: 4.5 },
    requires: "rdm_t4_greater_restoration",
    spell: {
      name: "Miracle",
      description: "Your ultimate offering channels Sol's impossible grace. Duplicate any spell of 3rd level or lower that you have witnessed this combat, without cost. Costs 4 Devotion.",
      flavorText: "Sol signs the paperwork personally.",
      source: "talent", class: "Martyr", treeId: "redemption",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "short", castTimeValue: 2,
      cooldownCategory: "long", cooldownValue: 120, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: false, interruptible: true,
      resourceCosts: { devotion: { baseAmount: 4 } },
      visualTheme: "sacred", tags: ["miracle", "flexible", "martyr"]
    },
    rankUpgrades: [
      { description: "Your ultimate offering channels Sol's impossible grace. Duplicate any spell of 5th level or lower that you have witnessed this combat, without cost. Costs 4 Devotion." },
      { description: "Your ultimate offering channels Sol's impossible grace. Duplicate any spell of 7th level or lower that you have witnessed this combat, without cost, and its caster level uses YOUR Spirit. Costs 4 Devotion." }
    ]
  },
  {
    id: "rdm_t5_light_of_sol",
    name: "Light of Sol",
    icon: "spell_holy_surf_of_light",
    maxRanks: 2,
    position: { x: 2.5, y: 4.5 },
    requires: "rdm_t4_blessed_sacrifice",
    spell: {
      name: "Light of Sol",
      description: "Sol's breath moves through you in tides. Your healing spells have 25% increased range and heal for an additional 1d6.",
      flavorText: "The tide keeps office hours no longer.",
      source: "talent", class: "Martyr", treeId: "redemption",
      spellType: "PASSIVE", category: "healing",
      targetingMode: "self",
      healing: { dice: "1d6", flat: 0 },
      visualTheme: "sacred", tags: ["passive", "empower", "martyr"]
    },
    rankUpgrades: [
      { description: "Sol's breath moves through you in tides. Your healing spells have 30% increased range and heal for an additional 1d8.", healing: { dice: "1d8", flat: 0 } }
    ]
  },

  {
    id: "rdm_t6_resurrection",
    name: "Resurrection",
    icon: "spell_holy_resurrection",
    maxRanks: 1,
    position: { x: 1.5, y: 6 },
    requires: "rdm_t5_miracle",
    spell: {
      name: "Resurrection",
      description: "Sol's sacred light pierces the veil of death itself. Return a creature dead less than 10 days to life with half health. The ritual costs 5 Devotion and deals 4d6 unpreventable damage to you.",
      flavorText: "Death reads the warrant, finds Sol's signature, apologizes.",
      source: "talent", class: "Martyr", treeId: "redemption",
      spellType: "ACTIVE", category: "healing",
      targetingMode: "single", rangeType: "touch", range: 5,
      castTimeType: "long", castTimeValue: 6,
      cooldownCategory: "long", cooldownValue: 300, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: true,
      resourceCosts: { devotion: { baseAmount: 5 }, health: { baseAmount: 4, costType: "dice" } },
      visualTheme: "sacred", tags: ["resurrection", "ritual", "martyr"]
    }
  },
  {
    id: "rdm_t6_steadfast_prayer",
    name: "Steadfast Prayer",
    icon: "spell_holy_blessedrecovery",
    maxRanks: 2,
    position: { x: 2, y: 6 },
    requires: "rdm_t5_miracle",
    spell: {
      name: "Steadfast Prayer",
      description: "Devotion renews itself in rhythm. You regain 1 Devotion at the start of each of your turns while below half health.",
      flavorText: "The prayer sharpens when the hour does.",
      source: "talent", class: "Martyr", treeId: "redemption",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "resource", "martyr"]
    },
    rankUpgrades: [
      { description: "Devotion renews itself in rhythm. You regain 1 Devotion at the start of each of your turns, increased to 2 while below half health." }
    ]
  },
  {
    id: "rdm_t6_holy_resonance",
    name: "Holy Resonance",
    icon: "spell_holy_powerwordbarrier",
    maxRanks: 2,
    position: { x: 2.5, y: 6 },
    requires: "rdm_t5_light_of_sol",
    spell: {
      name: "Holy Resonance",
      description: "Your healing lingers like struck bronze. Healing over a target's maximum grants them a sacred shield equal to the overflow, lasting 1 round.",
      flavorText: "The note holds after the bell.",
      source: "talent", class: "Martyr", treeId: "redemption",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "shield", "overflow", "martyr"]
    },
    rankUpgrades: [
      { description: "Your healing lingers like struck bronze. Healing over a target's maximum grants them a sacred shield equal to the overflow for 2 rounds, and the shield reflects 10% of absorbed damage as sacred." }
    ]
  },

  {
    id: "rdm_t7_wardens_hand",
    name: "Warden's Hand",
    icon: "spell_holy_divineintervention",
    maxRanks: 1,
    position: { x: 0.5, y: 8 },
    requires: "rdm_t6_resurrection",
    spell: {
      name: "Warden's Hand",
      description: "ULTIMATE: Sol answers your sacrifice with undeniable power. Costs all current Devotion: one ally (or you) automatically succeeds on any one roll or save — this may force a failed enemy roll to be rerolled — and is immediately healed to full. Once per combat.",
      flavorText: "The hand does not negotiate with probability.",
      source: "talent", class: "Martyr", treeId: "redemption",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "single", rangeType: "ranged", range: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 180, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { devotion: { baseAmount: 6 } },
      buffs: ["intervention"], visualTheme: "sacred", tags: ["ultimate", "capstone", "intervention", "martyr"]
    }
  },
  {
    id: "rdm_t7_wellspring",
    name: "Wellspring",
    icon: "spell_holy_innerfire",
    maxRanks: 5,
    position: { x: 1.5, y: 8 },
    requires: "rdm_t6_steadfast_prayer",
    spell: {
      name: "Wellspring",
      description: "Your reservoir of grace deepens. Your maximum Devotion increases by 1.",
      flavorText: "Deeper faith, bigger bucket.",
      source: "talent", class: "Martyr", treeId: "redemption",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "capstone", "resource", "martyr"]
    },
    rankUpgrades: [
      { description: "Your reservoir of grace deepens. Your maximum Devotion increases by 2." },
      { description: "Your reservoir of grace deepens. Your maximum Devotion increases by 3." },
      { description: "Your reservoir of grace deepens. Your maximum Devotion increases by 4." },
      { description: "Your reservoir of grace deepens. Your maximum Devotion increases by 5, and Lay on Hands costs no Devotion." }
    ]
  },
  {
    id: "rdm_t7_tithe_of_light",
    name: "Tithe of Light",
    icon: "spell_holy_retributionaura",
    maxRanks: 3,
    position: { x: 2, y: 8 },
    requires: "rdm_t6_steadfast_prayer",
    spell: {
      name: "Tithe of Light",
      description: "Healing tithes back to the healer. When you heal an ally for 10 or more, you regain 1 Devotion.",
      flavorText: "Give generously. Sol receipts 10%.",
      source: "talent", class: "Martyr", treeId: "redemption",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "capstone", "resource", "martyr"]
    },
    rankUpgrades: [
      { description: "Healing tithes back to the healer. When you heal an ally for 10 or more, you regain 1 Devotion and 2 health." },
      { description: "Healing tithes back to the healer. When you heal an ally for 10 or more, you regain 2 Devotion and 4 health." }
    ]
  },
  {
    id: "rdm_t7_sanctified_mending",
    name: "Sanctified Mending",
    icon: "spell_holy_serendipity",
    maxRanks: 3,
    position: { x: 2.5, y: 8 },
    requires: "rdm_t6_holy_resonance",
    spell: {
      name: "Sanctified Mending",
      description: "Your critical heals become scripture. When your healing spell rolls its maximum value, its target also gains +2 Durability Steps to equipped durability for 2 rounds.",
      flavorText: "Some prayers land perfectly. Those ones echo.",
      source: "talent", class: "Martyr", treeId: "redemption",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "capstone", "crit", "martyr"]
    },
    rankUpgrades: [
      { description: "Your critical heals become scripture. When your healing spell rolls its maximum value, its target also gains +3 Durability Steps to equipped durability for 2 rounds and cleanses one fear effect." },
      { description: "Your critical heals become scripture. When your healing rolls maximum, the target gains +3 Durability Steps to equipped durability for 3 rounds, cleanses one fear, and your next heal within 6 seconds costs 1 less Devotion (minimum 0)." }
    ]
  },
  {
    id: "rdm_t7_eternal_vigil_light",
    name: "Eternal Vigil",
    icon: "spell_holy_prayerofspirit",
    maxRanks: 3,
    position: { x: 3.5, y: 8 },
    requires: "rdm_t6_holy_resonance",
    spell: {
      name: "Eternal Vigil",
      description: "You do not fall while others stand unhealed. While any ally is below half health, your healing spells are empowered: they cannot be interrupted and heal 10% more.",
      flavorText: "Rest is for the bandaged.",
      source: "talent", class: "Martyr", treeId: "redemption",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "capstone", "empower", "martyr"]
    },
    rankUpgrades: [
      { description: "You do not fall while others stand unhealed. While any ally is below half health, your healing spells are empowered: they cannot be interrupted and heal 20% more." },
      { description: "You do not fall while others stand unhealed. While any ally is below half health, your healing heals 30% more, cannot be interrupted, and its cast time is halved." }
    ]
  }
];
