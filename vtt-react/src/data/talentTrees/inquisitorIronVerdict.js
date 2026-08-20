// ============================================
// INQUISITOR — IRON VERDICT (v2: talents are spells)
// Schema: see talentSystem.mjs. Rank N spell = rank N-1 + rankUpgrades[N-2].
// Economy: 8/6/6/5/5/5 = 30 pts (tiers 1-6) + 15 pts (tier 7) = 50.
// The anti-magic tree: counterspells, dispel fields, the singular bond.
// ============================================

export const INQUISITOR_IRON_VERDICT = [
  {
    id: "iv_t1_covenant_of_iron",
    name: "Covenant of Iron",
    icon: "ability_warlock_demonicpower",
    maxRanks: 3,
    position: { x: 0.5, y: 0 },
    requires: null,
    spell: {
      name: "Covenant of Iron",
      description: "Your singular bond yields iron control: your Wyrd-hound's DD degrades every 2 actions instead of every action, and its attacks deal 1d6 additional sacred damage.",
      flavorText: "One hound. One verdict. No appeals.",
      source: "talent", class: "Inquisitor", treeId: "iron_verdict",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["sacred"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["passive", "dd", "bond", "inquisitor"]
    },
    rankUpgrades: [
      { description: "Your hound's DD degrades every 2 actions; its attacks deal 2d6 additional sacred damage and you gain resistance to its damage type.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 }, damageTypes: ["sacred", "wyrd"] },
      { description: "DD degrades every 3 actions; hound attacks deal 3d6 additional sacred, you resist its damage type, and its critical hits restore 1 DD step.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 }, damageTypes: ["sacred", "wyrd"] }
    ]
  },
  {
    id: "iv_t1_spell_intercept",
    name: "Spell Intercept",
    icon: "spell_holy_counterspell",
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    spell: {
      name: "Spell Intercept",
      description: "As a reaction when an enemy casts a spell within 60 feet, make a ranged attack with your cold iron: on a hit the spell is countered and you gain 2 Authority.",
      flavorText: "Objection. Sustained by iron.",
      source: "talent", class: "Inquisitor", treeId: "iron_verdict",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", damageTypes: ["sacred"],
      visualTheme: "shadow", tags: ["counterspell", "reaction", "authority", "inquisitor"]
    },
    rankUpgrades: [
      { description: "React to enemy spells within 60 feet: your cold iron strike counters the spell and deals 2d6 sacred damage; gain 2 Authority on success.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } },
      { description: "React to spells within 90 feet: the counter deals 4d6 sacred damage, grants 3 Authority, and cannot miss spells below 3rd level.", primaryDamage: { dice: "4d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "iv_t1_iron_grip",
    name: "Iron Grip",
    icon: "spell_shadow_felarmour",
    maxRanks: 2,
    position: { x: 3.5, y: 0 },
    requires: null,
    spell: {
      name: "Iron Grip",
      description: "Singular focus, stronger control: spend 2 Authority to restore your Wyrd-hound's DD to d10.",
      flavorText: "The leash is also a spine.",
      source: "talent", class: "Inquisitor", treeId: "iron_verdict",
      spellType: "ACTIVE", category: "utility",
      targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 20, cooldownUnit: "seconds",
      triggersGlobalCooldown: false, usableWhileMoving: true, requiresLoS: false, interruptible: false,
      resourceCosts: { authority: { baseAmount: 2 } },
      visualTheme: "shadow", tags: ["dd", "restore", "bond", "inquisitor"]
    },
    rankUpgrades: [
      { description: "Spend 2 Authority to restore your hound's DD to d10; for 1 round after, its attacks deal maximum damage." }
    ]
  },

  {
    id: "iv_t2_mana_vortex",
    name: "Mana Vortex",
    icon: "spell_shadow_manafeed",
    maxRanks: 3,
    position: { x: 0.5, y: 1.5 },
    requires: "iv_t1_spell_intercept",
    spell: {
      name: "Mana Vortex",
      description: "The Inquisitor purges with cold iron that remembers the Wyrd's first name. When you counter a spell, a vortex drains 2d6 mana from the caster; targets with no mana take the drain as wyrd damage instead.",
      flavorText: "Their argument, confiscated.",
      source: "talent", class: "Inquisitor", treeId: "iron_verdict",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", damageTypes: ["wyrd"],
      visualTheme: "shadow", tags: ["passive", "drain", "counterspell", "inquisitor"]
    },
    rankUpgrades: [
      { description: "The Inquisitor purges with cold iron that remembers the Wyrd's first name. Counters drain 4d6 mana; drained mana beyond their capacity becomes wyrd damage.", primaryDamage: { dice: "4d6", flat: 0, procChance: 100 } },
      { description: "Counters drain 4d6 mana (overflow as wyrd damage), and half the drained mana is added to your own pool.", primaryDamage: { dice: "4d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "iv_t2_empowered_strikes",
    name: "Empowered Strikes",
    icon: "spell_fire_firebolt",
    maxRanks: 3,
    position: { x: 4, y: 1.5 },
    requires: "iv_t1_iron_grip",
    spell: {
      name: "Empowered Strikes",
      description: "Your Wyrd-hound's attacks deal 1d8 additional sacred damage, and its critical hits restore 1 DD step and grant you 1 Authority.",
      flavorText: "The verdict lands harder every time.",
      source: "talent", class: "Inquisitor", treeId: "iron_verdict",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["sacred"],
      primaryDamage: { dice: "1d8", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["passive", "hound", "damage", "inquisitor"]
    },
    rankUpgrades: [
      { description: "Hound attacks deal 2d8 additional sacred damage; crits restore 1 DD step and grant 2 Authority.", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 } },
      { description: "Hound attacks deal 3d8 additional sacred; crits restore a DD step, grant 2 Authority, and silence the victim for 1 round.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "iv_t3_spell_nullification",
    name: "Spell Nullification",
    icon: "spell_shadow_antimagicshell",
    maxRanks: 3,
    position: { x: 0.5, y: 3 },
    requires: "iv_t2_mana_vortex",
    spell: {
      name: "Spell Nullification",
      description: "Spells you counter are sealed: the caster cannot cast that spell again for 1 minute, and you may dispel one magical effect on yourself with each counter.",
      flavorText: "The word is struck from the record. And the mouth.",
      source: "talent", class: "Inquisitor", treeId: "iron_verdict",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", damageTypes: ["sacred"],
      visualTheme: "shadow", tags: ["passive", "counterspell", "seal", "inquisitor"]
    },
    rankUpgrades: [
      { description: "Countered spells are sealed 1 minute AND the caster's next spell costs 3 additional mana; each counter also dispels one effect from you." },
      { description: "Countered spells sealed for the encounter; the caster's next spell costs 6 additional mana; counters dispel one hostile effect from you AND one ally within 30 feet." }
    ]
  },
  {
    id: "iv_t3_dominant_wrath",
    name: "Dominant Wrath",
    icon: "spell_shadow_metamorphosis",
    maxRanks: 3,
    position: { x: 3.5, y: 3 },
    requires: "iv_t2_empowered_strikes",
    spell: {
      name: "Dominant Wrath",
      description: "Desperation sharpens the grip: when your Wyrd-hound's DD is at d8 or lower, its attacks deal 2d8 additional sacred damage.",
      flavorText: "The Inquisitor purges with cold iron that remembers the Wyrd's first name. So does the hound, at the end.",
      source: "talent", class: "Inquisitor", treeId: "iron_verdict",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["sacred"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["passive", "hound", "threshold", "inquisitor"]
    },
    rankUpgrades: [
      { description: "At d8 DD or lower, hound attacks deal 3d8 additional sacred damage and gain +2 to hit.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } },
      { description: "At d8 or lower, hound attacks deal 4d8 additional sacred, gain +2 to hit, and its crit range expands to 19-20.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "iv_t4_hounds_verdict",
    name: "Hound's Verdict",
    icon: "ability_paladin_judgementsofthejust",
    maxRanks: 3,
    position: { x: 0.5, y: 5 },
    requires: "iv_t3_spell_nullification",
    spell: {
      name: "Hound's Verdict",
      description: "Command your hound to deliver the verdict: it pins a spellcaster within 30 feet for 1 round — the target is restrained, cannot cast, and takes 3d8 sacred damage. Costs 3 Authority.",
      flavorText: "The court appoints teeth.",
      source: "talent", class: "Inquisitor", treeId: "iron_verdict",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "ranged", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "medium", cooldownValue: 20, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: true, requiresLoS: true, interruptible: false,
      resourceCosts: { authority: { baseAmount: 3 } },
      durationRounds: 1, durationRealTime: 6, durationUnit: "seconds",
      damageTypes: ["sacred"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      debuffs: ["pinned"], visualTheme: "shadow", tags: ["control", "anti-caster", "inquisitor"]
    },
    rankUpgrades: [
      { description: "The hound pins a spellcaster 2 rounds: restrained, silenced, taking 5d8 sacred damage.", primaryDamage: { dice: "5d8", flat: 0, procChance: 100 }, durationRounds: 2, durationRealTime: 12 },
      { description: "The hound pins 2 rounds: restrained, silenced, 6d8 sacred damage, and the pin's discharge drains 2d6 mana from the victim.", primaryDamage: { dice: "6d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "iv_t4_dispel_field",
    name: "Dispel Field",
    icon: "spell_holy_dispelmagic",
    maxRanks: 2,
    position: { x: 3.5, y: 5 },
    requires: "iv_t3_dominant_wrath",
    spell: {
      name: "Dispel Field",
      description: "Create a 15-foot anti-magic field within 60 feet for 1 minute: spells cast into it automatically fail, magical effects inside are suppressed, and spellcasters inside take 3d6 arcane damage per round. Costs 4 Authority.",
      flavorText: "Within the chalk line, magic is a rumor.",
      source: "talent", class: "Inquisitor", treeId: "iron_verdict",
      spellType: "ACTIVE", category: "debuff",
      targetingMode: "aoe", rangeType: "ranged", range: 60, aoeShape: "circle", aoeSize: 15,
      castTimeType: "short", castTimeValue: 1.5,
      cooldownCategory: "long", cooldownValue: 45, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: true,
      resourceCosts: { authority: { baseAmount: 4 }, mana: { baseAmount: 12 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      damageTypes: ["arcane"],
      primaryDamage: { dice: "3d6", flat: 0, procChance: 100 },
      isDot: true, dotDuration: 6, dotTick: "3d6",
      debuffs: ["suppressed"], visualTheme: "shadow", tags: ["anti-magic", "field", "inquisitor"]
    },
    rankUpgrades: [
      { description: "A 20-foot anti-magic field for 1 minute: spells fail, effects suppress, casters inside take 5d6 arcane per round, and teleportation out is blocked.", dotTick: "5d6" }
    ]
  },

  {
    id: "iv_t5_arcane_dominator",
    name: "Arcane Dominator",
    icon: "spell_shadow_antishadow",
    maxRanks: 2,
    position: { x: 1, y: 6.5 },
    requires: "iv_t4_hounds_verdict",
    spell: {
      name: "Arcane Dominator",
      description: "You maintain two anti-magic effects simultaneously, and spells cast at you or allies within 30 feet are made with disadvantage.",
      flavorText: "Two verdicts at once. The docket is efficient.",
      source: "talent", class: "Inquisitor", treeId: "iron_verdict",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["arcane"],
      visualTheme: "shadow", tags: ["passive", "anti-magic", "dual", "inquisitor"]
    },
    rankUpgrades: [
      { description: "Two anti-magic effects at once; hostile spells at you and allies within 30 feet carry disadvantage, and your hound cannot escape or be dominated while you hold over half health." }
    ]
  },
  {
    id: "iv_t5_counters_doctrine",
    name: "Counter's Doctrine",
    icon: "spell_holy_counterspell",
    maxRanks: 3,
    position: { x: 3, y: 6.5 },
    requires: "iv_t4_dispel_field",
    spell: {
      name: "Counter's Doctrine",
      description: "Each successful Spell Intercept grants your hound +1d6 damage for 1 round (stacking up to 3 times).",
      flavorText: "Every objection overruled feeds the court.",
      source: "talent", class: "Inquisitor", treeId: "iron_verdict",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["sacred"],
      primaryDamage: { dice: "1d6", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["passive", "synergy", "counterspell", "inquisitor"]
    },
    rankUpgrades: [
      { description: "Each counter grants the hound +2d6 damage for 1 round (stacks 3).", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } },
      { description: "Each counter grants +2d6 (stacks 4), and at max stacks the hound's next attack is an automatic critical." }
    ]
  },

  {
    id: "iv_t6_the_bench",
    name: "The Bench",
    icon: "spell_holy_divinejudgment",
    maxRanks: 1,
    position: { x: 1, y: 7.5 },
    requires: "iv_t5_arcane_dominator",
    spell: {
      name: "The Bench",
      description: "Erect the court itself: a 40-foot zone of judgment within 60 feet for 3 rounds. All enemy spells inside fail outright, all magical effects are suppressed, and each enemy caster inside takes 4d8 arcane damage at the start of their turns. Costs all current Authority (minimum 4).",
      flavorText: "Court is now in session. Magic is in contempt.",
      source: "talent", class: "Inquisitor", treeId: "iron_verdict",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "aoe", rangeType: "ranged", range: 60, aoeShape: "circle", aoeSize: 40,
      castTimeType: "short", castTimeValue: 2,
      cooldownCategory: "long", cooldownValue: 150, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: true,
      resourceCosts: { authority: { baseAmount: 6 }, mana: { baseAmount: 20 } },
      durationRounds: 3, durationRealTime: 18, durationUnit: "seconds",
      damageTypes: ["arcane"],
      primaryDamage: { dice: "4d8", flat: 0, procChance: 100 },
      isDot: true, dotDuration: 3, dotTick: "4d8",
      debuffs: ["judgment"], visualTheme: "shadow", tags: ["anti-magic", "field", "climax", "inquisitor"]
    }
  },
  {
    id: "iv_t6_iron_ledger",
    name: "Iron Ledger",
    icon: "inv_scroll_03",
    maxRanks: 2,
    position: { x: 2, y: 7.5 },
    requires: "iv_t5_counters_doctrine",
    spell: {
      name: "Iron Ledger",
      description: "The court keeps accounts: every spell countered, drained, or suppressed grants 1 Authority (once per enemy per round), and your Authority decays 50% slower.",
      flavorText: "Every confiscated spell is a line item.",
      source: "talent", class: "Inquisitor", treeId: "iron_verdict",
      spellType: "PASSIVE", category: "utility",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "authority", "engine", "inquisitor"]
    },
    rankUpgrades: [
      { description: "Counters, drains, and suppressions grant 1 Authority each (once per enemy per round); decay halved; sealed spells grant 2 Authority when the seal expires." }
    ]
  },
  {
    id: "iv_t6_verdant_null",
    name: "Verdant Null",
    icon: "spell_shadow_antimagic",
    maxRanks: 2,
    position: { x: 3, y: 7.5 },
    requires: "iv_t5_arcane_dominator",
    spell: {
      name: "Verdant Null",
      description: "Your anti-magic carries a blessing: allies inside your Dispel Fields are NOT suppressed and gain +2 Durability Steps to equipped durability instead.",
      flavorText: "The law protects its officers. Convenient.",
      source: "talent", class: "Inquisitor", treeId: "iron_verdict",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["arcane"],
      visualTheme: "shadow", tags: ["passive", "field", "allies", "inquisitor"]
    },
    rankUpgrades: [
      { description: "Allies inside your anti-magic fields are unharmed, unsuppressed, gain +3 Durability Steps to equipped durability, and their non-magical attacks deal +1d6 damage of their type.", primaryDamage: { dice: "1d6", flat: 0, procChance: 100 } }
    ]
  },

  {
    id: "iv_t7_final_verdict",
    name: "Final Verdict",
    icon: "spell_holy_divinejudgment",
    maxRanks: 1,
    position: { x: 0, y: 8 },
    requires: "iv_t6_the_bench",
    spell: {
      name: "Final Verdict",
      description: "ULTIMATE: Read the sentence. A single target within 90 feet is stripped of ALL magic for 1 minute — spells fail, enchantments end, magic items go inert, and transformations revert. The condemned takes 8d10 sacred damage immediately and cannot benefit from any magical effect for the duration. Costs all current Authority (minimum 5).",
      flavorText: "The iron has heard enough. The sentence is nullification.",
      source: "talent", class: "Inquisitor", treeId: "iron_verdict",
      spellType: "ACTIVE", category: "damage",
      targetingMode: "single", rangeType: "ranged", range: 90,
      castTimeType: "long", castTimeValue: 3,
      cooldownCategory: "long", cooldownValue: 300, cooldownUnit: "seconds",
      triggersGlobalCooldown: true, usableWhileMoving: false, requiresLoS: true, interruptible: true,
      resourceCosts: { authority: { baseAmount: 7 }, mana: { baseAmount: 25 } },
      durationRounds: 6, durationRealTime: 60, durationUnit: "seconds",
      damageTypes: ["sacred"],
      primaryDamage: { dice: "8d10", flat: 0, procChance: 100 },
      debuffs: ["nullified"], visualTheme: "shadow", tags: ["ultimate", "capstone", "anti-magic", "inquisitor"]
    }
  },
  {
    id: "iv_t7_long_writ",
    name: "Long Writ",
    icon: "inv_scroll_03",
    maxRanks: 5,
    position: { x: 1, y: 8 },
    requires: "iv_t6_iron_ledger",
    spell: {
      name: "Long Writ",
      description: "The writ grows longer: your Authority maximum increases by 1.",
      flavorText: "Ink is cheap. Jurisdiction is not.",
      source: "talent", class: "Inquisitor", treeId: "iron_verdict",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", visualTheme: "shadow", tags: ["passive", "capstone", "authority", "inquisitor"]
    },
    rankUpgrades: [
      { description: "The writ grows longer: your Authority maximum increases by 2." },
      { description: "The writ grows longer: your Authority maximum increases by 3." },
      { description: "The writ grows longer: your Authority maximum increases by 4." },
      { description: "The writ grows longer: Authority maximum +5, and Spell Intercept triggers twice per round." }
    ]
  },
  {
    id: "iv_t7_contempt_power",
    name: "Contempt of Power",
    icon: "spell_shadow_manaburn",
    maxRanks: 3,
    position: { x: 2, y: 8 },
    requires: "iv_t6_iron_ledger",
    spell: {
      name: "Contempt of Power",
      description: "Spellcasters within 30 feet feel the court's disfavor: their spell costs increase by 2 mana.",
      flavorText: "The surcharge is legal. Everything here is legal.",
      source: "talent", class: "Inquisitor", treeId: "iron_verdict",
      spellType: "PASSIVE", category: "debuff",
      targetingMode: "self", damageTypes: ["arcane"],
      visualTheme: "shadow", tags: ["passive", "aura", "anti-caster", "inquisitor"]
    },
    rankUpgrades: [
      { description: "Enemy spell costs increase by 4 mana within 30 feet." },
      { description: "Enemy spell costs increase by 6 mana within 45 feet, and their spells cast at you have disadvantage baked in." }
    ]
  },
  {
    id: "iv_t7_iron_sanction",
    name: "Iron Sanction",
    icon: "ability_warrior_weaponmastery",
    maxRanks: 3,
    position: { x: 3, y: 8 },
    requires: "iv_t6_verdant_null",
    spell: {
      name: "Iron Sanction",
      description: "Your hound is an officer of the court: it can now hold and deliver your Spell Intercept counterspell when you are unavailable.",
      flavorText: "Delegation. The hounds asked for the responsibility.",
      source: "talent", class: "Inquisitor", treeId: "iron_verdict",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", damageTypes: ["sacred"],
      visualTheme: "shadow", tags: ["passive", "capstone", "hound", "counterspell", "inquisitor"]
    },
    rankUpgrades: [
      { description: "The hound delivers counterspell intercepts in your stead; each hound-executed counter grants it +1 DD step." },
      { description: "The hound intercepts in your stead, gains a DD step per counter, and may counter two spells per round." }
    ]
  },
  {
    id: "iv_t7_stand_verdict",
    name: "The Stand",
    icon: "ability_paladin_judgementofwisdom",
    maxRanks: 3,
    position: { x: 4, y: 8 },
    requires: "iv_t6_verdant_null",
    spell: {
      name: "The Stand",
      description: "Witnesses do not test you twice: enemies who successfully cast a spell inside your anti-magic effects take 3d8 arcane backlash and are silenced for 1 round.",
      flavorText: "Loopholes have consequences.",
      source: "talent", class: "Inquisitor", treeId: "iron_verdict",
      spellType: "PASSIVE", category: "damage",
      targetingMode: "self", damageTypes: ["arcane"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      visualTheme: "shadow", tags: ["passive", "capstone", "punish", "inquisitor"]
    },
    rankUpgrades: [
      { description: "Enemies casting through your fields take 5d8 arcane backlash and are silenced 1 round.", primaryDamage: { dice: "5d8", flat: 0, procChance: 100 } },
      { description: "Casting through your fields: 6d8 arcane backlash, silenced 2 rounds, and their spell still fails.", primaryDamage: { dice: "6d8", flat: 0, procChance: 100 } }
    ]
  }
];
