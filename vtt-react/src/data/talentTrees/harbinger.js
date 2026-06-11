export const HARBINGER_WILD_PROPHET = [
  {
    id: 'wp_t0_surge_attunement',
    name: 'Surge Attunement',
    description: 'Whenever a Wild Magic Surge triggers, gain +1 Mayhem per rank and deal 1d6 random damage to a random enemy within 30ft. Mayhem economy + Damage.',
    icon: 'spell_nature_mirrorimage',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    category: 'mayhem_economy'
  },

  {
    id: 'wp_t1_chain_reaction',
    name: 'Chain Reaction',
    description: 'When a Wild Magic Surge triggers, there is a 25% chance per rank it triggers again immediately. When a Prophesied area prophecy hits, 1 target per rank triggers a secondary 1d8 explosion affecting adjacent creatures. Spell modifier.',
    icon: 'spell_fire_fire',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'wp_t0_surge_attunement',
    category: 'spell_modifier'
  },
  {
    id: 'wp_t1_area_mastery',
    name: 'Area Mastery',
    description: 'All prophecy areas increase by 5ft radius per rank. Earn +1 Mayhem per target hit in area prophecies. Mayhem economy.',
    icon: 'spell_fire_selfdestruct',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'wp_t0_surge_attunement',
    category: 'mayhem_economy'
  },

  {
    id: 'wp_t2_unstable_aura',
    name: 'Unstable Aura',
    description: 'Enemies that hit you in melee must roll on the Wild Surge table (d6). On a 1, the attack is negated. On 6, the attacker takes 2d6 random damage per rank. Damage + Spell modifier.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 2,
    position: { x: 0, y: 2 },
    requires: 'wp_t1_chain_reaction',
    category: 'damage'
  },
  {
    id: 'wp_t2_multi_prophecy',
    name: 'Multi-Prophecy',
    description: 'You can have +1 simultaneous area prophecy active per rank (base 1, max 3 with 2 ranks). Spell modifier.',
    icon: 'spell_arcane_arcane01',
    maxRanks: 2,
    position: { x: 2, y: 2 },
    requires: 'wp_t1_chain_reaction',
    category: 'spell_modifier'
  },
  {
    id: 'wp_t2_overlapping_doom',
    name: 'Overlapping Doom',
    description: 'When two of your area prophecies overlap, the overlapping zone deals double damage per rank. Enemies within 25ft take 1d4 random damage per rank from wild energy. Damage.',
    icon: 'spell_fire_fireball',
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: 'wp_t1_area_mastery',
    category: 'damage'
  },

  {
    id: 'wp_t3_surging_power',
    name: 'Surging Power',
    description: 'Each Wild Magic Surge that triggers during combat gives you a stacking +1 to spell damage per rank (max 5 stacks). Resets on long rest. Damage.',
    icon: 'spell_nature_mirrorimage',
    maxRanks: 2,
    position: { x: 1, y: 3 },
    requires: 'wp_t2_unstable_aura',
    category: 'damage'
  },
  {
    id: 'wp_t3_cataclysm_table',
    name: 'Cataclysm Table',
    description: 'Spend 3 Mayhem to roll on an enhanced d8 table for area effects (fire/necrotic/psychic/force/stun/prone/slow/heal reversal). +1 table option per rank. Spell modifier.',
    icon: 'spell_fire_fireball02',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'wp_t2_multi_prophecy',
    category: 'spell_modifier'
  },
  {
    id: 'wp_t3_terrain_scorch',
    name: 'Terrain Scorch',
    description: 'Your area prophecies leave behind difficult terrain for 3 rounds per rank. Enemies in terrain take 1d4 fire damage per round. Spell modifier.',
    icon: 'spell_nature_corrosion',
    maxRanks: 2,
    position: { x: 4, y: 3 },
    requires: 'wp_t2_overlapping_doom',
    category: 'spell_modifier'
  },

  {
    id: 'wp_t4_mayhem_overload',
    name: 'Mayhem Overload',
    description: 'Whenever you reach 15+ Mayhem, all your spells gain the Wild Surge trigger (d20, nat 1 = surge) for free. Lose this effect when Mayhem drops below 10. Mayhem economy + Spell modifier.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 2,
    position: { x: 0, y: 4 },
    requires: 'wp_t3_surging_power',
    category: 'mayhem_economy'
  },
  {
    id: 'wp_t4_convergence',
    name: 'Convergence',
    description: 'When you detonate 2+ area prophecies in the same round, all resolution rolls gain +2 per rank. Spend 4 Mayhem to force a Wild Magic Surge on your next spell cast (guaranteed). Spell modifier.',
    icon: 'spell_holy_mindvision',
    maxRanks: 2,
    position: { x: 2, y: 4 },
    requires: 'wp_t3_cataclysm_table',
    category: 'spell_modifier'
  },
  {
    id: 'wp_t4_blast_amplification',
    name: 'Blast Amplification',
    description: 'Prophesied area effects deal +1d8 damage per 3 Mayhem you currently hold per rank. All wild magic table effects that deal damage gain +1d6 per rank. Damage.',
    icon: 'spell_shadow_shadowbolt',
    maxRanks: 2,
    position: { x: 4, y: 4 },
    requires: 'wp_t3_terrain_scorch',
    category: 'damage'
  },

  {
    id: 'wp_t5_wild_sovereignty',
    name: 'Wild Sovereignty',
    description: 'You are immune to the negative effects of your own Wild Magic Surges. Allies within 20ft take 50% less damage from your surges per rank. Area prophecy dice are upgraded: d6 to d8, d8 to d10, d10 to d12 per rank. Spell modifier.',
    icon: 'spell_nature_mirrorimage',
    maxRanks: 2,
    position: { x: 1, y: 5 },
    requires: 'wp_t4_mayhem_overload',
    category: 'spell_modifier'
  },
  {
    id: 'wp_t5_apex_surge',
    name: 'Apex Surge',
    description: 'When a Wild Magic Surge triggers, all enemies within 30ft take 2d8 random damage per rank and you gain +3 Mayhem. All area prophecy damage ignores 5 resistance per rank. Damage + Mayhem economy.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 2,
    position: { x: 3, y: 5 },
    requires: 'wp_t4_convergence',
    category: 'damage'
  },

  {
    id: 'wp_t6_cataclysm_incarnate',
    name: 'Cataclysm Incarnate',
    description: 'For 3 rounds: every spell you cast triggers a Wild Magic Surge automatically, all surge effects are doubled, all area prophecies auto-Prophesize, and you generate 2 Mayhem per surge. Costs all remaining Mayhem (minimum 10). Long rest cooldown.',
    icon: 'spell_shadow_curseofsargeras',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['wp_t5_wild_sovereignty', 'wp_t5_apex_surge'],
    requiresAll: true,
    category: 'damage'
  }
];

