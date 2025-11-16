// ============================================
// WITCH DOCTOR TALENT TREES
// ============================================

export const WITCH_DOCTOR_SHADOW_PRIEST = [
  // Tier 0 - Foundation (Central - The Dark Altar)
  {
    id: 'shadow_priest_t0_cursed_essence',
    name: 'Cursed Essence',
    description: 'Curses generate +1 additional Voodoo Essence per rank. Roll 1d8 when applying curses - on 6+ per rank, double the curse\'s damage dice.',
    icon: 'spell_shadow_curseofsargeras',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - The Ribcage (Organic bone structure)
  {
    id: 'shadow_priest_t1_necrotic_burst',
    name: 'Necrotic Burst',
    description: 'When cursed enemies die, they explode dealing 2d6 necrotic damage per rank to enemies within 10 ft. Draw a card when this triggers - black cards heal you 1d6 HP.',
    icon: 'spell_shadow_deathcoil',
    maxRanks: 4,
    position: { x: 1, y: 1 },
    requires: 'shadow_priest_t0_cursed_essence',
  },
  {
    id: 'shadow_priest_t1_soul_drain',
    name: 'Soul Drain',
    description: 'Curses drain 1d6 HP per rank from cursed enemies each turn. You gain half this amount as temp HP. Roll 1d20 - on 15+ per rank, drain an additional 1d6.',
    icon: 'spell_shadow_lifedrain02',
    maxRanks: 4,
    position: { x: 3, y: 1 },
    requires: 'shadow_priest_t0_cursed_essence',
  },

  // Tier 2 - Rib Branches (Extending from the ribcage)
  {
    id: 'shadow_priest_t2_curse_amplification',
    name: 'Curse Amplification',
    description: 'Curses last 1 minute longer per rank and stack up to 3 times on the same target. Each stack deals +1d4 necrotic damage per turn.',
    icon: 'spell_shadow_curseoftoungues',
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: 'shadow_priest_t1_necrotic_burst',
  },
  {
    id: 'shadow_priest_t2_death_link',
    name: 'Death Link',
    description: 'Link two cursed enemies. When one dies, the other takes 3d6 necrotic damage per rank. Roll 1d6 when linking - on 4+ per rank, link a third enemy.',
    icon: 'spell_shadow_deathscream',
    maxRanks: 4,
    position: { x: 3, y: 2 },
    requires: 'shadow_priest_t1_soul_drain',
  },

  // Tier 3 - Vertebrae Chain (Spinal column extending upward)
  {
    id: 'shadow_priest_t3_mass_curse',
    name: 'Mass Curse',
    description: 'Unlocks Mass Curse - spend 3 Voodoo Essence to curse all enemies in 30 ft. Roll 1d6 per rank to determine additional curse effects (1-2: fear, 3-4: poison, 5-6: silence).',
    icon: 'spell_shadow_curseofmannoroth',
    maxRanks: 3,
    position: { x: 0, y: 3 },
    requires: 'shadow_priest_t2_curse_amplification',
  },
  {
    id: 'shadow_priest_t3_baron_favor',
    name: 'Baron\'s Favor',
    description: 'Baron Samedi invocations cost 1 less Voodoo Essence per rank and require 1 fewer cursed enemy. Draw a card when invoking Baron Samedi - red cards grant +1d8 temp HP.',
    icon: 'spell_shadow_requiem',
    maxRanks: 3,
    position: { x: 4, y: 3 },
    requires: 'shadow_priest_t2_death_link',
  },

  // Tier 4 - Shoulder Blades (Winged skeletal extensions)
  {
    id: 'shadow_priest_t4_curse_mastery',
    name: 'Curse Mastery',
    description: 'You can maintain 2 additional curses per rank. Curses now reduce enemy healing by 50% and prevent death saves. Roll 1d6 when applying curses - on 5+ per rank, apply two curses.',
    icon: 'spell_shadow_grimward',
    maxRanks: 3,
    position: { x: 1, y: 4 },
    requires: 'shadow_priest_t3_mass_curse',
  },
  {
    id: 'shadow_priest_t4_vampiric_curses',
    name: 'Vampiric Curses',
    description: 'All curse damage heals you for 50% of the damage dealt per rank. When you drop an enemy to 0 HP with a curse, gain 2d6 temp HP.',
    icon: 'spell_shadow_vampiricaura',
    maxRanks: 3,
    position: { x: 3, y: 4 },
    requires: 'shadow_priest_t3_baron_favor',
  },

  // Tier 5 - Skull Crown (Deathly visage)
  {
    id: 'shadow_priest_t5_spectral_armor',
    name: 'Spectral Armor',
    description: 'While you have 3+ cursed enemies, you gain +1 armor per rank and necrotic resistance. When cursed enemies die within 30 ft, gain +1d4 temp HP per rank.',
    icon: 'spell_shadow_antishadow',
    maxRanks: 2,
    position: { x: 2, y: 5 },
    requires: 'shadow_priest_t3_baron_favor',
  },

  // Tier 6 - Horned Crown (Majestic skeletal adornment)
  {
    id: 'shadow_priest_t6_death_ritual',
    name: 'Death Ritual',
    description: 'Ritual of Death now creates a 20 ft radius zone of necrotic energy for 1 minute per rank. Enemies in the zone take 2d6 necrotic damage per turn and have disadvantage on saves.',
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
    requires: 'shadow_priest_t4_vampiric_curses',
  },

  // Tier 7 - Death Incarnate (The ultimate skeletal form)
  {
    id: 'shadow_priest_t7_apocalypse_of_death',
    name: 'Apocalypse of Death',
    description: 'Unlocks Apocalypse of Death - spend all Voodoo Essence to curse all enemies in 60 ft. They take 3d8 necrotic damage per Essence spent and are frightened for 1 minute.',
    icon: 'spell_shadow_focusedpower',
    maxRanks: 1,
    position: { x: 2, y: 7 },
    requires: 'shadow_priest_t5_spectral_armor',
  }
];

export const WITCH_DOCTOR_SPIRIT_HEALER = [
  // Tier 0 - The Source (River spring)
  {
    id: 'spirit_healer_t0_healing_essence',
    name: 'Healing Essence',
    description: 'Healing spells generate +1 additional Voodoo Essence per rank. Roll 1d8 when casting healing - on 7+ per rank, the healing spell also removes one curse or disease.',
    icon: 'spell_holy_healingaura',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - River Fork (Splitting stream)
  {
    id: 'spirit_healer_t1_totem_mastery',
    name: 'Totem Mastery',
    description: 'Totems last 2 minutes longer per rank and affect +5 ft radius. Draw a card when placing totems - red cards make the totem immune to damage for 1 minute.',
    icon: 'spell_nature_stoneclawtotem',
    maxRanks: 4,
    position: { x: 1, y: 1 },
    requires: 'spirit_healer_t0_healing_essence',
  },
  {
    id: 'spirit_healer_t1_spirit_bond',
    name: 'Spirit Bond',
    description: 'You can bond with one ally per rank. Bonded allies gain +1d4 temp HP when you heal them and share 50% of your resistances.',
    icon: 'spell_holy_prayerofspirit',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'spirit_healer_t0_healing_essence',
  },

  // Tier 2 - Rapids (Turbulent water flow)
  {
    id: 'spirit_healer_t2_healing_wave',
    name: 'Healing Wave',
    description: 'Healing spells chain to nearby allies within 10 ft per rank. Each chain heals for 50% of the original amount. Roll 1d6 - on 4+ per rank, the chain continues to another ally.',
    icon: 'spell_nature_healingwavegreater',
    maxRanks: 4,
    position: { x: 0, y: 2 },
    requires: 'spirit_healer_t1_totem_mastery',
  },
  {
    id: 'spirit_healer_t2_erzulie_blessing',
    name: 'Erzulie\'s Blessing',
    description: 'Erzulie invocations cost 1 less Voodoo Essence per rank and heal +2d6 additional HP. Draw a card when invoking Erzulie - hearts cards grant +1d8 temp HP to all allies.',
    icon: 'spell_holy_divinespirit',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'spirit_healer_t1_totem_mastery',
  },
  {
    id: 'spirit_healer_t2_protective_barrier',
    name: 'Protective Barrier',
    description: 'You can create a barrier around bonded allies. The barrier absorbs 2d6 damage per rank before breaking. Roll 1d20 - on 16+ per rank, the barrier heals the ally for the absorbed damage.',
    icon: 'spell_holy_powerwordshield',
    maxRanks: 4,
    position: { x: 4, y: 2 },
    requires: 'spirit_healer_t1_spirit_bond',
  },

  // Tier 3 - Waterfall (Cascading healing energy)
  {
    id: 'spirit_healer_t3_totem_network',
    name: 'Totem Network',
    description: 'Unlocks Totem Network - connect up to 3 totems per rank. Connected totems share effects and have +50% effectiveness when within 20 ft of each other.',
    icon: 'spell_nature_earthbindtotem',
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: 'spirit_healer_t2_healing_wave',
  },
  {
    id: 'spirit_healer_t3_life_transfer',
    name: 'Life Transfer',
    description: 'You can transfer 2d6 HP per rank from yourself to bonded allies as a 1 action point. If you would be reduced to 0 HP, transfer the damage to a bonded ally instead (once per turn).',
    icon: 'spell_holy_layonhands',
    maxRanks: 2,
    position: { x: 3, y: 3 },
    requires: 'spirit_healer_t2_protective_barrier',
  },

  // Tier 4 - Delta Branches (River splits into healing streams)
  {
    id: 'spirit_healer_t4_simbi_rain',
    name: 'Simbi\'s Rain',
    description: 'Simbi invocations create a rain effect for 1 minute per rank that heals allies 1d6 HP per turn and cures poisons. Roll 1d6 when invoking Simbi - on 4+ per rank, the rain also removes curses.',
    icon: 'spell_nature_giftofthewaterspirit',
    maxRanks: 3,
    position: { x: 0, y: 4 },
    requires: 'spirit_healer_t3_totem_network',
  },
  {
    id: 'spirit_healer_t4_spirit_ward',
    name: 'Spirit Ward',
    description: 'Allies within 30 ft of your totems gain +1 to all saves per rank and resistance to curses. Roll 1d6 when an ally fails a save - on 5+ per rank, they succeed instead.',
    icon: 'spell_holy_powerwordbarrier',
    maxRanks: 3,
    position: { x: 2, y: 4 },
    requires: 'spirit_healer_t2_erzulie_blessing',
  },
  {
    id: 'spirit_healer_t4_spirit_resurrection',
    name: 'Spirit Resurrection',
    description: 'Resurrection spells now work on allies who died up to 1 minute ago per rank. Resurrected allies return with full HP and gain +2 to all rolls for 1 minute.',
    icon: 'spell_holy_resurrection',
    maxRanks: 3,
    position: { x: 4, y: 4 },
    requires: 'spirit_healer_t3_life_transfer',
  },

  // Tier 5 - Spirit Ascendant (Rising above the waters)
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
    description: 'Unlocks Heavenly Intervention - spend all Voodoo Essence to heal all allies in 60 ft for 4d8 HP per Essence spent and remove all curses, diseases, and poisons.',
    icon: 'spell_holy_divineintervention',
    maxRanks: 1,
    position: { x: 3, y: 5 },
    requires: 'spirit_healer_t4_spirit_resurrection',
  },

  // Tier 6 - The Eternal Spring (Infinite renewal)
  {
    id: 'spirit_healer_t6_eternal_spring',
    name: 'Eternal Spring',
    description: 'Once per long rest, you can create an Eternal Spring that heals all allies within 30 ft for 3d8 HP per turn for 1 minute. The spring persists through combat.',
    icon: 'spell_holy_divineprovidence',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: 'spirit_healer_t4_spirit_ward',
  }
];

export const WITCH_DOCTOR_WAR_PRIEST = [
  // Tier 0 - The Command Tent (Battlefield HQ)
  {
    id: 'war_priest_t0_warrior_essence',
    name: 'Warrior Essence',
    description: 'Combat spells generate +1 additional Voodoo Essence per rank. Roll 1d8 when dealing damage in melee - on 6+ per rank, generate 1 extra Voodoo Essence.',
    icon: 'ability_warrior_battleshout',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - Forward Scouts (Outlying reconnaissance)
  {
    id: 'war_priest_t1_combat_blessing',
    name: 'Combat Blessing',
    description: 'You can bless one ally per rank in combat. Blessed allies gain +1 to attack rolls and +1d4 weapon damage. Roll 1d6 when blessing - on 5+ per rank, they also gain advantage on initiative.',
    icon: 'spell_holy_blessingofstrength',
    maxRanks: 3,
    position: { x: 0, y: 1 },
    requires: 'war_priest_t0_warrior_essence',
  },
  {
    id: 'war_priest_t1_poison_mastery',
    name: 'Poison Mastery',
    description: 'Poisons last 1 minute longer per rank and deal +1d4 damage per turn. Draw a card when applying poisons - clubs cards make the poison immune to removal for 1 minute.',
    icon: 'ability_rogue_dualweild',
    maxRanks: 4,
    position: { x: 4, y: 1 },
    requires: 'war_priest_t0_warrior_essence',
  },

  // Tier 2 - Artillery Positions (Scattered siege weapons)
  {
    id: 'war_priest_t2_war_cry',
    name: 'War Cry',
    description: 'You can unleash a war cry as a 1 action point per rank. Allies within 30 ft gain +1d6 weapon damage for 1 minute. Roll 1d20 - on 16+ per rank, enemies within range are frightened.',
    icon: 'ability_warrior_warcry',
    maxRanks: 4,
    position: { x: 1, y: 2 },
    requires: 'war_priest_t1_combat_blessing',
  },
  {
    id: 'war_priest_t2_ogoun_might',
    name: 'Ogoun\'s Might',
    description: 'Ogoun invocations cost 1 less Voodoo Essence per rank and grant +1 attack/damage per rank. Draw a card when invoking Ogoun - diamonds cards extend the duration by 1 minute.',
    icon: 'spell_fire_felfire',
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: 'war_priest_t1_poison_mastery',
  },

  // Tier 3 - Battlefield Formations (Tactical positioning)
  {
    id: 'war_priest_t3_battle_totem',
    name: 'Battle Totem',
    description: 'Your totems can be used as cover (half cover per rank) and deal 2d6 damage to enemies who approach within 5 ft. Roll 1d6 when placing battle totems - on 4+ per rank, they also slow enemies.',
    icon: 'spell_nature_lightning',
    maxRanks: 4,
    position: { x: 0, y: 3 },
    requires: 'war_priest_t2_war_cry',
  },
  {
    id: 'war_priest_t3_poison_cloud',
    name: 'Poison Cloud',
    description: 'Unlocks Poison Cloud - spend 4 Voodoo Essence to create a 20 ft radius cloud for 1 minute per rank. Enemies take 2d6 poison damage per turn and have disadvantage on attacks.',
    icon: 'spell_nature_naturetouchdecay',
    maxRanks: 3,
    position: { x: 2, y: 3 },
    requires: 'war_priest_t2_war_cry',
  },
  {
    id: 'war_priest_t3_spirit_weapon',
    name: 'Spirit Weapon',
    description: 'Your weapon becomes infused with voodoo spirits. Weapon attacks deal +2d6 damage per rank and poison enemies on hit. Roll 1d6 on critical hits - on 4+ per rank, the enemy is stunned.',
    icon: 'ability_warrior_savageblow',
    maxRanks: 3,
    position: { x: 4, y: 3 },
    requires: 'war_priest_t2_ogoun_might',
  },

  // Tier 4 - Siege Engines (Heavy artillery deployment)
  {
    id: 'war_priest_t4_toxic_burst',
    name: 'Toxic Burst',
    description: 'When poisoned enemies die, they explode dealing 3d6 poison damage per rank to enemies within 15 ft. Roll 1d6 - on 5+ per rank, the explosion creates a poison cloud in the area.',
    icon: 'ability_creature_poison_06',
    maxRanks: 3,
    position: { x: 1, y: 4 },
    requires: 'war_priest_t3_poison_cloud',
  },
  {
    id: 'war_priest_t4_spirit_communication',
    name: 'Spirit Communication',
    description: 'You can communicate telepathically with all allies within 1 mile per rank. During Papa Legba invocations, you can also see through allies\' eyes for 1 minute.',
    icon: 'spell_holy_heroism',
    maxRanks: 3,
    position: { x: 3, y: 4 },
    requires: 'war_priest_t3_spirit_weapon',
  },

  // Tier 5 - Command Structure (Strategic coordination)
  {
    id: 'war_priest_t5_berserker_rage',
    name: 'Berserker Rage',
    description: 'When you or blessed allies drop below 50% HP, they enter a rage gaining +2 attack/damage per rank but taking 1d6 damage per turn. Rage lasts until combat ends.',
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
    description: 'Papa Legba invocations cost 1 less Voodoo Essence per rank and allow teleporting +2 additional allies. Draw a card when invoking Papa Legba - spades cards create illusions of all teleported creatures.',
    icon: 'spell_arcane_teleportorgrimmar',
    maxRanks: 2,
    position: { x: 4, y: 5 },
    requires: 'war_priest_t4_spirit_communication',
  },

  // Tier 6 - Total War (Apocalyptic battlefield)
  {
    id: 'war_priest_t6_armageddon',
    name: 'Armageddon',
    description: 'Unlocks Armageddon - spend all Voodoo Essence to unleash total war. All enemies in 60 ft take 3d8 damage per Essence spent and are poisoned for 1 minute.',
    icon: 'spell_fire_elementaldevastation',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: 'war_priest_t5_war_spirit',
  }
];
