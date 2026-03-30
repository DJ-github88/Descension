// ============================================
// WARDEN TALENT TREES
// ============================================

export const WARDEN_SHADOWBLADE = [
  // Foundation: The Hunter's Precision (Central targeting crosshair)
  {
    id: 'shadowblade_warden_t0_vengeful_pursuit',
    name: 'Vengeful Pursuit',
    description: 'Vengeance Points build 50% faster from successful attacks against marked targets. You can mark targets as a 1 action point, gaining +1 VP per successful attack against them.',
    icon: 'ability_hunter_assassinate',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Upper Crosshair: Stealth Enhancement (Precision targeting lines)
  {
    id: 'shadowblade_warden_t1_shadow_stalker',
    name: 'Shadow Stalker',
    description: 'You can hide as a 1 action point after attacking. Stealth attacks generate +2 VP instead of +1. Marked targets cannot detect you through blindsight or tremorsense.',
    icon: 'ability_stealth',
    maxRanks: 4,
    position: { x: 1, y: 1 },
    requires: 'shadowblade_warden_t0_vengeful_pursuit',
  },
  {
    id: 'shadowblade_warden_t2_predator_strike',
    name: 'Predator Strike',
    description: 'Attacks against marked targets crit on 19-20. When you crit against a marked target, you can teleport 10ft to another enemy within 30ft.',
    icon: 'ability_hunter_snipershot',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'shadowblade_warden_t1_shadow_stalker',
  },
  {
    id: 'shadowblade_warden_t3_unseen_executioner',
    name: 'Unseen Executioner',
    description: 'Marked targets below 50% HP take double damage from your attacks. When you kill a marked target, you can hide as a 1 action point.',
    icon: 'ability_rogue_shadowstrike',
    maxRanks: 2,
    position: { x: 1, y: 3 },
    requires: 'shadowblade_warden_t2_predator_strike',
  },

  // Lower Crosshair: Burst Damage (Impact targeting lines)
  {
    id: 'shadowblade_warden_t1_burst_damage',
    name: 'Burst Damage',
    description: 'Spend 2 VP to make your next attack deal +3d6 damage. This damage bypasses damage resistance. Can be used after hitting for maximum effect.',
    icon: 'ability_warrior_weaponmastery',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'shadowblade_warden_t0_vengeful_pursuit',
  },
  {
    id: 'shadowblade_warden_t2_execution_strike',
    name: 'Execution Strike',
    description: 'Spend 4 VP to attempt to execute a target below 25% HP. Target must succeed on a CON save (DC 15 + your proficiency) or die instantly.',
    icon: 'ability_rogue_deadliness',
    maxRanks: 4,
    position: { x: 4, y: 2 },
    requires: 'shadowblade_warden_t1_burst_damage',
  },
  {
    id: 'shadowblade_warden_t3_deadly_precision',
    name: 'Deadly Precision',
    description: 'Your attacks against marked targets ignore half cover and three-quarters cover. Marked targets have disadvantage on saves against your abilities.',
    icon: 'ability_hunter_focusedaim',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'shadowblade_warden_t2_execution_strike',
  },

  // Crosshair Center: Ultimate Assassin (Bullseye convergence)
  {
    id: 'shadowblade_warden_t4_marked_for_death',
    name: 'Marked for Death',
    description: 'You can have up to 3 marked targets simultaneously. When you attack a marked target, all other marked targets take 1d6 damage.',
    icon: 'ability_hunter_markedfordeath',
    maxRanks: 2,
    position: { x: 2, y: 1 },
    requires: 'shadowblade_warden_t1_shadow_stalker',
  },
  {
    id: 'shadowblade_warden_t5_apex_hunter',
    name: 'Apex Hunter',
    description: 'While you have 8+ VP, your attacks against marked targets deal maximum damage and you can spend 1 VP to attack twice as a reaction when hit.',
    icon: 'ability_druid_predatoryinstincts',
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: ['shadowblade_warden_t3_unseen_executioner', 'shadowblade_warden_t3_deadly_precision'],
  },
  {
    id: 'shadowblade_warden_t6_shadowblade_ascendant',
    name: 'Shadowblade Ascendant',
    description: 'Ultimate ability: Become a shadow entity for 1 minute. All attacks are silent, you phase through walls, attacks deal +4d6 damage, and marked targets cannot escape. Costs all VP.',
    icon: 'spell_shadow_demonicempathy',
    maxRanks: 1,
    position: { x: 2, y: 5 },
    requires: 'shadowblade_warden_t5_apex_hunter',
  }
];

export const WARDEN_JAILER = [
  // Foundation: The Spectral Prison (Central containment field)
  {
    id: 'jailer_t0_spectral_warden',
    name: 'Spectral Warden',
    description: 'Cage of Vengeance costs 1 less VP. Caged enemies take +1d6 damage from all sources and have disadvantage on escape attempts. VP decays 50% slower.',
    icon: 'spell_shadow_shackleundead',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Left Containment Fields: Single Target Control (Individual prison cells)
  {
    id: 'jailer_t1_enhanced_caging',
    name: 'Enhanced Caging',
    description: 'Cage of Vengeance lasts 1 round longer. Caged enemies cannot teleport or plane shift. You can spend 1 VP to extend any cage by 1 round.',
    icon: 'ability_warrior_shieldwall',
    maxRanks: 4,
    position: { x: 1, y: 1 },
    requires: 'jailer_t0_spectral_warden',
  },
  {
    id: 'jailer_t2_torment_traps',
    name: 'Torment Traps',
    description: 'When you cage an enemy, they take 2d6 psychic damage at the start of each of their turns. This damage increases by 1d6 per round they remain caged.',
    icon: 'spell_shadow_curseofsargeras',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'jailer_t1_enhanced_caging',
  },
  {
    id: 'jailer_t3_isolation_protocol',
    name: 'Isolation Protocol',
    description: 'Caged enemies cannot be targeted by their allies\' spells or abilities. When an ally tries to help a caged enemy, they take 2d6 force damage.',
    icon: 'spell_holy_sealofwrath',
    maxRanks: 2,
    position: { x: 1, y: 3 },
    requires: 'jailer_t2_torment_traps',
  },

  // Right Containment Fields: Area Control (Prison complex)
  {
    id: 'jailer_t1_mass_confinement',
    name: 'Mass Confinement',
    description: 'You can spend 8 VP to cage all enemies in a 20ft radius. This creates multiple smaller cages that last 2 rounds each.',
    icon: 'spell_shadow_blackplague',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'jailer_t0_spectral_warden',
  },
  {
    id: 'jailer_t2_prison_complex',
    name: 'Prison Complex',
    description: 'You can maintain up to 3 cages simultaneously. Caged enemies within 20ft of each other share damage - damage to one is split among all caged enemies.',
    icon: 'spell_shadow_antimagic',
    maxRanks: 4,
    position: { x: 4, y: 2 },
    requires: 'jailer_t1_mass_confinement',
  },
  {
    id: 'jailer_t3_execution_chamber',
    name: 'Execution Chamber',
    description: 'Spend 6 VP to create an execution chamber around a caged enemy. They take double damage from all sources and cannot be healed for 3 rounds.',
    icon: 'spell_shadow_deathcoil',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'jailer_t2_prison_complex',
  },

  // Central Prison Nexus: Ultimate Containment (Maximum security convergence)
  {
    id: 'jailer_t4_spectral_overlord',
    name: 'Spectral Overlord',
    description: 'Your cages become immune to dispel magic. Caged enemies generate VP for you equal to the damage they take. You can teleport between your cages as a 1 action point.',
    icon: 'spell_shadow_shadetruesight',
    maxRanks: 2,
    position: { x: 2, y: 2 },
    requires: ['jailer_t1_enhanced_caging', 'jailer_t1_mass_confinement'],
  },
  {
    id: 'jailer_t5_master_jailer',
    name: 'Master Jailer',
    description: 'Cage of Vengeance costs 3 VP instead of 5. You can cage enemies regardless of their size or type. Caged creatures cannot use legendary actions or lair actions.',
    icon: 'ability_warrior_shieldmastery',
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: ['jailer_t3_isolation_protocol', 'jailer_t3_execution_chamber'],
  },
  {
    id: 'jailer_t6_prison_dimension',
    name: 'Prison Dimension',
    description: 'Ultimate ability: Create a pocket dimension for 1 minute. All caged enemies are banished to this dimension and take 6d6 force damage per round. You can enter/exit freely. Costs all VP.',
    icon: 'spell_shadow_demonicempathy',
    maxRanks: 1,
    position: { x: 2, y: 5 },
    requires: 'jailer_t5_master_jailer',
  }
];

export const WARDEN_AVENGER = [
  // Foundation: The Vengeful Flame (Central burning core)
  {
    id: 'avenger_t0_unyielding_vengeance',
    name: 'Unyielding Vengeance',
    description: 'Vengeance Points max at 15 instead of 10. When you take damage, gain +1 VP. Avatar of Vengeance lasts 1 round longer and grants +1 damage per die.',
    icon: 'spell_fire_elemental_totem',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Left Fury Spirals: Damage Amplification (Burning vengeance coils)
  {
    id: 'avenger_t1_wrathful_strikes',
    name: 'Wrathful Strikes',
    description: 'Your attacks deal +1d6 damage per VP you have (maximum +5d6 at 5+ VP). This damage is fire type and ignores fire resistance.',
    icon: 'ability_warrior_weaponmastery',
    maxRanks: 4,
    position: { x: 1, y: 1 },
    requires: 'avenger_t0_unyielding_vengeance',
  },
  {
    id: 'avenger_t2_vengeful_retribution',
    name: 'Vengeful Retribution',
    description: 'When you take damage, the attacker takes 2d6 fire damage in return. This damage increases by 1d6 for each VP you have (maximum +6d6).',
    icon: 'spell_fire_soulburn',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'avenger_t1_wrathful_strikes',
  },
  {
    id: 'avenger_t3_burning_vengeance',
    name: 'Burning Vengeance',
    description: 'Enemies that damage you are marked with burning vengeance. They take 3d6 fire damage at the start of each of their turns until you defeat them.',
    icon: 'spell_fire_incinerate',
    maxRanks: 2,
    position: { x: 1, y: 3 },
    requires: 'avenger_t2_vengeful_retribution',
  },

  // Right Fury Spirals: Power Scaling (Escalating vengeance waves)
  {
    id: 'avenger_t1_fury_buildup',
    name: 'Fury Buildup',
    description: 'You gain +1 VP when you kill an enemy. When you reach maximum VP, your next attack deals +4d6 damage and knocks the target back 20ft.',
    icon: 'ability_warrior_battleshout',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'avenger_t0_unyielding_vengeance',
  },
  {
    id: 'avenger_t2_avatar_synergy',
    name: 'Avatar Synergy',
    description: 'During Avatar of Vengeance, you gain +2 VP per round instead of +1. Avatar abilities cost 2 VP less to use. Avatar lasts 2 rounds longer.',
    icon: 'spell_fire_elementaldevastation',
    maxRanks: 4,
    position: { x: 4, y: 2 },
    requires: 'avenger_t1_fury_buildup',
  },
  {
    id: 'avenger_t3_vengeful_immolation',
    name: 'Vengeful Immolation',
    description: 'When you activate Avatar of Vengeance, all enemies within 20ft take 4d6 fire damage and are ignited, taking 2d6 fire damage per round for 3 rounds.',
    icon: 'spell_fire_volcano',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'avenger_t2_avatar_synergy',
  },

  // Central Fury Nexus: Maximum Vengeance (Burning power core)
  {
    id: 'avenger_t4_eternal_wrath',
    name: 'Eternal Wrath',
    description: 'VP cannot decay below 5. When you would be reduced to 0 HP, you can spend 5 VP to automatically stabilize and enter Avatar of Vengeance.',
    icon: 'spell_fire_elemental_totem',
    maxRanks: 2,
    position: { x: 2, y: 2 },
    requires: ['avenger_t1_wrathful_strikes', 'avenger_t1_fury_buildup'],
  },
  {
    id: 'avenger_t5_avatar_perfection',
    name: 'Avatar Perfection',
    description: 'During Avatar of Vengeance, you are immune to fire damage, your attacks deal maximum fire damage, and you can teleport 30ft between attacks.',
    icon: 'spell_fire_immolation',
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: ['avenger_t3_burning_vengeance', 'avenger_t3_vengeful_immolation'],
  },
  {
    id: 'avenger_t6_vengeance_incarnate',
    name: 'Vengeance Incarnate',
    description: 'Ultimate ability: Become the living embodiment of vengeance for 1 minute. All damage you deal becomes fire damage, you take half damage from all sources, and enemies that damage you explode for 8d6 fire damage in 20ft radius. Costs all VP.',
    icon: 'spell_fire_elementaldevastation',
    maxRanks: 1,
    position: { x: 2, y: 5 },
    requires: 'avenger_t5_avatar_perfection',
  }
];
