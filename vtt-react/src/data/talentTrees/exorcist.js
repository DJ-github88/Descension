// ============================================
// EXORCIST TALENT TREES
// Divine Dominance System — DD-Integrated
// ============================================

export const EXORCIST_DEMONOLOGIST = [
  // Tier 0 - Foundation
  {
    id: 'demo_t0_binding_sigil',
    name: 'Binding Sigil',
    description: 'Your binding rituals are more efficient. Reduce mana cost of all binding spells by 5 per rank.',
    icon: 'spell_shadow_summonfelguard',
    maxRanks: 3,
    position: { x: 2, y: 1 },
    requires: null,
  },

  // Tier 1 - Multi-demon fundamentals
  {
    id: 'demo_t1_legion_mind',
    name: 'Legion Mind',
    description: 'Your mind splits to track multiple demons. +1 demon slot per rank (max 4 total).',
    icon: 'spell_shadow_enslavedemon',
    maxRanks: 2,
    position: { x: 0, y: 0 },
    requires: 'demo_t0_binding_sigil',
  },
  {
    id: 'demo_t1_steady_rein',
    name: 'Steady Rein',
    description: 'Dominance Die degrades every 2 actions instead of every action for demons you command. Your grip holds longer.',
    icon: 'spell_holy_exorcism',
    maxRanks: 2,
    position: { x: 4, y: 0 },
    requires: 'demo_t0_binding_sigil',
  },
  {
    id: 'demo_t1_mass_restoration',
    name: 'Mass Restoration',
    description: 'When you cast a DD restoration spell, all bound demons gain +1 DD step as well (half effect on non-targeted demons).',
    icon: 'spell_holy_circleofrenewal',
    maxRanks: 2,
    position: { x: 1, y: 2 },
    requires: 'demo_t0_binding_sigil',
  },
  {
    id: 'demo_t1_swarm_tactics',
    name: 'Swarm Tactics',
    description: 'When 3+ demons attack the same target, each deals +1d6 bonus damage per rank. The legion overwhelms.',
    icon: 'spell_shadow_curseofsargeras',
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: 'demo_t0_binding_sigil',
  },

  // Tier 2 - Dominance efficiency
  {
    id: 'demo_t2_economical_dominance',
    name: 'Economical Dominance',
    description: 'Reduce mana cost of all DD restoration spells by 1 per rank. Control becomes cheaper with experience.',
    icon: 'spell_shadow_grimward',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: 'demo_t1_steady_rein',
  },
  {
    id: 'demo_t2_quick_dismiss',
    name: 'Quick Dismiss',
    description: 'Dismissing a demon at d6 DD or higher refunds 50% of its binding mana cost. Strategic retreat has its rewards.',
    icon: 'spell_shadow_demonicfortitude',
    maxRanks: 2,
    position: { x: 2, y: 2 },
    requires: 'demo_t1_mass_restoration',
  },

  // Tier 3 - Advanced control
  {
    id: 'demo_t3_chain_resonance',
    name: 'Chain Resonance',
    description: 'When one demon escapes, all remaining demons\' DD improves by 1 step. Fear of loss strengthens your remaining grip.',
    icon: 'spell_shadow_antimagicshell',
    maxRanks: 2,
    position: { x: 1, y: 1 },
    requires: 'demo_t2_economical_dominance',
  },
  {
    id: 'demo_t3_demon_synergy',
    name: 'Demon Synergy',
    description: 'Each demon beyond the first grants +1d4 damage to all other demons\' attacks. They compete for your favor.',
    icon: 'spell_holy_powerwordbarrier',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'demo_t2_quick_dismiss',
  },

  // Tier 4 - Mastery
  {
    id: 'demo_t4_iron_will',
    name: 'Iron Will',
    description: 'When a demon reaches 0 DD, it gains advantage on its escape save (you roll twice, take better result for the demon). Wait — this helps YOU. The demon has disadvantage on escape saves.',
    icon: 'spell_shadow_enslavedemon',
    maxRanks: 2,
    position: { x: 0, y: 3 },
    requires: 'demo_t3_chain_resonance',
  },
  {
    id: 'demo_t4_demon_cyclone',
    name: 'Demon Cyclone',
    description: 'Once per combat: Command all demons to attack simultaneously. Each degrades DD by 1 step but deals +2d6 damage.',
    icon: 'spell_shadow_lifedrain',
    maxRanks: 1,
    position: { x: 4, y: 3 },
    requires: 'demo_t3_demon_synergy',
  },

  // Tier 5 - Ultimate
  {
    id: 'demo_t5_infernal_general',
    name: 'Infernal General',
    description: 'Your demons no longer degrade DD on the first action each turn. Only subsequent actions cost DD. You are the undisputed commander of the legion.',
    icon: 'spell_shadow_demonicempathy',
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: ['demo_t4_iron_will', 'demo_t4_demon_cyclone', 'demo_t2_economical_dominance'],
    requiresAll: true,
  }
];