export const HARBINGER_DEATHS_SEER = [
  {
    id: 'ds_t0_decay_touch',
    name: 'Decay Touch',
    description: 'Attacks deal +1d6 necrotic damage per rank. Prophesied outcomes on single-target spells deal +50% damage per rank. Damage.',
    icon: 'spell_shadow_chilltouch',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    category: 'damage'
  },

  {
    id: 'ds_t1_decay_wave',
    name: 'Decay Wave',
    description: 'Your Entropy spells that reduce stats also reduce the target\'s maximum HP by the same amount for the duration. When a target affected by your prophecy is reduced to 0 HP, gain +2 Mayhem per rank. Spell modifier.',
    icon: 'spell_shadow_shadowwordpain',
    maxRanks: 2,
    position: { x: 1, y: 1 },
    requires: 'ds_t0_decay_touch',
    category: 'spell_modifier'
  },
  {
    id: 'ds_t1_death_precision',
    name: 'Death Precision',
    description: 'Your entropy damage ignores 10% armor per rank. When prophecy range has 2 or fewer values, gain +1 to resolution roll per rank. Spell modifier.',
    icon: 'ability_rogue_deadliness',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'ds_t0_decay_touch',
    category: 'spell_modifier'
  },

  {
    id: 'ds_t2_deep_rot',
    name: 'Deep Rot',
    description: 'Your entropy debuffs last +1 round per rank. When a debuff expires, deal 1d4 necrotic damage per rank to the target. When a prophecy deals Prophesied damage, the target takes 1d8 bonus necrotic per rank at the start of next turn. Spell modifier.',
    icon: 'spell_shadow_chilltouch',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'ds_t1_decay_wave',
    category: 'spell_modifier'
  },
  {
    id: 'ds_t2_entropy_shield',
    name: 'Entropy Shield',
    description: '+1 armor per rank. When hit in melee, attacker takes 1d4 necrotic damage per rank. You can sense targets below 30% HP per rank. Damage.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'ds_t1_decay_wave',
    category: 'damage'
  },
  {
    id: 'ds_t2_mark_of_doom',
    name: 'Mark of Doom',
    description: 'Spend 2 Mayhem to mark a target — your next prophecy against them auto-resolves as at least Base (no Outside). +1 use per rank. Whenever an enemy dies while affected by your entropy debuff, gain +2 Mayhem per rank. Spell modifier.',
    icon: 'spell_shadow_curseofsargeras',
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: 'ds_t1_death_precision',
    category: 'spell_modifier'
  },

  {
    id: 'ds_t3_decay_mastery',
    name: 'Decay Mastery',
    description: 'Your entropy debuffs now stack twice on the same target (double the stat reduction). Spend 2 Mayhem to spread a debuff from one target to an adjacent enemy. Prophecies against marked targets gain +2 to resolution roll per rank. Spell modifier.',
    icon: 'spell_shadow_chilltouch',
    maxRanks: 2,
    position: { x: 1, y: 3 },
    requires: 'ds_t2_deep_rot',
    category: 'spell_modifier'
  },
  {
    id: 'ds_t3_corruption',
    name: 'Corrupting Blows',
    description: 'Your entropy damage critically hits on 18-20. Crit damage bonus is +2d6 necrotic per rank instead of normal crit dice. You can have 2 Death Marks active simultaneously per rank. Damage.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 2,
    position: { x: 3, y: 3 },
    requires: 'ds_t2_mark_of_doom',
    category: 'damage'
  },

  {
    id: 'ds_t4_unmake',
    name: 'Unmake',
    description: 'When you reduce an enemy to 0 HP with an entropy spell, refund 3 Mayhem per rank and reduce your entropy spell cooldowns by 1. Targets affected by your prophecies cannot be healed above 50% HP per rank. Mayhem economy.',
    icon: 'spell_shadow_shadowwordpain',
    maxRanks: 2,
    position: { x: 0, y: 4 },
    requires: 'ds_t3_decay_mastery',
    category: 'mayhem_economy'
  },
  {
    id: 'ds_t4_entropy_convergence',
    name: 'Entropy Convergence',
    description: 'Entropy spells that hit 3+ targets deal +1d8 necrotic damage per rank to all targets hit. Havoc cost of single-target prophecy spells reduced by 2. Prophesied damage increased by your Spirit modifier per rank. Damage.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 3,
    position: { x: 2, y: 4 },
    requires: 'ds_t3_decay_mastery',
    category: 'damage'
  },
  {
    id: 'ds_t4_entropy_storm',
    name: 'Entropy Storm',
    description: 'Your entropy AoE spells leave a hazard zone (10ft radius, 1d6 necrotic/turn, 2 rounds) per rank. When you reduce a target to 0 HP with a Prophesied prophecy, refund the Mayhem cost. Spell modifier.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 2,
    position: { x: 4, y: 4 },
    requires: 'ds_t3_corruption',
    category: 'spell_modifier'
  },

  {
    id: 'ds_t5_eternal_decay',
    name: 'Eternal Decay',
    description: 'Creatures killed by your entropy effects rise as decaying undead (HP = your level x 3) for 3 rounds. Max 2 undead per rank. All single-target Prophesied effects deal maximum damage. Spell modifier.',
    icon: 'spell_shadow_chilltouch',
    maxRanks: 2,
    position: { x: 1, y: 5 },
    requires: 'ds_t4_unmake',
    category: 'spell_modifier'
  },
  {
    id: 'ds_t5_oblivion_embrace',
    name: 'Oblivion\'s Embrace',
    description: 'Immune to necrotic damage. +1d12 necrotic on all attacks. Whenever you take damage, gain +1 Mayhem per rank. Your narrow-range prophecies (d4+d4) deal additional damage equal to your level per rank. Damage + Mayhem economy.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 2,
    position: { x: 3, y: 5 },
    requires: 'ds_t4_entropy_storm',
    category: 'damage'
  },

  {
    id: 'ds_t6_death_incarnate',
    name: 'Death Incarnate',
    description: 'For 3 rounds: all entropy spells gain +3d8 necrotic damage, all stat reductions are doubled, all single-target Prophesied effects deal maximum damage, and you generate 2 Mayhem per enemy damaged. Costs all remaining Mayhem (minimum 10). Long rest cooldown.',
    icon: 'spell_shadow_curseofsargeras',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['ds_t5_eternal_decay', 'ds_t5_oblivion_embrace'],
    requiresAll: true,
    category: 'damage'
  }
];

