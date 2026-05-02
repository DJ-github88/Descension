// ============================================
// CHAOS WEAVER TALENT TREES
// ============================================

export const CHAOS_WEAVER_REALITY_BENDING = [
  // Tier 0 - Foundation
  {
    id: 'reality_t0_chaos_seed',
    name: 'Chaos Seed',
    description: 'Generate +1 Mayhem per rank whenever you cast a Reality Bending spell. Mayhem economy.',
    icon: 'spell_arcane_polymorphchicken',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    category: 'mayhem_economy'
  },

  // Tier 1 - Branch
  {
    id: 'reality_t1_chaotic_door',
    name: 'Chaotic Door',
    description: 'Unlocks Chaotic Door — teleport to a random location within 60ft. Spend 2 Mayhem to choose the destination. Spell modifier.',
    icon: 'spell_arcane_blink',
    maxRanks: 1,
    position: { x: 1, y: 1 },
    requires: 'reality_t0_chaos_seed',
    category: 'spell_modifier'
  },
  {
    id: 'reality_t1_dimensional_burst',
    name: 'Dimensional Burst',
    description: 'Your teleport spells deal 1d6 force damage per rank to creatures at the departure point. Damage.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'reality_t0_chaos_seed',
    category: 'damage'
  },

  // Tier 2
  {
    id: 'reality_t2_zone_warp',
    name: 'Zone Warp',
    description: 'Your area spells increase in radius by 5ft per rank. Spell modifier.',
    icon: 'spell_nature_mirrorimage',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'reality_t1_chaotic_door',
    category: 'spell_modifier'
  },
  {
    id: 'reality_t2_rift_anchor',
    name: 'Rift Anchor',
    description: 'When you cast a teleport or forced movement spell, gain +2 Mayhem per rank. Mayhem economy.',
    icon: 'spell_shadow_shadowwordpain',
    maxRanks: 2,
    position: { x: 4, y: 2 },
    requires: 'reality_t1_dimensional_burst',
    category: 'mayhem_economy'
  },

  // Tier 3
  {
    id: 'reality_t3_chaos_clone',
    name: 'Mirror of Chaos',
    description: 'After casting Reality Flicker, create an illusory duplicate that draws one attack before shattering. 1 duplicate per rank per combat. Spell modifier.',
    icon: 'spell_nature_mirrorimage',
    maxRanks: 2,
    position: { x: 1, y: 3 },
    requires: 'reality_t2_zone_warp',
    category: 'spell_modifier'
  },
  {
    id: 'reality_t3_chaos_siphon',
    name: 'Chaos Siphon',
    description: 'Whenever an enemy fails a save against your Reality Bending spells, steal 1 Mayhem per rank. Mayhem economy.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'reality_t2_rift_anchor',
    category: 'mayhem_economy'
  },

  // Tier 4
  {
    id: 'reality_t4_chaos_nexus',
    name: 'Chaos Nexus',
    description: 'Allies within 20ft of you gain +1 to saves against chaos effects per rank. Spend 3 Mayhem to redirect a chaos spell\'s area by 10ft. Spell modifier.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 2,
    position: { x: 2, y: 4 },
    requires: 'reality_t3_chaos_clone',
    category: 'spell_modifier'
  },

  // Tier 5
  {
    id: 'reality_t5_spacial_dominance',
    name: 'Spacial Dominance',
    description: 'Your teleport and position spells ignore line of sight. You can teleport through walls. +1d8 force damage per rank on all teleport effects. Damage + Spell modifier.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 3,
    position: { x: 0, y: 5 },
    requires: 'reality_t4_chaos_nexus',
    category: 'damage'
  },
  {
    id: 'reality_t5_reality_devourer',
    name: 'Reality Devourer',
    description: 'Whenever you spend 5+ Mayhem on a Reality Bending spell, the spell\'s duration doubles. Mayhem economy.',
    icon: 'spell_shadow_shadowwordpain',
    maxRanks: 2,
    position: { x: 4, y: 5 },
    requires: 'reality_t4_chaos_nexus',
    category: 'mayhem_economy'
  },

  // Tier 6 - Capstone
  {
    id: 'reality_t6_chaos_god',
    name: 'Chaos Incarnate',
    description: 'For 3 rounds: +4 spell damage, all Reality Bending spells auto-max one die, immune to forced movement and teleportation. Costs all remaining Mayhem (minimum 10). Long rest cooldown.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['reality_t5_spacial_dominance', 'reality_t5_reality_devourer'],
    requiresAll: true,
    category: 'damage'
  }
];

