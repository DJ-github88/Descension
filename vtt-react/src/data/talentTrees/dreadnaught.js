// ============================================
// DREADNAUGHT TALENT TREES
// ============================================
//
// Proc Density Design Rules:
//   Foundation (t0-t2):     Deterministic, flat bonuses — NO card/coin procs
//   Specialization (t3-t4): Conditional triggers (on game events) — NO card/coin procs
//   Power (t5-t6):          Card draw / coin flip procs — spectacle for capstones
// ============================================

export const DREADNAUGHT_SHADOW_CITADEL = [
  // FOUNDATION (t0-t2): Deterministic, reliable defense
  {
    id: 'citadel_t0_fortress_heart',
    name: 'Fortress Heart',
    description: 'Gain +2 maximum HP per rank. Your Shadow Shield absorbs an additional +1 damage per rank.',
    icon: 'spell_shadow_twilight',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  {
    id: 'citadel_t1_shadow_ramparts',
    name: 'Shadow Ramparts',
    description: 'Shadow Shield absorbs an additional 1d4 damage per rank. You can cast Shadow Shield as a 1 AP action instead of a reaction.',
    icon: 'spell_shadow_antishadow',
    maxRanks: 4,
    position: { x: 0, y: 1 },
    requires: 'citadel_t0_fortress_heart',
  },
  {
    id: 'citadel_t1_obsidian_armor',
    name: 'Obsidian Armor',
    description: 'When you have 20+ DRP, gain +1 armor per rank. When hit in melee, attackers take 1d4 necrotic damage per rank from ricocheting obsidian shards.',
    icon: 'spell_shadow_shadowfiend',
    maxRanks: 3,
    position: { x: 4, y: 1 },
    requires: 'citadel_t0_fortress_heart',
  },

  {
    id: 'citadel_t2_northeast_bastion',
    name: 'Northeast Bastion',
    description: 'Allies within 10 feet gain +1 armor per rank when you have 25+ DRP. Shadow Shield can also target one ally within 5 feet.',
    icon: 'spell_shadow_darkritual',
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: 'citadel_t1_shadow_ramparts',
  },
  {
    id: 'citadel_t2_central_dungeon',
    name: 'Central Dungeon',
    description: 'Your HP regeneration from DRP increases by 50%. You gain +1d4 temporary HP per rank at the start of each turn when you have 20+ DRP.',
    icon: 'spell_shadow_lifedrain02',
    maxRanks: 4,
    position: { x: 2, y: 2 },
    requires: 'citadel_t1_shadow_ramparts',
  },
  {
    id: 'citadel_t2_southwest_bastion',
    name: 'Southwest Bastion',
    description: 'You can resist two damage types instead of one. When both resistances trigger on the same hit, the attacker takes 1d8 necrotic damage per rank from falling debris.',
    icon: 'spell_shadow_antimagicshell',
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: 'citadel_t1_obsidian_armor',
  },

  // SPECIALIZATION (t3-t4): Conditional triggers — no card draws
  {
    id: 'citadel_t3_void_portcullis',
    name: 'Void Portcullis',
    description: 'Shadow Shield can be cast as a reaction and absorbs 50% more damage. When Shadow Shield breaks, deal 2d6 necrotic damage per rank to all enemies within 10 feet as the gates slam shut.',
    icon: 'spell_shadow_sealofkings',
    maxRanks: 3,
    position: { x: 0, y: 3 },
    requires: 'citadel_t2_northeast_bastion',
  },
  {
    id: 'citadel_t3_eternal_keep',
    name: 'Eternal Keep',
    description: 'At 40+ DRP, you become immune to critical hits. Your regeneration creates a 10-foot aura that heals allies for 1d4 HP per rank at the start of their turn.',
    icon: 'spell_shadow_twilight',
    maxRanks: 4,
    position: { x: 2, y: 3 },
    requires: 'citadel_t2_central_dungeon',
  },
  {
    id: 'citadel_t3_reflective_towers',
    name: 'Reflective Towers',
    description: 'When you resist damage, the attacker must succeed on a DC 13 + rank Agility save or take necrotic damage equal to half the resisted damage per rank from tower reflections.',
    icon: 'spell_shadow_shadowworddominate',
    maxRanks: 3,
    position: { x: 4, y: 3 },
    requires: 'citadel_t2_southwest_bastion',
  },

  {
    id: 'citadel_t4_abyssal_foundations',
    name: 'Abyssal Foundations',
    description: 'Your resistances become immunity to chosen damage types. When an immune damage type would affect you, gain 1d6 DRP per rank instead as the foundations absorb the energy.',
    icon: 'spell_shadow_shadesofdarkness',
    maxRanks: 2,
    position: { x: 1, y: 4 },
    requires: 'citadel_t3_void_portcullis',
  },
  {
    id: 'citadel_t4_citadel_lord',
    name: 'Citadel Lord',
    description: 'Dark Rebirth revives you with full HP and maximum DRP. You gain +2 to all saves per rank for 1 minute after rebirth, as the citadel rebuilds itself around you.',
    icon: 'spell_shadow_demonicempathy',
    maxRanks: 3,
    position: { x: 3, y: 4 },
    requires: 'citadel_t3_eternal_keep',
  },

  // POWER (t5-t6): Card/coin procs for capstone spectacle
  {
    id: 'citadel_t4_siege_engines',
    name: 'Siege Engines',
    description: 'Shadow Shield absorbs all damage from one source per rank. When used, all enemies within 15 feet have disadvantage on attack rolls against you for 1 round.',
    icon: 'spell_shadow_focusedpower',
    maxRanks: 2,
    position: { x: 0, y: 5 },
    requires: 'citadel_t3_reflective_towers',
  },
  {
    id: 'citadel_t5_impenetrable_palace',
    name: 'Impenetrable Palace',
    description: 'For 1 minute per rank, all damage you take is converted to healing at a 1:1 ratio — you still generate DRP from this damage. Costs all remaining DRP. Draw a card each turn while active — face cards grant +1d8 temporary HP.',
    icon: 'spell_shadow_shadowfury',
    maxRanks: 2,
    position: { x: 2, y: 5 },
    requires: 'citadel_t4_abyssal_foundations',
  },
  {
    id: 'citadel_t5_shadow_sovereign',
    name: 'Shadow Sovereign',
    description: 'Enemies within 20 feet have their damage reduced by 1d8 per rank. Allies gain +1d8 temporary HP per rank from the sovereign\'s blessing.',
    icon: 'spell_shadow_darkritual',
    maxRanks: 3,
    position: { x: 4, y: 5 },
    requires: 'citadel_t4_citadel_lord',
  },

  {
    id: 'citadel_t5_cataclysmic_siege',
    name: 'Cataclysmic Siege',
    description: 'Spend all DRP to unleash the citadel\'s siege weapons — deal 4d12 necrotic damage per rank in a 30-foot radius. For the next round, all damage you take converts to DRP at a 1:1 ratio instead of 4:1.',
    icon: 'spell_shadow_shadowembrace',
    maxRanks: 2,
    position: { x: 1, y: 6 },
    requires: 'citadel_t4_siege_engines',
  },

  {
    id: 'citadel_t6_eternal_fortress',
    name: 'Eternal Fortress',
    description: 'When you would die, the citadel automatically triggers Dark Rebirth as if you had maximum DRP. Draw a card when this triggers — if it\'s a face card, you revive with full HP instead.',
    icon: 'spell_shadow_twilight',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['citadel_t5_impenetrable_palace', 'citadel_t5_shadow_sovereign', 'citadel_t5_cataclysmic_siege'],
  }
];

export const DREADNAUGHT_SUFFERING_WEAVER = [
  // FOUNDATION (t0-t2): Deterministic damage/healing
  {
    id: 'weaver_t0_suffering_nexus',
    name: 'Suffering Nexus',
    description: 'Deal +1d4 necrotic damage per rank with weapon attacks. Gain +1 DRP per rank whenever you deal necrotic damage.',
    icon: 'spell_shadow_soulleech_3',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  {
    id: 'weaver_t1_agony_threads',
    name: 'Agony Threads',
    description: 'Wraith Strike heals you for an additional 1d4 HP per rank. You can spend DRP to empower weapon attacks with necrotic damage.',
    icon: 'spell_shadow_lifedrain',
    maxRanks: 4,
    position: { x: 0, y: 1 },
    requires: 'weaver_t0_suffering_nexus',
  },
  {
    id: 'weaver_t1_pain_conversion',
    name: 'Pain Conversion',
    description: 'Convert HP to DRP more efficiently: 3 HP = 1 DRP per rank (minimum 2 HP). When you convert HP, gain resistance to necrotic damage for 1 round.',
    icon: 'spell_shadow_bloodboil',
    maxRanks: 3,
    position: { x: 4, y: 1 },
    requires: 'weaver_t0_suffering_nexus',
  },

  {
    id: 'weaver_t2_soul_bindings',
    name: 'Soul Bindings',
    description: 'Enemies you damage with necrotic effects take 1d6 necrotic damage per rank at the start of their turn as the web tightens. When you heal, steal 1d4 HP per rank from the nearest enemy through the bindings.',
    icon: 'spell_shadow_curseofsargeras',
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: 'weaver_t1_agony_threads',
  },
  {
    id: 'weaver_t2_weave_generator',
    name: 'Weave Generator',
    description: 'Gain 1 DRP per 3 necrotic damage dealt per rank. When you reach 30+ DRP, your Wraith Strike has advantage on attack rolls as the web guides your strikes.',
    icon: 'spell_shadow_siphonmana',
    maxRanks: 4,
    position: { x: 3, y: 2 },
    requires: 'weaver_t1_pain_conversion',
  },

  {
    id: 'weaver_t2_torment_overflow',
    name: 'Torment Overflow',
    description: 'Your healing from Wraith Strike increases by 50%. When you heal above maximum HP, excess becomes temporary HP equal to the overflow per rank.',
    icon: 'spell_shadow_deathscream',
    maxRanks: 3,
    position: { x: 2, y: 3 },
    requires: ['weaver_t2_soul_bindings', 'weaver_t2_weave_generator'],
  },

  // SPECIALIZATION (t3-t4): Conditional triggers
  {
    id: 'weaver_t3_death_harvester',
    name: 'Death Harvester',
    description: 'When enemies die within 30 feet, gain 1d6 DRP per rank as their essence flows through the web. You can spend 10 DRP to automatically kill enemies below 25% HP.',
    icon: 'spell_shadow_deathcoil',
    maxRanks: 3,
    position: { x: 0, y: 3 },
    requires: 'weaver_t2_soul_bindings',
  },
  {
    id: 'weaver_t3_necrotic_tapestry',
    name: 'Necrotic Tapestry',
    description: 'Wraith Strike can be used at range (30 feet) and deals maximum damage on critical hits. Draw a card when casting — hearts double the necrotic damage as the tapestry amplifies your power.',
    icon: 'spell_shadow_contagion',
    maxRanks: 4,
    position: { x: 4, y: 3 },
    requires: 'weaver_t2_weave_generator',
  },

  {
    id: 'weaver_t3_blood_ritual',
    name: 'Blood Ritual',
    description: 'Spend HP instead of DRP for abilities: 4 HP = 1 DRP per rank. When you do this, gain +1d8 bonus necrotic damage per rank for 1 round as blood weaves through the pattern.',
    icon: 'spell_shadow_ritualofsacrifice',
    maxRanks: 3,
    position: { x: 1, y: 4 },
    requires: 'weaver_t3_death_harvester',
  },
  {
    id: 'weaver_t4_vitality_drain',
    name: 'Vitality Drain',
    description: 'Allies within 15 feet heal for 1d4 HP per rank when you deal necrotic damage. You gain +1 to attack rolls per rank against enemies ensnared in your web.',
    icon: 'spell_shadow_vampiricaura',
    maxRanks: 3,
    position: { x: 3, y: 4 },
    requires: 'weaver_t3_necrotic_tapestry',
  },

  // POWER (t5-t6): Card/coin procs
  {
    id: 'weaver_t4_dark_pact',
    name: 'Dark Pact',
    description: 'Dark Rebirth costs 50% less DRP but you must sacrifice 2d10 HP from nearby allies. In return, gain +2 to all abilities per rank for 1 minute.',
    icon: 'spell_shadow_demonicpact',
    maxRanks: 2,
    position: { x: 2, y: 4 },
    requires: 'weaver_t2_torment_overflow',
  },

  {
    id: 'weaver_t4_soul_consumer',
    name: 'Soul Consumer',
    description: 'When you reduce an enemy to 0 HP, gain maximum HP equal to their CR per rank, up to 20 HP.',
    icon: 'spell_shadow_soulgem',
    maxRanks: 3,
    position: { x: 0, y: 5 },
    requires: 'weaver_t3_blood_ritual',
  },
  {
    id: 'weaver_t5_endless_weaving',
    name: 'Endless Weaving',
    description: 'You no longer have a DRP maximum as the web expands infinitely. Roll a d20 each time you deal damage: on 15+ per rank, gain an additional action on your next turn.',
    icon: 'spell_shadow_darkritual',
    maxRanks: 2,
    position: { x: 4, y: 5 },
    requires: 'weaver_t4_vitality_drain',
  },

  {
    id: 'weaver_t5_soul_shattering',
    name: 'Soul Shattering',
    description: 'Target one creature. Deal 3d12 necrotic damage per rank and heal for 50% of damage dealt as their soul unravels. Costs 25 DRP.',
    icon: 'spell_shadow_fingerofdeath',
    maxRanks: 3,
    position: { x: 1, y: 6 },
    requires: 'weaver_t4_soul_consumer',
  },
  {
    id: 'weaver_t5_living_tapestry',
    name: 'Living Tapestry',
    description: 'Enemies you kill become woven constructs. Control up to 1d4 constructs per rank, each with 2d6 HP and necrotic attacks that spread the web.',
    icon: 'spell_shadow_raisedead',
    maxRanks: 2,
    position: { x: 3, y: 6 },
    requires: 'weaver_t5_endless_weaving',
  },

  {
    id: 'weaver_t6_immortal_weaver',
    name: 'Immortal Weaver',
    description: 'When you would reach 0 HP, enter Woven State — remain at 1 HP and regenerate 5d10 HP per turn for 3 rounds. During Woven State, you take double damage but generate double DRP from each hit.',
    icon: 'spell_shadow_soulleech_3',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['weaver_t4_dark_pact', 'weaver_t5_soul_shattering', 'weaver_t5_living_tapestry'],
  }
];

export const DREADNAUGHT_DOOM_BRINGER = [
  // FOUNDATION (t0-t2): Deterministic retribution
  {
    id: 'bringer_t0_doom_harbinger',
    name: 'Doom Harbinger',
    description: 'Deal +1d4 necrotic damage per rank to attackers who hit you in melee. Gain +1 to your next attack roll per rank whenever you take 20+ damage in a single hit.',
    icon: 'spell_shadow_demonicempathy',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  {
    id: 'bringer_t1_vengeance_fissures',
    name: 'Vengeance Fissures',
    description: 'Attackers take an additional 1d4 necrotic damage per rank as cracks appear beneath them. Necrotic Aura costs 2 less DRP and lasts 1 additional round per rank.',
    icon: 'spell_shadow_shadowfiend',
    maxRanks: 4,
    position: { x: 1, y: 1 },
    requires: 'bringer_t0_doom_harbinger',
  },
  {
    id: 'bringer_t1_wrathful_resurrection',
    name: 'Wrathful Resurrection',
    description: 'Dark Rebirth grants +1 to attack and damage rolls per rank for 1 minute. You can choose to unleash necrotic damage equal to your DRP when you rebirth.',
    icon: 'spell_shadow_psychicscream',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'bringer_t0_doom_harbinger',
  },

  {
    id: 'bringer_t2_retribution_strikes',
    name: 'Retribution Strikes',
    description: 'When you take damage, your next attack deals +1d6 necrotic damage per rank. If the triggering attacker is your target, gain advantage on the attack.',
    icon: 'spell_shadow_curse',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'bringer_t1_vengeance_fissures',
  },
  {
    id: 'bringer_t2_apocalyptic_echoes',
    name: 'Apocalyptic Echoes',
    description: 'When you use Wraith Strike, all enemies within 10 feet take 1d4 necrotic damage per rank from echoing cracks. This echo damage doubles if Wraith Strike deals a critical hit.',
    icon: 'spell_shadow_curseofsargeras',
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: 'bringer_t1_wrathful_resurrection',
  },

  {
    id: 'bringer_t2_doom_tempest',
    name: 'Doom Tempest',
    description: 'Necrotic Aura deals 1d4 necrotic damage per rank per turn to affected enemies. Enemies in the aura have disadvantage on concentration saves as reality frays.',
    icon: 'spell_shadow_shadesofdarkness',
    maxRanks: 4,
    position: { x: 2, y: 2 },
    requires: ['bringer_t1_vengeance_fissures', 'bringer_t1_wrathful_resurrection'],
  },

  // SPECIALIZATION (t3-t4): Conditional triggers
  {
    id: 'bringer_t3_wrathful_rebuke',
    name: 'Wrathful Rebuke',
    description: 'When hit by an attack, you can use your reaction to attack the attacker through a fracture. Deal +1d8 necrotic damage per rank and they have disadvantage on their next attack.',
    icon: 'spell_shadow_unholyfrenzy',
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: 'bringer_t2_retribution_strikes',
  },
  {
    id: 'bringer_t3_vengeful_manifestations',
    name: 'Vengeful Manifestations',
    description: 'Dark Rebirth summons 1d4 spectral warriors per rank with 2d6 HP each that attack your enemies for 1 round.',
    icon: 'spell_shadow_raisedead',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'bringer_t2_apocalyptic_echoes',
  },

  {
    id: 'bringer_t3_aura_of_ruin',
    name: 'Aura of Ruin',
    description: 'Enemies within 15 feet provoke opportunity attacks from you through fractures. When they move, they take 1d8 necrotic damage per rank as cracks erupt beneath them.',
    icon: 'spell_shadow_auraofdarkness',
    maxRanks: 4,
    position: { x: 0, y: 4 },
    requires: 'bringer_t3_wrathful_rebuke',
  },
  {
    id: 'bringer_t4_eternal_curse',
    name: 'Eternal Curse',
    description: 'Enemies that kill you are marked with doom fractures. They take 2d10 necrotic damage per rank at the start of each turn until they die or you are defeated.',
    icon: 'spell_shadow_curseofachimonde',
    maxRanks: 3,
    position: { x: 4, y: 4 },
    requires: 'bringer_t3_vengeful_manifestations',
  },

  {
    id: 'bringer_t4_final_reckoning',
    name: 'Final Reckoning',
    description: 'Track damage taken from each enemy. Once per round per rank, deal necrotic damage equal to the damage they dealt you as cracks swallow them.',
    icon: 'spell_shadow_mindtwisting',
    maxRanks: 3,
    position: { x: 2, y: 4 },
    requires: 'bringer_t2_doom_tempest',
  },

  // POWER (t5-t6): Card/coin procs
  {
    id: 'bringer_t4_apocalypse_bringer',
    name: 'Apocalypse Bringer',
    description: 'Necrotic Aura causes enemies to take maximum damage from your attacks. When they die in the aura, their bodies explode for 2d8 necrotic damage per rank in a 10-foot radius.',
    icon: 'spell_shadow_contagion',
    maxRanks: 2,
    position: { x: 1, y: 5 },
    requires: 'bringer_t3_aura_of_ruin',
  },
  {
    id: 'bringer_t5_doom_shield',
    name: 'Doom Shield',
    description: 'Redirect any attack against an ally through a fracture to yourself. The attacker takes 1d12 necrotic damage per rank and falls into a temporary fracture.',
    icon: 'spell_shadow_darkritual',
    maxRanks: 2,
    position: { x: 3, y: 5 },
    requires: 'bringer_t4_eternal_curse',
  },

  {
    id: 'bringer_t5_cataclysmic_wrath',
    name: 'Cataclysmic Wrath',
    description: 'When you take damage, all enemies within 20 feet take necrotic damage equal to half the damage you took per rank through massive fractures. This damage cannot be reduced or resisted.',
    icon: 'spell_shadow_shadowfury',
    maxRanks: 2,
    position: { x: 0, y: 6 },
    requires: 'bringer_t4_apocalypse_bringer',
  },
  {
    id: 'bringer_t5_armageddon',
    name: 'Armageddon',
    description: 'Spend all DRP to trigger global apocalypse. All enemies that damaged you this combat take 3d12 necrotic damage per rank as reality fractures around them. Flip a coin — on heads, they are also stunned for 1 round.',
    icon: 'spell_shadow_focusedpower',
    maxRanks: 3,
    position: { x: 2, y: 5 },
    requires: 'bringer_t4_final_reckoning',
  },

  {
    id: 'bringer_t6_eternal_doom',
    name: 'Eternal Doom',
    description: 'Enemies that move more than 10 feet away from you are slowed and take 4d12 necrotic damage per rank. Flip a coin — on heads, they are also pulled 10 feet back toward you as fractures drag at their feet.',
    icon: 'spell_shadow_demonicempathy',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['bringer_t5_cataclysmic_wrath', 'bringer_t5_armageddon', 'bringer_t5_doom_shield'],
  }
];
