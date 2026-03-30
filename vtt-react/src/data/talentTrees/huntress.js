// ============================================
// HUNTRESS TALENT TREES
// ============================================

export const HUNTRESS_SHADOWBLADE = [
  // Foundation: The Shadow's Embrace (Central dark nexus)
  {
    id: 'shadowblade_t0_glaive_mastery',
    name: 'Glaive Mastery',
    description: 'Shadow Glaive chains to +1 additional target. You can spend 1 action point to hide after a successful glaive attack. Quarry Marks build 25% faster against marked targets.',
    icon: 'ability_stealth',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Left Shadow Tendrils: Stealth Enhancement (Dark branching paths)
  {
    id: 'shadowblade_t1_shadow_strike',
    name: 'Shadow Strike',
    description: 'Glaive attacks from stealth deal +2d6 bonus damage and generate +1 extra Quarry Mark. You can enter stealth using 1 action point while in combat.',
    icon: 'ability_rogue_shadowstrike',
    maxRanks: 4,
    position: { x: 1, y: 1 },
    requires: 'shadowblade_t0_glaive_mastery',
  },
  {
    id: 'shadowblade_t2_dark_presence',
    name: 'Dark Presence',
    description: 'Enemies within 10ft of you have disadvantage on Perception checks to detect you. Your companion can enter stealth with you.',
    icon: 'spell_shadow_nethercloak',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'shadowblade_t1_shadow_strike',
  },
  {
    id: 'shadowblade_t3_phantom_step',
    name: 'Phantom Step',
    description: 'Spend 2 Quarry Marks to teleport 30ft to an enemy within 60ft, appearing in stealth and attacking with advantage.',
    icon: 'spell_shadow_shadowstep',
    maxRanks: 2,
    position: { x: 1, y: 3 },
    requires: 'shadowblade_t2_dark_presence',
  },

  // Right Shadow Tendrils: Glaive Specialization (Weapon mastery paths)
  {
    id: 'shadowblade_t1_chain_mastery',
    name: 'Chain Mastery',
    description: 'Shadow Glaive chains ignore difficult terrain and can chain through allies. Chained enemies take +1d4 damage per chain link.',
    icon: 'spell_shadow_lifedrain',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'shadowblade_t0_glaive_mastery',
  },
  {
    id: 'shadowblade_t2_glaive_dance',
    name: 'Glaive Dance',
    description: 'After a successful glaive attack, you can spend 1 Quarry Mark to immediately attack another enemy within range.',
    icon: 'ability_warrior_weaponmastery',
    maxRanks: 4,
    position: { x: 4, y: 2 },
    requires: 'shadowblade_t1_chain_mastery',
  },
  {
    id: 'shadowblade_t3_shadow_eruption',
    name: 'Shadow Eruption',
    description: 'When you kill an enemy with a glaive attack, all enemies within 10ft take 2d6 shadow damage and cannot take reactions until your next turn.',
    icon: 'spell_shadow_shadowfury',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'shadowblade_t2_glaive_dance',
  },

  // Central Shadow Convergence: Ultimate Assassin (Dark power nexus)
  {
    id: 'shadowblade_t4_shadow_synergy',
    name: 'Shadow Synergy',
    description: 'Your companion attacks generate Quarry Marks as if they were your glaive attacks. Stealth attacks allow you to spend 1 Quarry Mark to mark the target automatically.',
    icon: 'ability_druid_predatoryinstincts',
    maxRanks: 2,
    position: { x: 2, y: 2 },
    requires: ['shadowblade_t1_shadow_strike', 'shadowblade_t1_chain_mastery'],
  },
  {
    id: 'shadowblade_t5_apex_predator',
    name: 'Apex Predator',
    description: 'While you have 5+ Quarry Marks, your glaive attacks crit on 18-20 and you can spend 1 Quarry Mark to attack twice as a reaction when an enemy attacks you.',
    icon: 'ability_hunter_assassinate',
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: ['shadowblade_t3_phantom_step', 'shadowblade_t3_shadow_eruption'],
  },
  {
    id: 'shadowblade_t6_shadow_assassin',
    name: 'Shadow Assassin',
    description: 'Ultimate ability: Become a shadow entity for 1 minute. All attacks are silent and cannot be heard, you phase through walls, and glaive attacks deal maximum damage. Costs 5 Quarry Marks.',
    icon: 'spell_shadow_demonicempathy',
    maxRanks: 1,
    position: { x: 2, y: 5 },
    requires: 'shadowblade_t5_apex_predator',
  }
];

export const HUNTRESS_SENTINEL = [
  // Foundation: The Guardian's Vigil (Central protective ward)
  {
    id: 'sentinel_t0_wardens_vigil',
    name: 'Warden\'s Vigil',
    description: 'Allies within 30ft gain +1 armor while you have an active Quarry Mark. Your companion can protect allies, granting +1 armor to one ally using 1 action point.',
    icon: 'spell_holy_devotionaura',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Left Guardian Circles: Protective Barriers (Concentric defense rings)
  {
    id: 'sentinel_t1_aura_of_protection',
    name: 'Aura of Protection',
    description: 'Allies within 10ft of you or your companion gain resistance to the damage type of your last glaive attack for 1 round.',
    icon: 'spell_holy_powerwordshield',
    maxRanks: 4,
    position: { x: 1, y: 1 },
    requires: 'sentinel_t0_wardens_vigil',
  },
  {
    id: 'sentinel_t2_guardian_stance',
    name: 'Guardian Stance',
    description: 'When an ally within 30ft takes damage, you can spend 2 Quarry Marks to reduce the damage by 1d8 per mark spent and take half the remaining damage.',
    icon: 'ability_warrior_shieldwall',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'sentinel_t1_aura_of_protection',
  },
  {
    id: 'sentinel_t3_sacred_ground',
    name: 'Sacred Ground',
    description: 'You can create a 20ft radius protective zone for 1 minute. Allies inside gain +2 armor and resistance to necrotic damage. Costs 3 Quarry Marks to activate.',
    icon: 'spell_holy_circleofrenewal',
    maxRanks: 2,
    position: { x: 1, y: 3 },
    requires: 'sentinel_t2_guardian_stance',
  },

  // Right Guardian Circles: Active Defense (Offensive protection rings)
  {
    id: 'sentinel_t1_retaliation',
    name: 'Retaliation',
    description: 'When an ally within 30ft is attacked, you can spend 1 Quarry Mark to make a glaive attack against the attacker as a reaction.',
    icon: 'ability_parry',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'sentinel_t0_wardens_vigil',
  },
  {
    id: 'sentinel_t2_companion_bond',
    name: 'Companion Bond',
    description: 'Your companion can take the Defend action for allies within 30ft. When your companion protects an ally, it gains temporary HP equal to your proficiency bonus.',
    icon: 'ability_hunter_beastcall',
    maxRanks: 4,
    position: { x: 4, y: 2 },
    requires: 'sentinel_t1_retaliation',
  },
  {
    id: 'sentinel_t3_vigilant_strike',
    name: 'Vigilant Strike',
    description: 'Your glaive attacks against enemies that damaged your allies this turn deal +2d6 damage and generate +1 extra Quarry Mark.',
    icon: 'ability_warrior_focusedrage',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'sentinel_t2_companion_bond',
  },

  // Central Guardian Nexus: Protective Mastery (Interlocking wards)
  {
    id: 'sentinel_t4_wardens_synergy',
    name: 'Warden\'s Synergy',
    description: 'When you or your companion protect an ally, all allies within 30ft gain +1 to their next attack roll or saving throw.',
    icon: 'spell_holy_prayerofspirit',
    maxRanks: 2,
    position: { x: 2, y: 2 },
    requires: ['sentinel_t1_aura_of_protection', 'sentinel_t1_retaliation'],
  },
  {
    id: 'sentinel_t5_eternal_guardian',
    name: 'Eternal Guardian',
    description: 'Your Sacred Ground becomes permanent and you can activate it using 1 action point. Allies inside cannot be frightened or charmed.',
    icon: 'spell_holy_divineprovidence',
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: ['sentinel_t3_sacred_ground', 'sentinel_t3_vigilant_strike'],
  },
  {
    id: 'sentinel_t6_warden_of_light',
    name: 'Warden of Light',
    description: 'Ultimate ability: Create a massive ward for 1 minute that protects all allies within 40ft. They gain +3 armor, resistance to all damage, and cannot be targeted by enemy spells. Costs 5 Quarry Marks.',
    icon: 'spell_holy_resurrection',
    maxRanks: 1,
    position: { x: 2, y: 5 },
    requires: 'sentinel_t5_eternal_guardian',
  }
];

export const HUNTRESS_BEASTMASTER = [
  // Foundation: The Primal Bond (Central companion nexus)
  {
    id: 'beastmaster_t0_primal_bond',
    name: 'Primal Bond',
    description: 'Your companion gains +1d6 damage on attacks. When you spend Quarry Marks on abilities, your companion gains +1d4 damage for 1 minute. Your companion shares your Quarry Mark generation.',
    icon: 'ability_hunter_beastcall',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Left Beast Pack: Companion Enhancement (Animal coordination patterns)
  {
    id: 'beastmaster_t1_pack_tactics',
    name: 'Pack Tactics',
    description: 'When you or your companion attack the same enemy in the same round, both attacks gain advantage. Your companion can flank enemies 10ft away from you.',
    icon: 'ability_hunter_beastcall02',
    maxRanks: 4,
    position: { x: 1, y: 1 },
    requires: 'beastmaster_t0_primal_bond',
  },
  {
    id: 'beastmaster_t2_beast_fury',
    name: 'Beast Fury',
    description: 'Your companion can make 2 attacks per action instead of 1. When your companion crits, you gain +1 Quarry Mark.',
    icon: 'ability_druid_ferociousbite',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'beastmaster_t1_pack_tactics',
  },
  {
    id: 'beastmaster_t3_savage_coordination',
    name: 'Savage Coordination',
    description: 'Once per turn, when your companion attacks, you can spend 1 Quarry Mark to make a glaive attack against the same target using 1 action point.',
    icon: 'ability_hunter_animalhandler',
    maxRanks: 2,
    position: { x: 1, y: 3 },
    requires: 'beastmaster_t2_beast_fury',
  },

  // Right Beast Pack: Synergistic Abilities (Coordinated attacks)
  {
    id: 'beastmaster_t1_bestial_synergy',
    name: 'Bestial Synergy',
    description: 'When you or your companion damage an enemy, the other gains +1d4 damage on their next attack against that enemy.',
    icon: 'ability_druid_predatoryinstincts',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'beastmaster_t0_primal_bond',
  },
  {
    id: 'beastmaster_t2_companion_commands',
    name: 'Companion Commands',
    description: 'You can command your companion using 1 action point instead of an action. Your companion can use the Attack action twice per command.',
    icon: 'ability_hunter_beastsoothe',
    maxRanks: 4,
    position: { x: 4, y: 2 },
    requires: 'beastmaster_t1_bestial_synergy',
  },
  {
    id: 'beastmaster_t3_primal_hunter',
    name: 'Primal Hunter',
    description: 'Your companion gains the ability to mark targets. Marked targets take +1d6 damage from your companion and cannot hide from it.',
    icon: 'ability_hunter_huntervswild',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'beastmaster_t2_companion_commands',
  },

  // Central Beast Nexus: Ultimate Coordination (Pack alpha leadership)
  {
    id: 'beastmaster_t4_alpha_predator',
    name: 'Alpha Predator',
    description: 'Your companion can spend your Quarry Marks to enhance its abilities. When you spend Quarry Marks on companion enhancements, the effect is doubled.',
    icon: 'ability_hunter_beastmastery',
    maxRanks: 2,
    position: { x: 2, y: 2 },
    requires: ['beastmaster_t1_pack_tactics', 'beastmaster_t1_bestial_synergy'],
  },
  {
    id: 'beastmaster_t5_primal_ascension',
    name: 'Primal Ascension',
    description: 'You and your companion share all damage and healing. When either of you takes damage, the other gains temporary HP equal to half the damage taken.',
    icon: 'spell_nature_spiritwolf',
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: ['beastmaster_t3_savage_coordination', 'beastmaster_t3_primal_hunter'],
  },
  {
    id: 'beastmaster_t6_beast_lord',
    name: 'Beast Lord',
    description: 'Ultimate ability: You and your companion transform into apex predators for 1 minute. You both gain +2d6 damage, advantage on attacks, and can make 2 attacks per action. Costs 5 Quarry Marks.',
    icon: 'ability_druid_primaltenacity',
    maxRanks: 1,
    position: { x: 2, y: 5 },
    requires: 'beastmaster_t5_primal_ascension',
  }
];
