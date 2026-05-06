// ============================================
// WITCH DOCTOR TALENT TREES
// ============================================
// Specializations: Bokor (Death/Curses), Mambo (Healing/Spirits), Houngan (War/Poisons)
// Design principle: Talents are RELIABLE power increases, not gambling.
// No "roll X on Y+" or "draw a card" mechanics.
// Every talent delivers its bonus predictably when its condition is met.
// ============================================

export const WITCH_DOCTOR_SHADOW_PRIEST = [
  // Tier 0 - Foundation: The Dark Altar
  {
    id: 'shadow_priest_t0_cursed_essence',
    name: 'Cursed Essence',
    description: 'Curses generate +1 additional Voodoo Essence per rank. Curse damage dice increase by 1 per rank (e.g., 1d6 becomes 1d6+1, then 1d6+2).',
    icon: 'spell_shadow_curseofsargeras',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - The Ribcage
  {
    id: 'shadow_priest_t1_necrotic_burst',
    name: 'Necrotic Burst',
    description: 'When cursed enemies die, they explode dealing 2d6 necrotic damage per rank to enemies within 10 ft. You heal for half the damage dealt.',
    icon: 'spell_shadow_deathcoil',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'shadow_priest_t0_cursed_essence',
  },
  {
    id: 'shadow_priest_t1_soul_drain',
    name: 'Soul Drain',
    description: 'Curses drain 1d4 HP per rank from cursed enemies each turn. You gain this amount as temporary HP.',
    icon: 'spell_shadow_lifedrain02',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'shadow_priest_t0_cursed_essence',
  },

  // Tier 2 - Rib Branches
  {
    id: 'shadow_priest_t2_curse_amplification',
    name: 'Curse Amplification',
    description: 'Curses last 2 additional rounds per rank and can stack up to 2 times on the same target. Each stack adds +1d4 necrotic damage per turn.',
    icon: 'spell_shadow_curseoftoungues',
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: 'shadow_priest_t1_necrotic_burst',
  },
  {
    id: 'shadow_priest_t2_death_link',
    name: 'Death Link',
    description: 'Link two cursed enemies. When one dies, the other takes 3d6 necrotic damage per rank. You can maintain 1 additional Death Link per rank.',
    icon: 'spell_shadow_deathscream',
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: 'shadow_priest_t1_soul_drain',
  },

  // Tier 3 - Vertebrae Chain
  {
    id: 'shadow_priest_t3_mass_curse',
    name: 'Mass Curse Mastery',
    description: 'Mass Curse affects +1 additional target per rank and its damage-over-time increases by +1d6 per rank.',
    icon: 'spell_shadow_curseofmannoroth',
    maxRanks: 3,
    position: { x: 0, y: 3 },
    requires: 'shadow_priest_t2_curse_amplification',
  },
  {
    id: 'shadow_priest_t3_baron_favor',
    name: 'Baron\'s Favor',
    description: 'Baron Samedi invocations cost 1 less Voodoo Essence per rank and require 1 fewer cursed enemy per rank. Baron Samedi deals +1d8 damage per rank to each target.',
    icon: 'spell_shadow_requiem',
    maxRanks: 2,
    position: { x: 4, y: 3 },
    requires: 'shadow_priest_t2_death_link',
  },

  // Tier 4 - Shoulder Blades
  {
    id: 'shadow_priest_t4_curse_mastery',
    name: 'Curse Mastery',
    description: 'You can maintain 2 additional curses per rank. Curses now reduce enemy healing received by 25% per rank.',
    icon: 'spell_shadow_grimward',
    maxRanks: 3,
    position: { x: 1, y: 4 },
    requires: 'shadow_priest_t3_mass_curse',
  },
  {
    id: 'shadow_priest_t4_vampiric_curses',
    name: 'Vampiric Curses',
    description: 'All curse damage heals you for 25% of damage dealt per rank. When you kill an enemy with curse damage, gain 2d6 temporary HP per rank.',
    icon: 'spell_shadow_vampiricaura',
    maxRanks: 3,
    position: { x: 3, y: 4 },
    requires: 'shadow_priest_t3_baron_favor',
  },

  // Tier 5 - Skull Crown
  {
    id: 'shadow_priest_t5_spectral_armor',
    name: 'Spectral Armor',
    description: 'While you have 2+ cursed enemies active, gain +1 armor per rank and resistance to necrotic damage. When cursed enemies die within 30 ft, gain +1d6 temporary HP per rank.',
    icon: 'spell_shadow_antishadow',
    maxRanks: 2,
    position: { x: 2, y: 5 },
    requires: 'shadow_priest_t4_vampiric_curses',
  },

  // Tier 6 - Horned Crown
  {
    id: 'shadow_priest_t6_death_ritual',
    name: 'Death Ritual Mastery',
    description: 'Ritual of Death creates a 15 ft radius zone of necrotic energy that persists for 2 rounds per rank. Enemies in the zone take 2d6 necrotic damage per round.',
    icon: 'spell_shadow_ritualofsacrifice',
    maxRanks: 3,
    position: { x: 0, y: 6 },
    requires: 'shadow_priest_t4_curse_mastery',
  },
  {
    id: 'shadow_priest_t6_death_lord',
    name: 'Death Lord',
    description: 'You become resistant to necrotic damage and poison. Baron Samedi invocations can now target undead allies, raising them as powerful minions for 1 minute.',
    icon: 'spell_shadow_shadetruesight',
    maxRanks: 1,
    position: { x: 4, y: 6 },
    requires: 'shadow_priest_t5_spectral_armor',
  },

  // Tier 7 - Death Incarnate (Capstone)
  {
    id: 'shadow_priest_t7_apocalypse_of_death',
    name: 'Apocalypse of Death',
    description: 'Unlocks Apocalypse of Death — spend all Voodoo Essence to curse all enemies in 60 ft. They take 3d8 necrotic damage per Essence spent and are frightened for 1 minute.',
    icon: 'spell_shadow_focusedpower',
    maxRanks: 1,
    position: { x: 2, y: 7 },
    requires: 'shadow_priest_t6_death_lord',
  }
];

export const WITCH_DOCTOR_SPIRIT_HEALER = [
  // Tier 0 - The Source: River Spring
  {
    id: 'spirit_healer_t0_healing_essence',
    name: 'Healing Essence',
    description: 'Healing spells generate +1 additional Voodoo Essence per rank. Healing rolls gain +1 per rank to their total.',
    icon: 'spell_holy_healingaura',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - River Fork
  {
    id: 'spirit_healer_t1_totem_mastery',
    name: 'Totem Mastery',
    description: 'Totems last 2 additional rounds per rank and their radius increases by 5 ft per rank. Your totems gain +5 HP per rank.',
    icon: 'spell_nature_stoneclawtotem',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'spirit_healer_t0_healing_essence',
  },
  {
    id: 'spirit_healer_t1_spirit_bond',
    name: 'Spirit Bond',
    description: 'Bond with 1 additional ally per rank. Bonded allies gain +1d4 temporary HP when you heal them and share your resistance to necrotic damage.',
    icon: 'spell_holy_prayerofspirit',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'spirit_healer_t0_healing_essence',
  },

  // Tier 2 - Rapids
  {
    id: 'spirit_healer_t2_healing_wave',
    name: 'Healing Wave',
    description: 'Healing spells chain to 1 nearby ally within 10 ft per rank. Each chain heals for 50% of the original amount.',
    icon: 'spell_nature_healingwavegreater',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'spirit_healer_t1_totem_mastery',
  },
  {
    id: 'spirit_healer_t2_erzulie_blessing',
    name: 'Erzulie\'s Blessing',
    description: 'Erzulie invocations cost 1 less Voodoo Essence per rank and heal +2d6 additional HP. Erzulie\'s buff duration increases by 1 round per rank.',
    icon: 'spell_holy_divinespirit',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'spirit_healer_t1_totem_mastery',
  },
  {
    id: 'spirit_healer_t2_protective_barrier',
    name: 'Protective Barrier',
    description: 'You can create a barrier around bonded allies that absorbs 2d6 damage per rank before breaking. When the barrier breaks, the ally is healed for half the absorbed damage.',
    icon: 'spell_holy_powerwordshield',
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: 'spirit_healer_t1_spirit_bond',
  },

  // Tier 3 - Waterfall
  {
    id: 'spirit_healer_t3_totem_network',
    name: 'Totem Network',
    description: 'When you have 2+ totems on the field, their effects are enhanced by 25% per rank. Totems within 20 ft of each other share their effects.',
    icon: 'spell_nature_earthbindtotem',
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: 'spirit_healer_t2_healing_wave',
  },
  {
    id: 'spirit_healer_t3_life_transfer',
    name: 'Life Transfer',
    description: 'You can transfer 2d6 HP per rank from yourself to bonded allies as 1 action point. Once per combat, if you would be reduced to 0 HP, a bonded ally takes the damage instead.',
    icon: 'spell_holy_layonhands',
    maxRanks: 2,
    position: { x: 3, y: 3 },
    requires: 'spirit_healer_t2_protective_barrier',
  },

  // Tier 4 - Delta Branches
  {
    id: 'spirit_healer_t4_simbi_rain',
    name: 'Simbi\'s Rain',
    description: 'Simbi invocations create a persistent rain effect for 2 rounds per rank that heals allies 1d6 HP per round and cures poisons. The rain radius is 15 ft per rank.',
    icon: 'spell_nature_giftofthewaterspirit',
    maxRanks: 3,
    position: { x: 0, y: 4 },
    requires: 'spirit_healer_t3_totem_network',
  },
  {
    id: 'spirit_healer_t4_spirit_ward',
    name: 'Spirit Ward',
    description: 'Allies within 30 ft of your totems gain +1 to all saves per rank and resistance to curse effects. Bonded allies gain an additional +1 to saves.',
    icon: 'spell_holy_powerwordbarrier',
    maxRanks: 3,
    position: { x: 2, y: 4 },
    requires: 'spirit_healer_t2_erzulie_blessing',
  },
  {
    id: 'spirit_healer_t4_spirit_resurrection',
    name: 'Spirit Resurrection',
    description: 'Resurrection spells work on allies who died up to 1 minute ago per rank. Resurrected allies return with full HP and gain +2 to all rolls for 1 minute.',
    icon: 'spell_holy_resurrection',
    maxRanks: 2,
    position: { x: 4, y: 4 },
    requires: 'spirit_healer_t3_life_transfer',
  },

  // Tier 5 - Spirit Ascendant
  {
    id: 'spirit_healer_t5_spirit_ascendant',
    name: 'Spirit Ascendant',
    description: 'You gain resistance to all damage while within 30 ft of a totem. Erzulie and Simbi invocations can now be maintained simultaneously, and their effects stack.',
    icon: 'spell_holy_holyguidance',
    maxRanks: 1,
    position: { x: 1, y: 5 },
    requires: 'spirit_healer_t4_simbi_rain',
  },
  {
    id: 'spirit_healer_t5_heavenly_intervention',
    name: 'Heavenly Intervention',
    description: 'Unlocks Heavenly Intervention — spend all Voodoo Essence to heal all allies in 60 ft for 4d8 HP per Essence spent and remove all curses, diseases, and poisons.',
    icon: 'spell_holy_divineintervention',
    maxRanks: 1,
    position: { x: 3, y: 5 },
    requires: 'spirit_healer_t4_spirit_resurrection',
  },

  // Tier 6 - The Eternal Spring (Capstone)
  {
    id: 'spirit_healer_t6_eternal_spring',
    name: 'Eternal Spring',
    description: 'Once per long rest, create an Eternal Spring that heals all allies within 30 ft for 3d8 HP per round for 1 minute. The spring persists through combat and cannot be dispelled.',
    icon: 'spell_holy_divineprovidence',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: 'spirit_healer_t5_spirit_ascendant',
  }
];

export const WITCH_DOCTOR_WAR_PRIEST = [
  // Tier 0 - The Command Tent
  {
    id: 'war_priest_t0_warrior_essence',
    name: 'Warrior Essence',
    description: 'Weapon attacks and combat spells generate +1 additional Voodoo Essence per rank. Weapon damage increases by +1 per rank.',
    icon: 'ability_warrior_battleshout',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - Forward Scouts
  {
    id: 'war_priest_t1_combat_blessing',
    name: 'Combat Blessing',
    description: 'Bless 1 additional ally per rank. Blessed allies gain +1 to attack rolls and +1d4 weapon damage for the duration.',
    icon: 'spell_holy_blessingofstrength',
    maxRanks: 3,
    position: { x: 0, y: 1 },
    requires: 'war_priest_t0_warrior_essence',
  },
  {
    id: 'war_priest_t1_poison_mastery',
    name: 'Poison Mastery',
    description: 'Poisons last 2 additional rounds per rank and deal +1d4 damage per round. Your poisons cannot be removed by lesser magic.',
    icon: 'ability_rogue_dualweild',
    maxRanks: 3,
    position: { x: 4, y: 1 },
    requires: 'war_priest_t0_warrior_essence',
  },

  // Tier 2 - Artillery Positions
  {
    id: 'war_priest_t2_war_cry',
    name: 'War Cry',
    description: 'Activate a war cry as 1 action point. Allies within 30 ft gain +1d6 weapon damage for 3 rounds per rank. This effect does not stack with itself.',
    icon: 'ability_warrior_warcry',
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: 'war_priest_t1_combat_blessing',
  },
  {
    id: 'war_priest_t2_ogoun_might',
    name: 'Ogoun\'s Might',
    description: 'Ogoun invocations cost 1 less Voodoo Essence per rank and grant +1 additional attack/damage per rank. Ogoun\'s duration increases by 1 round per rank.',
    icon: 'spell_fire_felfire',
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: 'war_priest_t1_poison_mastery',
  },

  // Tier 3 - Battlefield Formations
  {
    id: 'war_priest_t3_battle_totem',
    name: 'Battle Totem',
    description: 'Your totems provide half cover to adjacent allies per rank and deal 2d6 damage to enemies who enter within 5 ft. Enemies damaged are slowed for 1 round.',
    icon: 'spell_nature_lightning',
    maxRanks: 3,
    position: { x: 0, y: 3 },
    requires: 'war_priest_t2_war_cry',
  },
  {
    id: 'war_priest_t3_poison_cloud',
    name: 'Poison Cloud Mastery',
    description: 'Poison effects create a 10 ft radius cloud for 2 rounds per rank. Enemies in the cloud take 2d6 poison damage per round and have disadvantage on attack rolls.',
    icon: 'spell_nature_naturetouchdecay',
    maxRanks: 3,
    position: { x: 2, y: 3 },
    requires: 'war_priest_t2_war_cry',
  },
  {
    id: 'war_priest_t3_spirit_weapon',
    name: 'Spirit Weapon',
    description: 'Your weapon attacks deal +1d6 damage per rank while poison is active. On critical hits, the target is stunned for 1 round.',
    icon: 'ability_warrior_savageblow',
    maxRanks: 3,
    position: { x: 4, y: 3 },
    requires: 'war_priest_t2_ogoun_might',
  },

  // Tier 4 - Siege Engines
  {
    id: 'war_priest_t4_toxic_burst',
    name: 'Toxic Burst',
    description: 'When poisoned enemies die, they explode dealing 3d6 poison damage per rank to enemies within 15 ft. The explosion leaves a poison cloud in the area for 1 round.',
    icon: 'ability_creature_poison_06',
    maxRanks: 3,
    position: { x: 1, y: 4 },
    requires: 'war_priest_t3_poison_cloud',
  },
  {
    id: 'war_priest_t4_spirit_communication',
    name: 'Spirit Communication',
    description: 'You can communicate telepathically with all allies within 1 mile per rank. During Papa Legba invocations, you can also see through allies\' eyes for 1 minute, granting them +2 to attack rolls.',
    icon: 'spell_holy_heroism',
    maxRanks: 2,
    position: { x: 3, y: 4 },
    requires: 'war_priest_t3_spirit_weapon',
  },

  // Tier 5 - Command Structure
  {
    id: 'war_priest_t5_berserker_rage',
    name: 'Berserker Rage',
    description: 'When you or blessed allies drop below 50% HP, they gain +2 to attack and damage rolls. This bonus increases by +1 per rank. The rage lasts until combat ends.',
    icon: 'spell_nature_ancestralguardian',
    maxRanks: 2,
    position: { x: 0, y: 5 },
    requires: 'war_priest_t3_battle_totem',
  },
  {
    id: 'war_priest_t5_war_spirit',
    name: 'War Spirit',
    description: 'You gain +2 to attack and damage rolls while wielding a weapon. Ogoun and Papa Legba invocations can now be maintained simultaneously, combining their combat and utility effects.',
    icon: 'spell_nature_spiritwolf',
    maxRanks: 1,
    position: { x: 2, y: 5 },
    requires: 'war_priest_t4_toxic_burst',
  },
  {
    id: 'war_priest_t5_papa_legba_trickery',
    name: 'Papa Legba\'s Trickery',
    description: 'Papa Legba invocations cost 1 less Voodoo Essence per rank and allow teleporting +2 additional allies. Teleported allies gain +2 to their next attack roll.',
    icon: 'spell_arcane_teleportorgrimmar',
    maxRanks: 2,
    position: { x: 4, y: 5 },
    requires: 'war_priest_t4_spirit_communication',
  },

  // Tier 6 - Total War (Capstone)
  {
    id: 'war_priest_t6_armageddon',
    name: 'Armageddon',
    description: 'Unlocks Armageddon — spend all Voodoo Essence to unleash total war. All enemies in 60 ft take 3d8 damage per Essence spent and are poisoned for 1 minute.',
    icon: 'spell_fire_elementaldevastation',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: 'war_priest_t5_war_spirit',
  }
];
