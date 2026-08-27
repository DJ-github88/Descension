// ============================================
// BERSERKER — WARLORD (v2: talents are spells)
// Spec: Sanguine Dictator, Tyrannical Dirge, Blood-Heat War Cries, Shared Frenzy, Lifesteal Auras
// Resource: Blood-Heat (0-100)
// ============================================

export const BERSERKER_WARLORD = [
  // ─── TIER 1 (y: 0) ───
  {
    id: "bwl_t1_sanguine_dictator",
    name: "Sanguine Dictator",
    icon: "ability_warrior_battleshout",
    maxRanks: 3,
    position: { x: 0.5, y: 0 },
    requires: null,
    spell: {
      name: "Sanguine Dictator",
      description: "Passive: Your war cries affect all targets within 30 ft. Whenever you take self-damage from your abilities, your nearby allies are galvanized, gaining +1d4 bonus damage on their next strike.",
      flavorText: "His blood hits the snow; their blades strike twice as deep.",
      source: "talent", class: "Berserker", treeId: "warlord",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", auraRadius: 30,
      visualTheme: "blood", tags: ["passive", "aura", "galvanize", "party-buff", "berserker"]
    },
    rankUpgrades: [
      { description: "Galvanized allies gain +1d8 bonus damage on their next strike, and radius extends to 40 ft.", primaryDamage: { dice: "1d8", flat: 0, procChance: 100 } },
      { description: "Galvanized allies gain +2d6 bonus damage and +10 ft movement speed; you gain +5 Blood-Heat per ally galvanized.", primaryDamage: { dice: "2d6", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "bwl_t1_tyrants_command",
    name: "Tyrant's Command",
    icon: "ability_warrior_rallyingcry",
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    spell: {
      name: "Tyrant's Command",
      description: "Spend 1 AP & 15 Heat: Let loose a deafening roar across 30 ft: enemies must succeed on a Will save or be Intimidated (-2 to hit for 1 round), while allies gain +2 to hit on their next attack.",
      flavorText: "Command does not ask. Command tears through eardrums.",
      source: "talent", class: "Berserker", treeId: "warlord",
      spellType: "ACTIVE", category: "debuff",
      actionPoints: 1, targetingMode: "aoe", rangeType: "self-centered", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 1, cooldownUnit: "round",
      visualTheme: "blood", tags: ["aoe", "shout", "intimidate", "party-buff", "berserker"]
    },
    rankUpgrades: [
      { description: "Intimidate penalty increases to -3 to hit, and allies gain +3 to hit and +1d6 slicing damage on their next strike." },
      { description: "Intimidate penalty increases to -4 to hit; failed saves leave enemies Frightened for 1 round." }
    ]
  },
  {
    id: "bwl_t1_blood_pact_resonance",
    name: "Kin-Blood Resonance",
    icon: "spell_shadow_bloodboil",
    maxRanks: 2,
    position: { x: 3.5, y: 0 },
    requires: null,
    spell: {
      name: "Kin-Blood Resonance",
      description: "Passive: Whenever an ally within 30 ft lands a critical hit, gain +10 Blood-Heat. Whenever an ally falls below 50% health, your war cry ranges are doubled.",
      flavorText: "The Skald marrow connects all who bleed in the same circle.",
      source: "talent", class: "Berserker", treeId: "warlord",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "blood", tags: ["passive", "team-synergy", "blood-heat", "berserker"]
    },
    rankUpgrades: [
      { description: "Ally critical hits grant +20 Blood-Heat, and you heal for 10% of damage dealt by ally critical hits." }
    ]
  },

  // ─── TIER 2 (y: 1) ───
  {
    id: "bwl_t2_dirge_of_battle",
    name: "Dirge of Battle",
    icon: "spell_shadow_unholyfrenzy",
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: "bwl_t1_sanguine_dictator",
    spell: {
      name: "Dirge of Battle",
      description: "Spend 2 AP & 30 Heat: A blood-spraying roar that whips nearby allies in 30 ft into a combat frenzy for 2 rounds: grants +15% attack speed and +1d8 slicing damage to all ally weapon strikes.",
      flavorText: "A funeral song sung before the enemy is dead.",
      source: "talent", class: "Berserker", treeId: "warlord",
      spellType: "ACTIVE", category: "buff",
      actionPoints: 2, targetingMode: "aoe", rangeType: "self-centered", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 2, cooldownUnit: "round",
      damageTypes: ["slicing"],
      primaryDamage: { dice: "1d8", flat: 0, procChance: 100 },
      visualTheme: "blood", tags: ["aoe", "shout", "frenzy", "haste", "berserker"]
    },
    rankUpgrades: [
      { description: "Frenzy grants +25% attack speed and +2d8 slicing damage.", primaryDamage: { dice: "2d8", flat: 0, procChance: 100 } },
      { description: "Frenzy grants +35% attack speed; allies in frenzy gain 10% lifesteal on all weapon attacks." }
    ]
  },
  {
    id: "bwl_t2_demoralizing_shout",
    name: "Gut-Wrenching Bellow",
    icon: "ability_warrior_warcry",
    maxRanks: 3,
    position: { x: 2.5, y: 1 },
    requires: "bwl_t1_tyrants_command",
    spell: {
      name: "Gut-Wrenching Bellow",
      description: "Spend 1 AP & 20 Heat: Unleash a concussive shout in a 15 ft cone: deals 2d8 sonic/smashing damage and shreds 3 Passive DR from all enemies for 2 rounds.",
      flavorText: "The air vibrates violently enough to split plate seams.",
      source: "talent", class: "Berserker", treeId: "warlord",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 1, targetingMode: "cone", rangeType: "melee", range: 15,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 1, cooldownUnit: "round",
      damageTypes: ["smashing"],
      primaryDamage: { dice: "2d8", flat: 0, procChance: 100 },
      visualTheme: "blood", tags: ["cone", "shout", "armor-shred", "berserker"]
    },
    rankUpgrades: [
      { description: "Damage increases to 3d8 smashing, cone extends to 20 ft, and armor shred increases to -5 Passive DR.", primaryDamage: { dice: "3d8", flat: 0, procChance: 100 } },
      { description: "Damage increases to 4d8 smashing; enemies struck are Deafened and cannot communicate or cast vocal spells for 1 round.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 } }
    ]
  },

  // ─── TIER 3 (y: 2) ───
  {
    id: "bwl_t3_sanguine_aura",
    name: "Aura of the Blood Feeder",
    icon: "spell_shadow_vampiricaura",
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: "bwl_t2_dirge_of_battle",
    spell: {
      name: "Aura of the Blood Feeder",
      description: "Passive: You and all allies within 30 ft heal for 10% of physical damage dealt to bleeding or wounded enemies.",
      flavorText: "The pack feeds together. The meat belongs to all.",
      source: "talent", class: "Berserker", treeId: "warlord",
      spellType: "PASSIVE", category: "heal",
      targetingMode: "self", auraRadius: 30,
      visualTheme: "blood", tags: ["passive", "aura", "lifesteal", "sustain", "berserker"]
    },
    rankUpgrades: [
      { description: "Lifesteal increases to 18% of physical damage dealt." },
      { description: "Lifesteal increases to 25%; killing blows scored by allies under the aura refund 10 Heat to you and heal the entire party for 15 HP." }
    ]
  },
  {
    id: "bwl_t3_focused_aggression",
    name: "Dictator's Focus",
    icon: "ability_hunter_snipershot",
    maxRanks: 2,
    position: { x: 2.5, y: 2 },
    requires: "bwl_t2_demoralizing_shout",
    spell: {
      name: "Dictator's Focus",
      description: "Spend 1 AP: Mark an enemy priority target for 2 rounds. All party members gain +3 to hit and +20% critical damage against the marked target.",
      flavorText: "Kill that one first. Then we discuss the rest.",
      source: "talent", class: "Berserker", treeId: "warlord",
      spellType: "ACTIVE", category: "debuff",
      actionPoints: 1, targetingMode: "single", rangeType: "ranged", range: 40,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 2, cooldownUnit: "round",
      visualTheme: "blood", tags: ["mark", "single-target", "team-focus", "berserker"]
    },
    rankUpgrades: [
      { description: "Party bonus increases to +5 to hit and +35% critical damage; when the marked target dies, all allies gain 1 free Action Point." }
    ]
  },

  // ─── TIER 4 (y: 3) ───
  {
    id: "bwl_t4_blood_tithe_command",
    name: "Blood Tithe Command",
    icon: "spell_shadow_curseofmannoroth",
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: "bwl_t3_sanguine_aura",
    spell: {
      name: "Blood Tithe Command",
      description: "Spend 2 AP & 40 Heat: Siphon a portion of blood from all enemies in 30 ft: deals 3d8 necrotic/slicing damage to each enemy and pools the total damage into a healing wave for your entire party.",
      flavorText: "Taxes are paid in iron or blood. Nordhalla accepts only blood.",
      source: "talent", class: "Berserker", treeId: "warlord",
      spellType: "ACTIVE", category: "heal",
      actionPoints: 2, targetingMode: "aoe", rangeType: "self-centered", range: 30,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 3, cooldownUnit: "round",
      damageTypes: ["slicing"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      visualTheme: "blood", tags: ["aoe", "life-drain", "party-heal", "berserker"]
    },
    rankUpgrades: [
      { description: "Damage increases to 4d8 slicing, and healing pool is doubled.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 } },
      { description: "Damage increases to 6d8 slicing; enemies struck have their damage dealt reduced by 25% for 2 rounds.", primaryDamage: { dice: "6d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "bwl_t4_chain_command",
    name: "Rallying Execution",
    icon: "ability_warrior_decisivestrike",
    maxRanks: 3,
    position: { x: 2.5, y: 3 },
    requires: "bwl_t3_focused_aggression",
    spell: {
      name: "Rallying Execution",
      description: "Spend 2 AP & 35 Heat: Execute a wounded foe in melee for 4d10 slicing damage. If this strike kills the target, all allies within 40 ft immediately gain 1 bonus Action Point.",
      flavorText: "Nothing accelerates an army like seeing the enemy leader fall in halves.",
      source: "talent", class: "Berserker", treeId: "warlord",
      spellType: "ACTIVE", category: "damage",
      actionPoints: 2, targetingMode: "single", rangeType: "melee", range: 5,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 2, cooldownUnit: "round",
      damageTypes: ["slicing"],
      primaryDamage: { dice: "4d10", flat: 0, procChance: 100 },
      visualTheme: "blood", tags: ["melee", "execute", "party-ap", "berserker"]
    },
    rankUpgrades: [
      { description: "Damage increases to 6d10 slicing, and grants allies +20 temporary HP on kill.", primaryDamage: { dice: "6d10", flat: 0, procChance: 100 } },
      { description: "Damage increases to 8d10 slicing; on kill, resets cooldown on all ally abilities with cooldowns of 2 rounds or less.", primaryDamage: { dice: "8d10", flat: 0, procChance: 100 } }
    ]
  },

  // ─── TIER 5 (y: 4) ───
  {
    id: "bwl_t5_sanguine_ferocity",
    name: "Shared Metabolic Surge",
    icon: "spell_fire_sealoffire",
    maxRanks: 3,
    position: { x: 1, y: 4 },
    requires: "bwl_t4_blood_tithe_command",
    spell: {
      name: "Shared Metabolic Surge",
      description: "Passive: While you are at 75+ Blood-Heat, all party members share your heat benefits: they gain +2d6 ember bonus damage on attacks and ignore difficult terrain.",
      flavorText: "When the leader burns, the entire line turns white-hot.",
      source: "talent", class: "Berserker", treeId: "warlord",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", auraRadius: 30, damageTypes: ["ember"],
      primaryDamage: { dice: "2d6", flat: 0, procChance: 100 },
      visualTheme: "fire", tags: ["passive", "aura", "fire-buff", "heat-share", "berserker"]
    },
    rankUpgrades: [
      { description: "Threshold lowers to 50+ Blood-Heat, and bonus damage increases to +3d6 ember.", primaryDamage: { dice: "3d6", flat: 0, procChance: 100 } },
      { description: "Threshold lowers to 40+ Blood-Heat; allies also gain Advantage on all physical saving throws." }
    ]
  },
  {
    id: "bwl_t5_unyielding_command",
    name: "Voice of the Caldera Lord",
    icon: "spell_shadow_antimagic",
    maxRanks: 2,
    position: { x: 2.5, y: 4 },
    requires: "bwl_t4_chain_command",
    spell: {
      name: "Voice of the Caldera Lord",
      description: "Passive: All your shout and war cry abilities cost 1 less AP (minimum 0) and cannot be interrupted or silenced.",
      flavorText: "No magic can choke the roar of the warlord.",
      source: "talent", class: "Berserker", treeId: "warlord",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "blood", tags: ["passive", "ap-reduction", "anti-silence", "berserker"]
    },
    rankUpgrades: [
      { description: "Shouts also grant you 10 Blood-Heat on use and knock adjacent enemies back 5 ft." }
    ]
  },

  // ─── TIER 6 (y: 5) ───
  {
    id: "bwl_t6_tyrants_bloodbath",
    name: "Total Mobilization Roar",
    icon: "ability_warrior_bloodrage",
    maxRanks: 3,
    position: { x: 1, y: 5 },
    requires: "bwl_t5_sanguine_ferocity",
    spell: {
      name: "Total Mobilization Roar",
      description: "Spend 3 AP & 60 Heat: Command your entire team to strike simultaneously across 40 ft: every ally can immediately use a free Reaction to make a basic melee or ranged weapon attack dealing +3d8 bonus slicing damage.",
      flavorText: "EVERY BLADE. NOW.",
      source: "talent", class: "Berserker", treeId: "warlord",
      spellType: "ACTIVE", category: "buff",
      actionPoints: 3, targetingMode: "aoe", rangeType: "self-centered", range: 40,
      castTimeType: "instant", castTimeValue: 0,
      cooldownValue: 3, cooldownUnit: "round",
      damageTypes: ["slicing"],
      primaryDamage: { dice: "3d8", flat: 0, procChance: 100 },
      visualTheme: "blood", tags: ["aoe", "free-attacks", "team-burst", "berserker"]
    },
    rankUpgrades: [
      { description: "Bonus damage increases to +4d8 slicing, and allies gain +15 ft movement speed for the attack.", primaryDamage: { dice: "4d8", flat: 0, procChance: 100 } },
      { description: "Bonus damage increases to +6d8 slicing; critical hits scored during this mobilization stun struck enemies for 1 round.", primaryDamage: { dice: "6d8", flat: 0, procChance: 100 } }
    ]
  },
  {
    id: "bwl_t6_warlord_supremacy",
    name: "Throne of Scars",
    icon: "spell_shadow_deathpact",
    maxRanks: 2,
    position: { x: 2.5, y: 5 },
    requires: "bwl_t5_unyielding_command",
    spell: {
      name: "Throne of Scars",
      description: "Passive: For every enemy slain within your aura, all allies gain +2% permanent damage bonus for the remainder of the combat encounter (up to +30%).",
      flavorText: "Every victory builds the dais higher.",
      source: "talent", class: "Berserker", treeId: "warlord",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self",
      visualTheme: "blood", tags: ["passive", "stacking-buff", "combat-scale", "berserker"]
    },
    rankUpgrades: [
      { description: "Cap increases to +50% damage bonus, and each stack also grants +1 Passive DR to all party members." }
    ]
  },

  // ─── TIER 7 (Capstone Row, y: 6) ───
  {
    id: "bwl_t7_avatar_of_the_warlord",
    name: "Avatar of the Sanguine Sovereign",
    icon: "ability_warrior_battleorders",
    maxRanks: 1,
    position: { x: 1, y: 6 },
    requires: "bwl_t6_tyrants_bloodbath",
    spell: {
      name: "Avatar of the Sanguine Sovereign",
      description: "CAPSTONE — Spend 3 AP & 100 Heat: Crown yourself the Absolute Sovereign of the Pack for 3 rounds. All allies within 50 ft become immune to Fear, Charm, and death (cannot drop below 1 HP), gain 50% lifesteal on all damage dealt, and your war cries trigger every turn automatically without spending AP.",
      flavorText: "While the Sovereign stands, the pack cannot bleed out. Victory is mandatory.",
      source: "talent", class: "Berserker", treeId: "warlord",
      spellType: "ACTIVE", category: "buff",
      actionPoints: 3, targetingMode: "self", rangeType: "self", range: 0,
      castTimeType: "instant", castTimeValue: 0,
      cooldownCategory: "once_per_combat", cooldownValue: 1, cooldownUnit: "combat",
      durationRounds: 3,
      visualTheme: "blood", tags: ["capstone", "ultimate", "invulnerability-share", "lifesteal", "berserker"]
    },
    rankUpgrades: []
  },
  {
    id: "bwl_t7_eternal_frenzy_accord",
    name: "Pact of the Everlasting March",
    icon: "spell_shadow_soulleech_2",
    maxRanks: 2,
    position: { x: 2.5, y: 6 },
    requires: "bwl_t6_warlord_supremacy",
    spell: {
      name: "Pact of the Everlasting March",
      description: "Passive: Combat encounters begin with full party under Dirge of Battle frenzy at no resource cost. Allies rolling damage dice add your Strength modifier to every damage roll.",
      flavorText: "The ancestors march with every member of the company.",
      source: "talent", class: "Berserker", treeId: "warlord",
      spellType: "PASSIVE", category: "buff",
      targetingMode: "self", auraRadius: 50,
      visualTheme: "blood", tags: ["passive", "capstone-row", "opener-buff", "strength-share", "berserker"]
    },
    rankUpgrades: [
      { description: "Adds double your Strength modifier to ally damage rolls, and party members are immune to exhaustion." }
    ]
  }
];