// Chaos Weaver Specialization - Entropy and decay manipulation
export const CHAOS_WEAVER_ENTROPY_CONTROL = [
  // Tier 0 - Foundation
  {
    id: 'entropy_t0_decay_touch',
    name: 'Decay Touch',
    description: 'Attacks deal +1d6 necrotic damage per rank. Your entropy damage ignores 10% armor per rank. Damage.',
    icon: 'spell_shadow_chilltouch',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    category: 'damage'
  },

  // Tier 1
  {
    id: 'entropy_t1_decay_wave',
    name: 'Decay Wave',
    description: 'Your Entropy spells that reduce stats also reduce the target\'s maximum HP by the same amount for the duration. Spell modifier.',
    icon: 'spell_shadow_shadowwordpain',
    maxRanks: 2,
    position: { x: 1, y: 1 },
    requires: 'entropy_t0_decay_touch',
    category: 'spell_modifier'
  },
  {
    id: 'entropy_t1_entropy_burst',
    name: 'Entropy Burst',
    description: 'Whenever an enemy dies while affected by your entropy debuff, gain +2 Mayhem per rank. Mayhem economy.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'entropy_t0_decay_touch',
    category: 'mayhem_economy'
  },

  // Tier 2
  {
    id: 'entropy_t2_decomposition',
    name: 'Deep Rot',
    description: 'Your entropy debuffs last +1 round per rank. When a debuff expires, deal 1d4 necrotic damage per rank to the target. Spell modifier.',
    icon: 'spell_shadow_chilltouch',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'entropy_t1_decay_wave',
    category: 'spell_modifier'
  },
  {
    id: 'entropy_t2_entropy_shield',
    name: 'Entropy Shield',
    description: '+1 armor per rank. When hit in melee, attacker takes 1d4 necrotic damage per rank. Damage.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'entropy_t1_decay_wave',
    category: 'damage'
  },
  {
    id: 'entropy_t2_decay_aura',
    name: 'Decay Aura',
    description: 'At the start of your turn, gain +1 Mayhem per rank for each enemy within 25ft affected by your entropy debuffs. Mayhem economy.',
    icon: 'spell_shadow_shadowwordpain',
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: 'entropy_t1_entropy_burst',
    category: 'mayhem_economy'
  },

  // Tier 3
  {
    id: 'entropy_t3_decay_mastery',
    name: 'Decay Mastery',
    description: 'Your entropy debuffs now stack twice on the same target (double the stat reduction). Spend 2 Mayhem to spread a debuff from one target to an adjacent enemy. Spell modifier.',
    icon: 'spell_shadow_chilltouch',
    maxRanks: 2,
    position: { x: 1, y: 3 },
    requires: 'entropy_t2_entropy_shield',
    category: 'spell_modifier'
  },
  {
    id: 'entropy_t3_corruption',
    name: 'Corrupting Blows',
    description: 'Your entropy damage critically hits on 18-20. Crit damage bonus is +2d6 necrotic per rank instead of normal crit dice. Damage.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 2,
    position: { x: 3, y: 3 },
    requires: 'entropy_t2_decay_aura',
    category: 'damage'
  },

  // Tier 4
  {
    id: 'entropy_t4_unmake',
    name: 'Unmake',
    description: 'When you reduce an enemy to 0 HP with an entropy spell, refund 3 Mayhem per rank and reduce your entropy spell cooldowns by 1. Mayhem economy.',
    icon: 'spell_shadow_shadowwordpain',
    maxRanks: 2,
    position: { x: 0, y: 4 },
    requires: 'entropy_t3_decay_mastery',
    category: 'mayhem_economy'
  },
  {
    id: 'entropy_t4_chaos_decay',
    name: 'Entropy Convergence',
    description: 'Entropy spells that hit 3+ targets deal +1d8 necrotic damage per rank to all targets hit. Damage.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 3,
    position: { x: 2, y: 4 },
    requires: 'entropy_t3_decay_mastery',
    category: 'damage'
  },
  {
    id: 'entropy_t4_entropy_storm',
    name: 'Entropy Storm',
    description: 'Your entropy AoE spells leave a hazard zone (10ft radius, 1d6 necrotic/turn, 2 rounds) per rank. Spell modifier.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 2,
    position: { x: 4, y: 4 },
    requires: 'entropy_t3_corruption',
    category: 'spell_modifier'
  },

  // Tier 5
  {
    id: 'entropy_t5_eternal_decay',
    name: 'Eternal Decay',
    description: 'Creatures killed by your entropy effects rise as decaying undead (HP = your level x 3) for 3 rounds. Max 2 undead per rank. Spell modifier.',
    icon: 'spell_shadow_chilltouch',
    maxRanks: 2,
    position: { x: 1, y: 5 },
    requires: 'entropy_t4_unmake',
    category: 'spell_modifier'
  },
  {
    id: 'entropy_t5_oblivion_embrace',
    name: 'Oblivion\'s Embrace',
    description: 'Immune to necrotic damage. +1d12 necrotic on all attacks. Whenever you take damage, gain +1 Mayhem per rank. Mayhem economy + Damage.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 2,
    position: { x: 3, y: 5 },
    requires: 'entropy_t4_entropy_storm',
    category: 'damage'
  },

  // Tier 6 - Capstone
  {
    id: 'entropy_t6_decay_god',
    name: 'Decay Incarnate',
    description: 'For 3 rounds: all your entropy spells gain +3d8 necrotic damage, all stat reductions are doubled, and you generate 2 Mayhem per enemy damaged. Costs all remaining Mayhem (minimum 10). Long rest cooldown.',
    icon: 'spell_shadow_shadowwordpain',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['entropy_t5_eternal_decay', 'entropy_t5_oblivion_embrace'],
    requiresAll: true,
    category: 'damage'
  }
];

