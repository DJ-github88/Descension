// ============================================
// AUGUR — AUSPICE (v2: talents are spells)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50.
// Resources: Benediction (even d20) + Malediction (odd d20). The balance tree.
// ============================================

export const AUGUR_AUSPICE = [
  {
    id: "aus_t1_harmonic_sight",
    name: "Harmonic Sight",
    icon: "spell_holy_mindvision",
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    spell: {
      name: "Harmonic Sight",
      description: "You see both the light and the dark in every omen. At the start of each combat, you gain 1 Benediction and 1 Malediction.",
      flavorText: "The gutters of fate reflect the stars. Read both.",
      source: "talent", class: "Augur", treeId: "auspice",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "resource", "augur"]
    },
    rankUpgrades: [
      { description: "You see both the light and the dark in every omen. At the start of each combat, you gain 2 Benediction and 2 Malediction." },
      { description: "You see both the light and the dark in every omen. At the start of each combat, you gain 3 Benediction and 3 Malediction." }
    ]
  },
  {
    id: "aus_t1_omen_synthesis",
    name: "Omen Synthesis",
    icon: "spell_arcane_arcane01",
    maxRanks: 3,
    position: { x: 0.5, y: 1 },
    requires: null,
    spell: {
      name: "Omen Synthesis",
      description: "Fate's ledger balances on demand. Once per round, convert 2 Benediction into 1 Malediction, or 2 Malediction into 1 Benediction.",
      flavorText: "Every debt is just a blessing facing the other way.",
      source: "talent", class: "Augur", treeId: "auspice",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 6, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { mana: { baseAmount: 0 } },
      visualTheme: "arcane", tags: ["resource", "conversion", "augur"]
    },
    rankUpgrades: [
      { description: "Fate's ledger balances on demand. Once per round, convert 1 Benediction into 1 Malediction, or 1 Malediction into 1 Benediction." },
      { description: "Fate's ledger balances on demand. Once per round, convert 1 Benediction into 1 Malediction or back, and gain 1 additional point of the chosen resource." }
    ]
  },
  {
    id: "aus_t1_balanced_step",
    name: "Balanced Step",
    icon: "spell_holy_heroism",
    maxRanks: 2,
    position: { x: 3.5, y: 1 },
    requires: null,
    spell: {
      name: "Balanced Step",
      description: "Equilibrium is durability for the soul. While your Benediction and Malediction are within 2 points of each other, you gain +1 to all saving throws.",
      flavorText: "Stand in the middle of the scale. It is the only quiet place.",
      source: "talent", class: "Augur", treeId: "auspice",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "defense", "balance", "augur"]
    },
    rankUpgrades: [
      { description: "Equilibrium is durability for the soul. While your Benediction and Malediction are within 2 points of each other, you gain +2 to all saving throws and +1 Durability Steps to equipped durability." }
    ]
  },

  {
    id: "aus_t2_dual_reading",
    name: "Dual Reading",
    icon: "spell_holy_divineprovidence",
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: "aus_t1_harmonic_sight",
    spell: {
      name: "Dual Reading",
      description: "The Astril Synod reads fate in crystal-lattice refractions. When you generate Benediction or Malediction from a d20, you gain 1 additional point of the same type.",
      flavorText: "One refraction, two readings. The Synod bills accordingly.",
      source: "talent", class: "Augur", treeId: "auspice",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "resource", "augur"]
    },
    rankUpgrades: [
      { description: "The Astril Synod reads fate in crystal-lattice refractions. When you generate Benediction or Malediction from a d20, you gain 1 additional point of BOTH types." },
      { description: "The Astril Synod reads fate in crystal-lattice refractions. When you generate Benediction or Malediction from a d20, you gain 2 additional points of BOTH types." }
    ]
  },
  {
    id: "aus_t2_harmonic_bolt",
    name: "Harmonic Bolt",
    icon: "spell_arcane_prismaticbolt",
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: "aus_t1_omen_synthesis",
    spell: {
      name: "Harmonic Bolt",
      description: "Light and dark leave the hand as one. Spend 1 Benediction and 1 Malediction: hurl a bolt at a target within 60 feet dealing 2d6 sacred and 2d6 wyrd damage.",
      flavorText: "It argues both sides. Violently.",
      source: "talent", class: "Augur", treeId: "auspice",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "ranged", range: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "short", cooldownValue: 6, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { benediction: { baseAmount: 1 }, malediction: { baseAmount: 1 } },
      damageTypes: ["sacred", "wyrd"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      visualTheme: "arcane", tags: ["damage", "dual", "augur"]
    },
    rankUpgrades: [
      { description: "Light and dark leave the hand as one. Spend 1 Benediction and 1 Malediction: hurl a bolt at a target within 60 feet dealing 3d6 sacred and 3d6 wyrd damage.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } },
      { description: "Light and dark leave the hand as one. Spend 1 Benediction and 1 Malediction: hurl a bolt at a target within 60 feet dealing 4d6 sacred and 4d6 wyrd damage.", primaryDamage: { dice: "4d6", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "aus_t3_zone_of_balance",
    name: "Zone of Balance",
    icon: "spell_arcane_portalironforge",
    maxRanks: 3,
    position: { x: 1, y: 3.5 },
    requires: "aus_t2_dual_reading",
    spell: {
      name: "Zone of Balance",
      description: "Draw the scale onto the ground. Spend 2 Benediction and 2 Malediction: create a 15-foot zone for 3 rounds — allies inside gain +1 to all rolls, enemies inside suffer -1 to all rolls.",
      flavorText: "Inside the chalk circle, arithmetic is a weapon.",
      source: "talent", class: "Augur", treeId: "auspice",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "aoe", rangeType: "ranged", range: 30, aoeShape: "circle", aoeSize: 15,
      castTimeType: "short", castTimeValue: 1,
      cooldownCategory: "medium", cooldownValue: 20, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: true,
      resourceCosts: { benediction: { baseAmount: 2 }, malediction: { baseAmount: 2 } },
      durationRounds: 3, durationRealTime: 18, durationUnit: "seconds",
      debuffs: ["zone"], visualTheme: "arcane", tags: ["zone", "control", "augur"]
    },
    rankUpgrades: [
      { description: "Draw the scale onto the ground. Spend 2 Benediction and 2 Malediction: create a 20-foot zone for 3 rounds — allies inside gain +1 to all rolls, enemies inside suffer -2 to all rolls." },
      { description: "Draw the scale onto the ground. Spend 2 Benediction and 2 Malediction: create a 20-foot zone for 4 rounds — allies inside gain +2 to all rolls, enemies inside suffer -2 to all rolls." }
    ]
  },
  {
    id: "aus_t3_resource_flow",
    name: "Resource Flow",
    icon: "spell_holy_layonhands",
    maxRanks: 3,
    position: { x: 3, y: 3.5 },
    requires: "aus_t2_harmonic_bolt",
    spell: {
      name: "Resource Flow",
      description: "Balanced spending returns to the source. When you spend both Benediction and Malediction on the same spell, refund 1 of each.",
      flavorText: "Fate rounds down. For you, it rounds up.",
      source: "talent", class: "Augur", treeId: "auspice",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "resource", "refund", "augur"]
    },
    rankUpgrades: [
      { description: "Balanced spending returns to the source. When you spend both Benediction and Malediction on the same spell, refund 1 of each and gain 2 mana." },
      { description: "Balanced spending returns to the source. When you spend both Benediction and Malediction on the same spell, refund 2 of each." }
    ]
  },

  {
    id: "aus_t4_twin_blessing",
    name: "Twin Blessing",
    icon: "spell_holy_prayerofmendingtga",
    maxRanks: 3,
    position: { x: 1.5, y: 4.5 },
    requires: "aus_t3_zone_of_balance",
    spell: {
      name: "Twin Blessing",
      description: "Two fates, one gesture. Spend 3 Benediction and 3 Malediction: bless two allies within 30 feet — the first gains +2 to attack rolls, the second +2 to saving throws, for 3 rounds.",
      flavorText: "Divide the omen, double the goodwill.",
      source: "talent", class: "Augur", treeId: "auspice",
      spellType: "ACTIVE", category: "buff",
      targetingMode: "aoe", rangeType: "ranged", range: 30, aoeShape: "circle", aoeSize: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 25, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { benediction: { baseAmount: 3 }, malediction: { baseAmount: 3 } },
      durationRounds: 3, durationRealTime: 18, durationUnit: "seconds",
      buffs: ["twin-blessing"], visualTheme: "sacred", tags: ["buff", "ally", "augur"]
    },
    rankUpgrades: [
      { description: "Two fates, one gesture. Spend 3 Benediction and 3 Malediction: bless two allies within 30 feet — the first gains +3 to attack rolls, the second +3 to saving throws, for 3 rounds." },
      { description: "Two fates, one gesture. Spend 3 Benediction and 3 Malediction: bless two allies within 30 feet — both gain +3 to attack rolls AND +3 to saving throws, for 4 rounds." }
    ]
  },
  {
    id: "aus_t4_sign_of_equilibrium",
    name: "Sign of Equilibrium",
    icon: "spell_holy_mindsoothe",
    maxRanks: 2,
    position: { x: 2.5, y: 4.5 },
    requires: "aus_t3_resource_flow",
    spell: {
      name: "Sign of Equilibrium",
      description: "Extremes feed the center. When an enemy within 30 feet rolls a natural 20, you gain 2 Benediction. When an enemy within 30 feet rolls a natural 1, you gain 2 Malediction.",
      flavorText: "Their best day and their worst are both your paycheck.",
      source: "talent", class: "Augur", treeId: "auspice",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "resource", "augur"]
    },
    rankUpgrades: [
      { description: "Extremes feed the center. When an enemy within 60 feet rolls a natural 20, you gain 2 Benediction. When an enemy within 60 feet rolls a natural 1, you gain 2 Malediction." }
    ]
  },

  {
    id: "aus_t5_perfect_balance",
    name: "Perfect Balance",
    icon: "spell_holy_divineintervention",
    maxRanks: 3,
    position: { x: 1.5, y: 5.5 },
    requires: "aus_t4_twin_blessing",
    spell: {
      name: "Perfect Balance",
      description: "When the scale is level, fate stops arguing. When you cast a spell spending equal Benediction and Malediction, all its dice roll their maximum. Once per short rest.",
      flavorText: "No randomness survives true neutrality.",
      source: "talent", class: "Augur", treeId: "auspice",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "empower", "augur"]
    },
    rankUpgrades: [
      { description: "When the scale is level, fate stops arguing. When you cast a spell spending equal Benediction and Malediction, all its dice roll their maximum. Twice per short rest." },
      { description: "When the scale is level, fate stops arguing. When you cast a spell spending equal Benediction and Malediction, all its dice roll their maximum. Three times per short rest." }
    ]
  },
  {
    id: "aus_t5_quick_interpret",
    name: "Quick Interpret",
    icon: "inv_misc_rune_01",
    maxRanks: 2,
    position: { x: 2.5, y: 5.5 },
    requires: "aus_t4_sign_of_equilibrium",
    spell: {
      name: "Quick Interpret",
      description: "The first reading of a battle is always half price. Your first omen-spell each combat costs 1 less Benediction and 1 less Malediction (minimum 0).",
      flavorText: "Openings are cheap. Endings are not.",
      source: "talent", class: "Augur", treeId: "auspice",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "cost", "augur"]
    },
    rankUpgrades: [
      { description: "The first reading of a battle is always half price. Your first TWO omen-spells each combat cost 1 less Benediction and 1 less Malediction (minimum 0)." }
    ]
  },

  {
    id: "aus_t6_omen_mastery",
    name: "Omen Mastery",
    icon: "spell_holy_exorcism",
    maxRanks: 1,
    position: { x: 1, y: 6.5 },
    requires: "aus_t5_perfect_balance",
    spell: {
      name: "Omen Mastery",
      description: "You have read so many omens that they read you back. Your Benediction and Malediction caps each increase by 3, and you gain 1 Benediction and 1 Malediction at the start of each of your turns.",
      flavorText: "The gore no longer startles. It files its reports.",
      source: "talent", class: "Augur", treeId: "auspice",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["resource", "cap", "augur"]
    }
  },
  {
    id: "aus_t6_cosmic_echo",
    name: "Cosmic Echo",
    icon: "spell_holy_holyguidance",
    maxRanks: 2,
    position: { x: 2, y: 6.5 },
    requires: "aus_t5_quick_interpret",
    spell: {
      name: "Cosmic Echo",
      description: "Balanced works echo back to their author. When a dual-resource spell of yours resolves, regain half the Benediction and Malediction it spent (rounded down).",
      flavorText: "What leaves in balance returns in balance.",
      source: "talent", class: "Augur", treeId: "auspice",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "resource", "refund", "augur"]
    },
    rankUpgrades: [
      { description: "Balanced works echo back to their author. When a dual-resource spell of yours resolves, regain half the Benediction and Malediction it spent (rounded up)." }
    ]
  },
  {
    id: "aus_t6_auspice_aura",
    name: "Auspice Aura",
    icon: "spell_arcane_prismaticcloak",
    maxRanks: 2,
    position: { x: 3, y: 6.5 },
    requires: "aus_t5_perfect_balance",
    spell: {
      name: "Auspice Aura",
      description: "Every die thrown near you lands on your ledger. All d20 rolls by creatures within 30 feet also generate Benediction or Malediction for you as if you had rolled them.",
      flavorText: "The battlefield is one long sentence and you are reading it aloud.",
      source: "talent", class: "Augur", treeId: "auspice",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "resource", "aura", "augur"]
    },
    rankUpgrades: [
      { description: "Every die thrown near you lands on your ledger. All d20 rolls by creatures within 60 feet also generate Benediction or Malediction for you as if you had rolled them." }
    ]
  },

  {
    id: "aus_t7_auspice_supreme",
    name: "Auspice Supreme",
    icon: "spell_arcane_prismaticcloak",
    maxRanks: 1,
    position: { x: 0.5, y: 8 },
    requires: "aus_t6_omen_mastery",
    spell: {
      name: "Auspice Supreme",
      description: "ULTIMATE: Rewind the entire exchange. Spend 8 Benediction and 8 Malediction: every enemy within 60 feet must reroll their last action's d20s with disadvantage, while every ally rerolls theirs with advantage. The better result applies for each.",
      flavorText: "Round two. This time fate has been paid.",
      source: "talent", class: "Augur", treeId: "auspice",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "aoe", rangeType: "self", range: 0, aoeShape: "circle", aoeSize: 60,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "long", cooldownValue: 180, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { benediction: { baseAmount: 8 }, malediction: { baseAmount: 8 } },
      debuffs: ["fate-rewind"], visualTheme: "arcane", tags: ["ultimate", "capstone", "reroll", "augur"]
    }
  },
  {
    id: "aus_t7_equilibrium_mastery",
    name: "Equilibrium Mastery",
    icon: "spell_arcane_arcane_resistance",
    maxRanks: 5,
    position: { x: 1.5, y: 8 },
    requires: "aus_t6_cosmic_echo",
    spell: {
      name: "Equilibrium Mastery",
      description: "Your reservoirs widen to hold the whole argument. Your Benediction and Malediction caps each increase by 1.",
      flavorText: "Bigger vessels, same storm.",
      source: "talent", class: "Augur", treeId: "auspice",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "capstone", "resource", "augur"]
    },
    rankUpgrades: [
      { description: "Your reservoirs widen to hold the whole argument. Your Benediction and Malediction caps each increase by 2." },
      { description: "Your reservoirs widen to hold the whole argument. Your Benediction and Malediction caps each increase by 3." },
      { description: "Your reservoirs widen to hold the whole argument. Your Benediction and Malediction caps each increase by 4." },
      { description: "Your reservoirs widen to hold the whole argument. Your Benediction and Malediction caps each increase by 6." }
    ]
  },
  {
    id: "aus_t7_harmonic_overload",
    name: "Harmonic Overload",
    icon: "spell_arcane_prismaticbolt",
    maxRanks: 3,
    position: { x: 2, y: 8 },
    requires: "aus_t6_cosmic_echo",
    spell: {
      name: "Harmonic Overload",
      description: "The bolt learns to carry more of both arguments. Harmonic Bolt deals an additional 1d6 sacred and 1d6 wyrd damage.",
      flavorText: "Turn the refraction up until it hums.",
      source: "talent", class: "Augur", treeId: "auspice",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["sacred", "wyrd"],
      visualTheme: "arcane", tags: ["passive", "capstone", "damage", "augur"]
    },
    rankUpgrades: [
      { description: "The bolt learns to carry more of both arguments. Harmonic Bolt deals an additional 2d6 sacred and 2d6 wyrd damage." },
      { description: "The bolt learns to carry more of both arguments. Harmonic Bolt deals an additional 3d6 sacred and 3d6 wyrd damage, and its cooldown is reduced by 2 seconds." }
    ]
  },
  {
    id: "aus_t7_balanced_vitality",
    name: "Balanced Vitality",
    icon: "spell_holy_powerwordbarrier",
    maxRanks: 3,
    position: { x: 2.5, y: 8 },
    requires: "aus_t6_auspice_aura",
    spell: {
      name: "Balanced Vitality",
      description: "Equilibrium knits the body closed. While Balanced Step is active, you gain 5 temporary health at the start of each of your turns.",
      flavorText: "The scale heals its keeper.",
      source: "talent", class: "Augur", treeId: "auspice",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "sacred", tags: ["passive", "capstone", "defense", "augur"]
    },
    rankUpgrades: [
      { description: "Equilibrium knits the body closed. While Balanced Step is active, you gain 10 temporary health at the start of each of your turns." },
      { description: "Equilibrium knits the body closed. While Balanced Step is active, you gain 10 temporary health and +2 Durability Steps to equipped durability." }
    ]
  },
  {
    id: "aus_t7_duality_ward",
    name: "Duality Ward",
    icon: "spell_arcane_blink",
    maxRanks: 3,
    position: { x: 3.5, y: 8 },
    requires: "aus_t6_auspice_aura",
    spell: {
      name: "Duality Ward",
      description: "Every balanced cast leaves a shell behind. When you spend both Benediction and Malediction on one spell, gain 4 temporary health.",
      flavorText: "Spending in balance, defended in kind.",
      source: "talent", class: "Augur", treeId: "auspice",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "arcane", tags: ["passive", "capstone", "defense", "augur"]
    },
    rankUpgrades: [
      { description: "Every balanced cast leaves a shell behind. When you spend both Benediction and Malediction on one spell, gain 8 temporary health." },
      { description: "Every balanced cast leaves a shell behind. When you spend both Benediction and Malediction on one spell, gain 8 temporary health and 1 Benediction." }
    ]
  }
];