export const HARBINGER_FATE_RIFT = [
  {
    id: 'fr_t0_chaos_dice',
    name: 'Chaos Dice',
    description: 'Gain chaos dice that enhance your magic. Roll 1d20 when casting chaos table spells: on 16+ per rank, gain a chaos die (max 3). Chaos dice add +1d6 to table spell damage. Spell modifier.',
    icon: 'spell_shadow_possession',
    maxRanks: 3,
    position: { x: 3, y: 0 },
    requires: null,
    category: 'spell_modifier'
  },
  {
    id: 'fr_t0_escalation',
    name: 'Escalation',
    description: 'Every round a delayed prophecy ticks, its damage increases by +1d6 per rank. When you spend Mayhem to adjust a table result, reduce the cost by 1 per rank (minimum cost 1). Mayhem economy + Damage.',
    icon: 'spell_fire_selfdestruct',
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
    category: 'mayhem_economy'
  },

  {
    id: 'fr_t1_wild_bolt',
    name: 'Wild Bolt',
    description: 'When your chaos table spell rolls a natural maximum on the table die, deal +2d6 damage per rank of a random type. Damage.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 3,
    position: { x: 0, y: 1 },
    requires: 'fr_t0_escalation',
    category: 'damage'
  },
  {
    id: 'fr_t1_dice_storm',
    name: 'Dice Storm',
    description: 'Your chaos table spells that hit an area gain +5ft radius per rank. Your chaos dice also increase area by 5ft each. Spell modifier.',
    icon: 'spell_shadow_possession',
    maxRanks: 2,
    position: { x: 2, y: 1 },
    requires: 'fr_t0_chaos_dice',
    category: 'spell_modifier'
  },
  {
    id: 'fr_t1_doom_aura',
    name: 'Doom Aura',
    description: 'Enemies within 15ft have -1 to all rolls per 3 Mayhem you hold (max -3) per rank. Your Mayhem maximum increases by 3 per rank. Spell modifier.',
    icon: 'spell_shadow_unstableaffliction',
    maxRanks: 3,
    position: { x: 4, y: 1 },
    requires: 'fr_t0_chaos_dice',
    category: 'spell_modifier'
  },

  {
    id: 'fr_t2_probability_shift',
    name: 'Probability Shift',
    description: 'Allies within 30ft roll twice and take higher on d20 saves against your chaos effects. Spend 3 Mayhem to force an enemy to roll twice and take lower on one save per rank. Spell modifier.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 2,
    position: { x: 1, y: 2 },
    requires: 'fr_t1_wild_bolt',
    category: 'spell_modifier'
  },
  {
    id: 'fr_t2_loaded_table',
    name: 'Loaded Table',
    description: 'Increase the minimum result on any chaos table by 1 per rank (e.g., d20 minimum becomes 3 at rank 2). Stacks with spec passive. Delayed prophecies generate +1 bonus Mayhem per round they remain active per rank. Spell modifier.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 2,
    position: { x: 3, y: 2 },
    requires: 'fr_t1_dice_storm',
    category: 'spell_modifier'
  },
  {
    id: 'fr_t2_consuming_doom',
    name: 'Consuming Doom',
    description: 'When a delayed prophecy detonates, all enemies within 10ft of the target take half the damage per rank. Every round of combat past round 1, gain +1 Mayhem per rank passively. Damage + Mayhem economy.',
    icon: 'spell_fire_fireball',
    maxRanks: 2,
    position: { x: 4, y: 2 },
    requires: 'fr_t1_doom_aura',
    category: 'damage'
  },

  {
    id: 'fr_t3_critical_chaos',
    name: 'Critical Chaos',
    description: 'When a chaos table spell rolls a natural 1 on the table die (worst result), gain 1d4 Mayhem per rank and your next chaos spell costs no mana. When you have 10+ Mayhem, all prophecy resolution rolls gain +2 per rank. Mayhem economy.',
    icon: 'spell_shadow_possession',
    maxRanks: 3,
    position: { x: 0, y: 3 },
    requires: 'fr_t2_probability_shift',
    category: 'mayhem_economy'
  },
  {
    id: 'fr_t3_accumulated_power',
    name: 'Accumulated Power',
    description: 'Detonation of delayed prophecies deals +2d8 damage per round the prophecy was active per rank. Your chaos table spells that deal AoE damage gain +1 target affected per rank. Damage.',
    icon: 'spell_shadow_shadowbolt',
    maxRanks: 2,
    position: { x: 2, y: 3 },
    requires: 'fr_t2_loaded_table',
    category: 'damage'
  },
  {
    id: 'fr_t3_aura_expansion',
    name: 'Aura Expansion',
    description: 'Spend 3 Mayhem to expand doom aura to 30ft and increase penalty by -1 per rank. Lasts 3 rounds. +1 armor per chaos die you hold. When attacked, spend 2 Mayhem per rank to force the attacker to reroll the attack. Spell modifier.',
    icon: 'spell_shadow_ward',
    maxRanks: 2,
    position: { x: 4, y: 3 },
    requires: 'fr_t2_consuming_doom',
    category: 'spell_modifier'
  },

  {
    id: 'fr_t4_fate_weaver',
    name: 'Fate Weaver',
    description: 'Once per combat, dictate the exact result of one chaos table roll (no Mayhem cost). After round 5 of combat, all your prophecies auto-Prophesize on the first resolution roll per round. Spell modifier.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 1,
    position: { x: 1, y: 4 },
    requires: 'fr_t3_critical_chaos',
    category: 'spell_modifier'
  },
  {
    id: 'fr_t4_double_down',
    name: 'Double Down',
    description: 'When you spend 5+ Mayhem on a single table adjustment, gain a free chaos die and deal +1d8 random damage per rank. Your delayed prophecies cannot be dispelled or removed early. Damage + Spell modifier.',
    icon: 'spell_shadow_possession',
    maxRanks: 2,
    position: { x: 3, y: 4 },
    requires: 'fr_t3_accumulated_power',
    category: 'damage'
  },

  {
    id: 'fr_t5_dice_god',
    name: 'Dice God',
    description: 'Your Mayhem Modifier cap increases by +5 per rank. Whenever you reach your cap, your next chaos spell auto-hits and cannot be saved against. Doom aura is always active (no concentration). Mayhem economy.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 2,
    position: { x: 0, y: 5 },
    requires: 'fr_t4_fate_weaver',
    category: 'mayhem_economy'
  },
  {
    id: 'fr_t5_overwhelming_doom',
    name: 'Overwhelming Doom',
    description: 'All chaos table spells deal +1d10 random damage per rank. Rolling on a d100 table costs 2 less Mayhem to adjust per rank. Doom aura penalty cap increases to -8. Enemies at -5 or worse are also frightened. Damage.',
    icon: 'spell_shadow_antishadow',
    maxRanks: 2,
    position: { x: 4, y: 5 },
    requires: 'fr_t4_double_down',
    category: 'damage'
  },

  {
    id: 'fr_t6_fate_deity',
    name: 'Fate Deity',
    description: 'For 3 rounds: all chaos table results automatically shift up by 2 tiers, you gain unlimited Mayhem spending (no cap per roll), all delayed prophecies deal double damage on detonation, and chaos spells cost 50% less mana. Costs all remaining Mayhem (minimum 10). Long rest cooldown.',
    icon: 'spell_shadow_curseofsargeras',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['fr_t5_dice_god', 'fr_t5_overwhelming_doom'],
    requiresAll: true,
    category: 'damage'
  }
];