// Chaos Weaver Specialization - Chaos dice and table manipulation
export const CHAOS_WEAVER_CHAOS_DICE = [
  // Tier 0 - Foundation (two starting nodes)
  {
    id: 'dice_t0_chaos_dice',
    name: 'Chaos Dice',
    description: 'Gain chaos dice that enhance your magic. Roll 1d20 when casting chaos table spells: on 16+ per rank, gain a chaos die (max 3). Chaos dice add +1d6 to table spell damage. Spell modifier.',
    icon: 'spell_shadow_possession',
    maxRanks: 3,
    position: { x: 3, y: 0 },
    requires: null,
    category: 'spell_modifier'
  },
  {
    id: 'dice_t0_random_magic',
    name: 'Random Magic',
    description: 'When you spend Mayhem to adjust a table result, reduce the cost by 1 per rank (minimum cost 1). Mayhem economy.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    category: 'mayhem_economy'
  },

  // Tier 1
  {
    id: 'dice_t1_wild_bolt',
    name: 'Wild Bolt',
    description: 'When your chaos table spell rolls a natural maximum on the table die, deal +2d6 damage per rank of a random type. Damage.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 3,
    position: { x: 0, y: 1 },
    requires: 'dice_t0_random_magic',
    category: 'damage'
  },
  {
    id: 'dice_t1_dice_storm',
    name: 'Dice Storm',
    description: 'Your chaos table spells that hit an area gain +5ft radius per rank. Your chaos dice also increase area by 5ft each. Spell modifier.',
    icon: 'spell_shadow_possession',
    maxRanks: 2,
    position: { x: 4, y: 1 },
    requires: 'dice_t0_chaos_dice',
    category: 'spell_modifier'
  },

  // Tier 2
  {
    id: 'dice_t2_probability_shift',
    name: 'Probability Shift',
    description: 'Allies within 30ft roll twice and take higher on d20 saves against your chaos effects. Spend 3 Mayhem to force an enemy to roll twice and take lower on one save per rank. Spell modifier.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 2,
    position: { x: 2, y: 2 },
    requires: 'dice_t1_wild_bolt',
    category: 'spell_modifier'
  },
  {
    id: 'dice_t2_chaos_shield',
    name: 'Chaos Shield',
    description: '+1 armor per chaos die you hold. When attacked, spend 2 Mayhem per rank to force the attacker to reroll the attack. Mayhem economy.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 2,
    position: { x: 1, y: 3 },
    requires: 'dice_t1_dice_storm',
    category: 'mayhem_economy'
  },
  {
    id: 'dice_t2_loaded_table',
    name: 'Loaded Table',
    description: 'Increase the minimum result on any chaos table by 1 per rank (e.g., d20 minimum becomes 3 at rank 2). Stacks with spec passive. Spell modifier.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 2,
    position: { x: 3, y: 3 },
    requires: 'dice_t1_wild_bolt',
    category: 'spell_modifier'
  },

  // Tier 3
  {
    id: 'dice_t3_critical_chaos',
    name: 'Critical Chaos',
    description: 'When a chaos table spell rolls a natural 1 on the table die (worst result), gain 1d4 Mayhem per rank and your next chaos spell costs no mana. Mayhem economy.',
    icon: 'spell_shadow_possession',
    maxRanks: 3,
    position: { x: 0, y: 4 },
    requires: 'dice_t2_probability_shift',
    category: 'mayhem_economy'
  },
  {
    id: 'dice_t3_chaos_nova',
    name: 'Chaos Nova',
    description: 'Your chaos table spells that deal AoE damage gain +1 target affected per rank. Damage.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 2,
    position: { x: 4, y: 4 },
    requires: 'dice_t2_loaded_table',
    category: 'damage'
  },

  // Tier 4
  {
    id: 'dice_t4_fate_weaver',
    name: 'Fate Weaver',
    description: 'Once per combat, dictate the exact result of one chaos table roll (no Mayhem cost). Spell modifier.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 1,
    position: { x: 2, y: 5 },
    requires: 'dice_t2_chaos_shield',
    category: 'spell_modifier'
  },
  {
    id: 'dice_t4_double_down',
    name: 'Double Down',
    description: 'When you spend 5+ Mayhem on a single table adjustment, gain a free chaos die and deal +1d8 random damage per rank. Damage + Mayhem economy.',
    icon: 'spell_shadow_possession',
    maxRanks: 2,
    position: { x: 1, y: 6 },
    requires: 'dice_t3_critical_chaos',
    category: 'damage'
  },
  {
    id: 'dice_t4_random_power',
    name: 'Random Power',
    description: 'Rolling a natural maximum on any chaos table generates +2 Mayhem per rank and your next table spell has advantage (roll twice, pick better). Mayhem economy + Spell modifier.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 2,
    position: { x: 3, y: 6 },
    requires: 'dice_t3_chaos_nova',
    category: 'mayhem_economy'
  },

  // Tier 5
  {
    id: 'dice_t5_dice_god',
    name: 'Dice God',
    description: 'Your Mayhem Modifier cap increases by +5 per rank. Whenever you reach your cap, your next chaos spell auto-hits and can\'t be saved against. Mayhem economy.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 2,
    position: { x: 0, y: 5 },
    requires: 'dice_t4_fate_weaver',
    category: 'mayhem_economy'
  },
  {
    id: 'dice_t5_ultimate_chaos',
    name: 'Ultimate Chaos',
    description: 'All chaos table spells deal +1d10 random damage per rank. Rolling on a d100 table costs 2 less Mayhem to adjust per rank. Damage.',
    icon: 'spell_shadow_possession',
    maxRanks: 2,
    position: { x: 4, y: 5 },
    requires: 'dice_t4_random_power',
    category: 'damage'
  },

  // Tier 6 - Capstone
  {
    id: 'dice_t6_chaos_deity',
    name: 'Chaos Deity',
    description: 'For 3 rounds: all chaos table results automatically shift up by 2 tiers, you gain unlimited Mayhem spending (no cap per roll), and chaos spells cost 50% less mana. Costs all remaining Mayhem (minimum 10). Long rest cooldown.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['dice_t5_dice_god', 'dice_t5_ultimate_chaos'],
    requiresAll: true,
    category: 'damage'
  }
];