// Demon Lord Specialization — Single powerful demon + Exorcist empowerment
export const EXORCIST_DEMON_LORD = [
  // Tier 0 - Foundation
  {
    id: 'dlord_t0_infernal_pact',
    name: 'Infernal Pact',
    description: 'Forge a deeper bond with your single demon. It gains +1d6 damage per rank and you gain resistance to its damage type.',
    icon: 'ability_warlock_demonicpower',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - Enhanced bond
  {
    id: 'dlord_t1_iron_grip',
    name: 'Iron Grip',
    description: 'Your demon\'s DD degrades every 2 actions instead of every action. Your singular focus yields stronger control.',
    icon: 'spell_shadow_felarmour',
    maxRanks: 2,
    position: { x: 1, y: 1 },
    requires: 'dlord_t0_infernal_pact',
  },
  {
    id: 'dlord_t1_shared_will',
    name: 'Shared Will',
    description: 'When your demon takes damage, you may redirect up to half to yourself. Pain shared is dominance maintained.',
    icon: 'spell_shadow_ragingscream',
    maxRanks: 2,
    position: { x: 3, y: 1 },
    requires: 'dlord_t0_infernal_pact',
  },

  // Tier 2 - Dual empowerment
  {
    id: 'dlord_t2_empowered_strikes',
    name: 'Empowered Strikes',
    description: 'Your demon\'s attacks deal +1d8 damage per rank. When your demon crits, restore 1 DD step.',
    icon: 'spell_fire_firebolt',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'dlord_t1_iron_grip',
  },
  {
    id: 'dlord_t2_fel_presence',
    name: 'Fel Presence',
    description: 'Enemies within 10ft of your demon have disadvantage on attacks against it. Your demon radiates terrifying authority.',
    icon: 'spell_shadow_mindsteal',
    maxRanks: 2,
    position: { x: 2, y: 2 },
    requires: 'dlord_t1_iron_grip',
  },
  {
    id: 'dlord_t2_demon_armor',
    name: 'Demon Armor',
    description: 'Gain +2 armor per rank while your demon is bound. Its power bleeds into you, fortifying your mortal frame.',
    icon: 'ability_warrior_endlessrage',
    maxRanks: 2,
    position: { x: 4, y: 2 },
    requires: 'dlord_t1_shared_will',
  },

  // Tier 3 - Deepening mastery
  {
    id: 'dlord_t3_dominant_wrath',
    name: 'Dominant Wrath',
    description: 'When your demon is at d8 DD or lower, it deals +2d8 damage. Desperation sharpens its fury — and your grip.',
    icon: 'spell_shadow_metamorphosis',
    maxRanks: 2,
    position: { x: 1, y: 3 },
    requires: 'dlord_t2_fel_presence',
  },
  {
    id: 'dlord_t3_soul_tether',
    name: 'Soul Tether',
    description: 'When your demon kills an enemy, restore 1 DD step. Each soul claimed reinforces the chain between you.',
    icon: 'spell_shadow_soulleech',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'dlord_t2_demon_armor',
  },

  // Tier 4 - Apex bond
  {
    id: 'dlord_t4_greater_binding',
    name: 'Greater Binding',
    description: 'Your demon\'s starting DD improves by 1 step (d6→d8, d8→d10). Can bind Tier 4 Greater Demons.',
    icon: 'spell_shadow_summoninfernal',
    maxRanks: 1,
    position: { x: 0, y: 3 },
    requires: 'dlord_t3_dominant_wrath',
  },
  {
    id: 'dlord_t4_infernal_surge',
    name: 'Infernal Surge',
    description: 'Once per combat: Your demon takes 3 actions in a single turn without DD degradation. The leash snaps tight.',
    icon: 'spell_fire_immolation',
    maxRanks: 1,
    position: { x: 4, y: 3 },
    requires: 'dlord_t3_soul_tether',
  },

  // Tier 5 - Ultimate
  {
    id: 'dlord_t5_throne_of_will',
    name: 'Throne of Will',
    description: 'Your demon cannot escape while you have more than 50% HP. At 0 DD, instead of escaping, it becomes stunned for 1 turn then resets to d6. You are its god.',
    icon: 'spell_fire_fire',
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: ['dlord_t4_greater_binding', 'dlord_t4_infernal_surge', 'dlord_t2_empowered_strikes'],
    requiresAll: true,
  },

  // Tier 6 - Ascension
  {
    id: 'dlord_t6_become_demon_lord',
    name: 'Become Demon Lord',
    description: 'Transform into a Demon Lord for 6 rounds. Gain +6 Str, +4 Con, immunity to fear, and your bound demon doubles all damage. When it ends, take 4d10 psychic damage.',
    icon: 'spell_shadow_demonform',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: 'dlord_t5_throne_of_will',
  }
];

// Possessed Specialization — Internal demon channeling with Internal DD
export const EXORCIST_POSSESSED = [
  // Tier 0 - Foundation
  {
    id: 'poss_t0_demonic_embrace',
    name: 'Demonic Embrace',
    description: 'Channel a demon within yourself. Your Internal DD starts at d10. Melee attacks deal +1d6 necrotic damage per rank but degrade your Internal DD by 1 step.',
    icon: 'spell_shadow_possession',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - Internal control
  {
    id: 'poss_t1_held_leash',
    name: 'Held Leash',
    description: 'Internal DD only degrades every 2 demon-ability uses instead of every use. Your iron will holds the beast at bay.',
    icon: 'spell_shadow_creepingplague',
    maxRanks: 2,
    position: { x: 3, y: 0 },
    requires: 'poss_t0_demonic_embrace',
  },
  {
    id: 'poss_t1_mutated_form',
    name: 'Mutated Form',
    description: 'Your body adapts to the demon within. +2 Strength per rank and resistance to necrotic damage.',
    icon: 'spell_shadow_auraofdarkness',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'poss_t0_demonic_embrace',
  },

  // Tier 2 - Power and recovery
  {
    id: 'poss_t2_demonic_regeneration',
    name: 'Demonic Regeneration',
    description: 'At the start of your turn, if Internal DD is d8 or higher, regenerate 1d8 HP per rank. The demon sustains its vessel.',
    icon: 'spell_shadow_lifedrain',
    maxRanks: 3,
    position: { x: 4, y: 1 },
    requires: 'poss_t1_held_leash',
  },
  {
    id: 'poss_t2_corruption_aura',
    name: 'Corruption Aura',
    description: 'Enemies within 10ft take 1d6 necrotic damage per rank at the start of their turn. The demon bleeds into the world around you.',
    icon: 'spell_shadow_contagion',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'poss_t1_mutated_form',
  },
  {
    id: 'poss_t2_tendril_strike',
    name: 'Tendril Strike',
    description: 'Attack with demonic tendrils (15ft reach) for weapon damage + 2d6 necrotic. Degrades Internal DD by 1 step.',
    icon: 'ability_rogue_disembowel',
    maxRanks: 2,
    position: { x: 2, y: 2 },
    requires: 'poss_t1_held_leash',
  },

  // Tier 3 - Deepening possession
  {
    id: 'poss_t3_inner_peace',
    name: 'Inner Peace',
    description: 'When your Internal DD reaches 0 and the demon takes over, you regain control after 1 turn instead of 2. Additionally, the demon\'s turn deals +2d6 damage to enemies (not allies) per rank.',
    icon: 'spell_shadow_mindrot',
    maxRanks: 2,
    position: { x: 3, y: 2 },
    requires: 'poss_t2_demonic_regeneration',
  },
  {
    id: 'poss_t3_demon_form',
    name: 'Demon Form',
    description: 'Activate as a bonus action: Enter demon form for 3 rounds. +2 armor, darkvision, immunity to poison. Internal DD degrades by 1 step per round while active.',
    icon: 'spell_shadow_demonform',
    maxRanks: 2,
    position: { x: 1, y: 3 },
    requires: 'poss_t2_corruption_aura',
  },

  // Tier 4 - Mastery of the internal
  {
    id: 'poss_t4_corruption_nova',
    name: 'Corruption Nova',
    description: 'Unleash the demon\'s fury in a 20ft burst. Deal 3d6 necrotic damage per rank. Resets Internal DD to d6 regardless of current level. The beast exhausts itself.',
    icon: 'spell_shadow_shadowfury',
    maxRanks: 2,
    position: { x: 4, y: 3 },
    requires: 'poss_t3_inner_peace',
  },
  {
    id: 'poss_t4_harmonious_duality',
    name: 'Harmonious Duality',
    description: 'When you restore your Internal DD, gain temporary HP equal to the die size × 2 (d10 = 20 temp HP). Control brings vitality.',
    icon: 'spell_shadow_antimagicshell',
    maxRanks: 1,
    position: { x: 2, y: 3 },
    requires: 'poss_t3_inner_peace',
  },
  {
    id: 'poss_t4_abyssal_armor',
    name: 'Abyssal Armor',
    description: 'Gain +3 armor and resistance to all damage while Internal DD is d8 or higher. The demon shields its prison.',
    icon: 'spell_shadow_nethercloak',
    maxRanks: 2,
    position: { x: 0, y: 4 },
    requires: 'poss_t3_demon_form',
  },

  // Tier 5 - Ultimate
  {
    id: 'poss_t5_demon_prince',
    name: 'Demon Prince',
    description: 'You no longer lose control when Internal DD reaches 0. Instead, enter Ascended Form for 3 rounds: +8 Str, +6 Con, attacks deal 4d10 necrotic. After Ascended Form ends, take 4d10 psychic damage and Internal DD resets to d6.',
    icon: 'spell_shadow_summonfelguard',
    maxRanks: 1,
    position: { x: 2, y: 5 },
    requires: ['poss_t4_corruption_nova', 'poss_t4_harmonious_duality', 'poss_t4_abyssal_armor'],
    requiresAll: true,
  }
];