// Chaos Weaver Specialization - Wild Magic surges and chain reactions
export const CHAOS_WEAVER_WILD_MAGIC = [
  // Tier 0 - Foundation
  {
    id: 'wild_t0_surge_attunement',
    name: 'Surge Attunement',
    description: 'Whenever a Wild Magic Surge triggers (from your spec passive or spells), gain +1 Mayhem per rank and deal 1d6 random damage to a random enemy within 30ft. Mayhem economy + Damage.',
    icon: 'spell_nature_mirrorimage',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    category: 'mayhem_economy'
  },

  // Tier 1
  {
    id: 'wild_t1_chain_reaction',
    name: 'Chain Reaction',
    description: 'When a Wild Magic Surge triggers, there is a 25% chance per rank it triggers again immediately. These chain triggers also generate Mayhem. Spell modifier.',
    icon: 'spell_fire_fire',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'wild_t0_surge_attunement',
    category: 'spell_modifier'
  },
  {
    id: 'wild_t1_mana_leak',
    name: 'Mana Leak',
    description: 'Whenever a Wild Magic Surge triggers, refund 2 mana per rank. At rank 3, surges also restore 1 action point. Mayhem economy.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'wild_t0_surge_attunement',
    category: 'mayhem_economy'
  },

  // Tier 2
  {
    id: 'wild_t2_unstable_aura',
    name: 'Unstable Aura',
    description: 'Enemies that hit you in melee must roll on the Wild Surge table (d6). On a 1, the attack is negated. On 6, the attacker takes 2d6 random damage per rank. Damage + Spell modifier.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 2,
    position: { x: 0, y: 2 },
    requires: 'wild_t1_chain_reaction',
    category: 'damage'
  },
  {
    id: 'wild_t2_chaos_magnet',
    name: 'Chaos Magnet',
    description: 'Your Wild Magic Surge chance from the spec passive increases by +5% per rank (base: nat 1 on d20). At rank 4, nat 1-2 trigger surges. Spell modifier.',
    icon: 'spell_shadow_possession',
    maxRanks: 4,
    position: { x: 2, y: 2 },
    requires: 'wild_t1_chain_reaction',
    category: 'spell_modifier'
  },
  {
    id: 'wild_t2_wild_fury',
    name: 'Wild Fury',
    description: 'Whenever a surge triggers, your next spell deals +1d8 random damage per rank. Damage.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: 'wild_t1_mana_leak',
    category: 'damage'
  },

  // Tier 3
  {
    id: 'wild_t3_surging_power',
    name: 'Surging Power',
    description: 'Each Wild Magic Surge that triggers during combat gives you a stacking +1 to spell damage per rank (max 5 stacks). Resets on long rest. Damage.',
    icon: 'spell_nature_mirrorimage',
    maxRanks: 2,
    position: { x: 1, y: 3 },
    requires: 'wild_t2_unstable_aura',
    category: 'damage'
  },
  {
    id: 'wild_t3_chaos_amplifier',
    name: 'Chaos Amplifier',
    description: 'Spend 4 Mayhem to force a Wild Magic Surge on your next spell cast (guaranteed). Surge effects from this talent are 50% stronger per rank. Spell modifier.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 2,
    position: { x: 3, y: 3 },
    requires: 'wild_t2_wild_fury',
    category: 'spell_modifier'
  },

  // Tier 4
  {
    id: 'wild_t4_mayhem_overload',
    name: 'Mayhem Overload',
    description: 'Whenever you reach 15+ Mayhem, all your spells gain the Wild Surge trigger (d20, nat 1 = surge) for free. Lose this effect when Mayhem drops below 10. Mayhem economy + Spell modifier.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 2,
    position: { x: 2, y: 4 },
    requires: 'wild_t3_surging_power',
    category: 'mayhem_economy'
  },
  {
    id: 'wild_t4_cascade_master',
    name: 'Cascade Master',
    description: 'Your Chaos Cascade spell now rolls 3 times instead of 2. All wild magic table effects that deal damage gain +1d6 per rank. Damage + Spell modifier.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 2,
    position: { x: 0, y: 4 },
    requires: 'wild_t3_surging_power',
    category: 'damage'
  },
  {
    id: 'wild_t4_safe_haven',
    name: 'Safe Haven',
    description: 'Once per combat, when a Wild Magic Surge would harm you or an ally, spend 5 Mayhem to redirect the effect to a random enemy instead. Spell modifier.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 1,
    position: { x: 4, y: 4 },
    requires: 'wild_t3_chaos_amplifier',
    category: 'spell_modifier'
  },

  // Tier 5
  {
    id: 'wild_t5_wild_sovereignty',
    name: 'Wild Sovereignty',
    description: 'You are immune to the negative effects of your own Wild Magic Surges. Allies within 20ft take 50% less damage from your surges per rank. Spell modifier.',
    icon: 'spell_nature_mirrorimage',
    maxRanks: 2,
    position: { x: 1, y: 5 },
    requires: 'wild_t4_mayhem_overload',
    category: 'spell_modifier'
  },
  {
    id: 'wild_t5_apex_surge',
    name: 'Apex Surge',
    description: 'When a Wild Magic Surge triggers, all enemies within 30ft take 2d8 random damage per rank and you gain +3 Mayhem. Damage + Mayhem economy.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 2,
    position: { x: 3, y: 5 },
    requires: 'wild_t4_cascade_master',
    category: 'damage'
  },

  // Tier 6 - Capstone
  {
    id: 'wild_t6_wild_god',
    name: 'Wild Incarnate',
    description: 'For 3 rounds: every spell you cast triggers a Wild Magic Surge automatically, all surge effects are doubled, and you generate 2 Mayhem per surge. Costs all remaining Mayhem (minimum 10). Long rest cooldown.',
    icon: 'spell_nature_mirrorimage',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['wild_t5_wild_sovereignty', 'wild_t5_apex_surge'],
    requiresAll: true,
    category: 'damage'
  }
];
