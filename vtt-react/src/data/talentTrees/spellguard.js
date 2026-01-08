// ============================================
// SPELLGUARD TALENT TREES
// ============================================

export const SPELLGUARD_ARCANE_WARDEN = [
  // Tier 0 - Foundation (Central Core)
  {
    id: 'warden_t0_arcane_absorption',
    name: 'Arcane Absorption',
    description: 'Passively absorb magical damage. Gain 2 AEP for every point of fire, cold, lightning, or necrotic damage taken. Gain 1 AEP for every 2 points of physical damage taken.',
    icon: 'spell_arcane_prismaticcloak',
    maxRanks: 1,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - Core Enhancement (Central Expansion)
  {
    id: 'warden_t1_enhanced_shielding',
    name: 'Enhanced Shielding',
    description: 'Your Arcane Shield absorbs +20 damage per rank and lasts +1 minute per rank.',
    icon: 'spell_holy_powerwordshield',
    maxRanks: 3,
    position: { x: 2, y: 1 },
    requires: 'warden_t0_arcane_absorption',
  },
  {
    id: 'warden_t1_wardens_fortitude',
    name: 'Warden\'s Fortitude',
    description: 'While you have an active shield, gain +1 armor per rank and +5% resistance to all damage per rank.',
    icon: 'spell_holy_devotionaura',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'warden_t0_arcane_absorption',
  },
  {
    id: 'warden_t1_absorption_mastery',
    name: 'Absorption Mastery',
    description: 'Gain +1 AEP per rank from all magical damage absorbed.',
    icon: 'spell_arcane_blast',
    maxRanks: 2,
    position: { x: 3, y: 1 },
    requires: 'warden_t0_arcane_absorption',
  },

  // Tier 2 - Ally Protection (Left Branch - Protection)
  {
    id: 'warden_t2_barrier_of_protection',
    name: 'Barrier of Protection',
    description: 'Barrier of Protection costs -5 AEP per rank and affects +1 additional ally per rank.',
    icon: 'spell_holy_prayerofhealing',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'warden_t1_wardens_fortitude',
  },
  {
    id: 'warden_t2_mass_shielding',
    name: 'Mass Shielding',
    description: 'All shield abilities absorb +15 damage per rank and last +30 seconds per rank.',
    icon: 'spell_holy_divineshield',
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: 'warden_t1_wardens_fortitude',
  },
  {
    id: 'warden_t2_arcane_overflow',
    name: 'Arcane Overflow',
    description: 'When your shields absorb damage, gain +1 AEP per 3 damage absorbed per rank.',
    icon: 'spell_arcane_starfire',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'warden_t1_enhanced_shielding',
  },

  // Tier 3 - Advanced Absorption (Right Branch - Absorption)
  {
    id: 'warden_t3_elemental_resistance',
    name: 'Elemental Resistance',
    description: 'Elemental Resistance grants +1 resistance per rank to chosen element and lasts +1 minute per rank.',
    icon: 'spell_nature_resistnature',
    maxRanks: 2,
    position: { x: 3, y: 2 },
    requires: 'warden_t1_absorption_mastery',
  },
  {
    id: 'warden_t3_energy_conversion',
    name: 'Energy Conversion',
    description: 'Convert 1 additional AEP per rank from physical damage.',
    icon: 'spell_shadow_manafeed',
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: 'warden_t1_absorption_mastery',
  },

  // Tier 4 - Ultimate Defense (Convergence)
  {
    id: 'warden_t4_fortress_mode',
    name: 'Fortress Mode',
    description: 'Activate Fortress Mode: All active shields absorb double damage and you gain immunity to magical damage for 1 turn. Costs 25 AEP.',
    icon: 'spell_holy_divineprotection',
    maxRanks: 1,
    position: { x: 1, y: 3 },
    requires: 'warden_t2_mass_shielding',
  },
  {
    id: 'warden_t4_wardens_sacrifice',
    name: 'Warden\'s Sacrifice',
    description: 'Spend 20 AEP to redirect all damage from a single ally to you for 1 minute.',
    icon: 'spell_holy_sealofsacrifice',
    maxRanks: 1,
    position: { x: 2, y: 3 },
    requires: 'warden_t2_arcane_overflow',
  },
  {
    id: 'warden_t4_anti_magic_zone',
    name: 'Anti-Magic Zone',
    description: 'Create a 15ft anti-magic zone for 1 minute. Spells cast in the zone cost +3 mana per rank. Costs 20 AEP.',
    icon: 'spell_shadow_antimagicshell',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'warden_t3_elemental_resistance',
  },

  // Tier 5 - Peak of Protection
  {
    id: 'warden_t5_ultimate_ward',
    name: 'Ultimate Ward',
    description: 'Create an Ultimate Ward that absorbs 50 damage and prevents all magical effects. Costs 30 AEP, lasts 1 minute.',
    icon: 'spell_holy_holyprotection',
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: 'warden_t4_wardens_sacrifice',
  }
];

// Spell Breaker - Mirror Layout (Disruption, Symmetrical Reflection)
export const SPELLGUARD_SPELL_BREAKER = [
  // Tier 0 - Foundation (Dual Core)
  {
    id: 'breaker_t0_spell_reflection',
    name: 'Spell Reflection',
    description: 'Passively absorb magical damage. Gain 2 AEP for every point of fire, cold, lightning, or necrotic damage taken. Gain 1 AEP for every 2 points of physical damage taken.',
    icon: 'spell_arcane_prismaticcloak',
    maxRanks: 1,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - Reflection Mastery (Central and Symmetric Expansion)
  {
    id: 'breaker_t1_reflective_barrier',
    name: 'Reflective Barrier',
    description: 'Reflective Barrier costs -5 AEP per rank and reflects +25% damage per rank.',
    icon: 'spell_holy_dispelmagic',
    maxRanks: 3,
    position: { x: 2, y: 1 },
    requires: 'breaker_t0_spell_reflection',
  },
  {
    id: 'breaker_t1_spell_disruption',
    name: 'Spell Disruption',
    description: 'Spell Disruption costs -5 AEP per rank and has +10% success chance per rank.',
    icon: 'spell_shadow_curseofachimonde',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'breaker_t0_spell_reflection',
  },
  {
    id: 'breaker_t1_counter_magic',
    name: 'Counter Magic',
    description: 'When you successfully reflect a spell, gain +2 AEP per rank.',
    icon: 'spell_arcane_blink',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'breaker_t0_spell_reflection',
  },

  // Tier 2 - Mirror Effects (Symmetric Branching)
  {
    id: 'breaker_t2_mirror_shield',
    name: 'Mirror Shield',
    description: 'Create a mirror shield that reflects the next 2 spells per rank cast at you.',
    icon: 'spell_holy_powerwordshield',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'breaker_t1_spell_disruption',
  },
  {
    id: 'breaker_t2_reflection_chain',
    name: 'Reflection Chain',
    description: 'When you reflect a spell, the next reflection costs -10 AEP per rank.',
    icon: 'spell_arcane_portalironforge',
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: 'breaker_t1_spell_disruption',
  },
  {
    id: 'breaker_t2_echo_damage',
    name: 'Echo Damage',
    description: 'Reflected spells deal +1d6 arcane damage per rank to the caster.',
    icon: 'spell_arcane_arcane03',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'breaker_t1_reflective_barrier',
  },
  {
    id: 'breaker_t2_mana_burn',
    name: 'Mana Burn',
    description: 'Reflected spells burn 1d4 mana per rank from the caster.',
    icon: 'spell_fire_soulburn',
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: 'breaker_t1_counter_magic',
  },
  {
    id: 'breaker_t2_spell_echo',
    name: 'Spell Echo',
    description: 'After reflecting a spell, you can cast the same spell once per rank this turn.',
    icon: 'spell_arcane_portaldarnassus',
    maxRanks: 2,
    position: { x: 4, y: 2 },
    requires: 'breaker_t1_counter_magic',
  },

  // Tier 3 - Advanced Disruption (Mirror Convergence)
  {
    id: 'breaker_t3_perfect_reflection',
    name: 'Perfect Reflection',
    description: 'Reflected spells are uncounterable and deal maximum damage per rank.',
    icon: 'spell_holy_sealofprotection',
    maxRanks: 2,
    position: { x: 1, y: 3 },
    requires: 'breaker_t2_reflection_chain',
  },
  {
    id: 'breaker_t3_mirror_field',
    name: 'Mirror Field',
    description: 'Create a 20ft mirror field. Spells targeting allies within the field are reflected back at the caster. Costs 20 AEP.',
    icon: 'spell_arcane_prismaticcloak',
    maxRanks: 1,
    position: { x: 2, y: 3 },
    requires: 'breaker_t2_echo_damage',
  },
  {
    id: 'breaker_t3_spell_nullification',
    name: 'Spell Nullification',
    description: 'Instead of reflecting, you can nullify a spell completely, gaining 3 AEP per spell level per rank.',
    icon: 'spell_shadow_antimagicshell',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'breaker_t2_spell_echo',
  },

  // Tier 4 - Ultimate Disruption
  {
    id: 'breaker_t4_reflection_nova',
    name: 'Reflection Nova',
    description: 'Release a nova of reflected energy, reflecting all spells cast at you this turn and dealing 4d6 arcane damage per reflected spell in 30ft radius. Costs 30 AEP.',
    icon: 'spell_arcane_blast',
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: 'breaker_t3_mirror_field',
  }
];

// Mana Reaver - Spear Point Layout (Offensive, Forward Thrust)
export const SPELLGUARD_MANA_REAVER = [
  // Tier 0 - Foundation (Forward Core)
  {
    id: 'reaver_t0_mana_drain',
    name: 'Mana Drain',
    description: 'Passively absorb magical damage. Gain 2 AEP for every point of fire, cold, lightning, or necrotic damage taken. Gain 1 AEP for every 2 points of physical damage taken.',
    icon: 'spell_arcane_prismaticcloak',
    maxRanks: 1,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - Offensive Enhancement (Forward Momentum)
  {
    id: 'reaver_t1_empowered_strike',
    name: 'Empowered Strike',
    description: 'Empowered Strike costs -5 AEP per rank and deals +1d6 arcane damage per rank.',
    icon: 'ability_warrior_innerrage',
    maxRanks: 3,
    position: { x: 2, y: 1 },
    requires: 'reaver_t0_mana_drain',
  },
  {
    id: 'reaver_t1_mana_vampirism',
    name: 'Mana Vampirism',
    description: 'Melee attacks drain +1 mana per rank and heal you for 1 HP per mana drained.',
    icon: 'spell_shadow_manafeed',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'reaver_t0_mana_drain',
  },
  {
    id: 'reaver_t1_arcane_strike',
    name: 'Arcane Strike',
    description: 'Arcane Strike costs -5 AEP per rank and silences targets for +1 turn per rank.',
    icon: 'spell_holy_blessingofstrength',
    maxRanks: 2,
    position: { x: 3, y: 1 },
    requires: 'reaver_t0_mana_drain',
  },

  // Tier 2 - Drain Mastery (Spear Tip Expansion)
  {
    id: 'reaver_t2_drain_specialization',
    name: 'Drain Specialization',
    description: 'Choose a damage type. Melee attacks drain +50% mana per rank from targets vulnerable to that damage type.',
    icon: 'spell_shadow_siphonmana',
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: 'reaver_t1_mana_vampirism',
  },
  {
    id: 'reaver_t2_burst_damage',
    name: 'Burst Damage',
    description: 'After draining mana, your next attack deals +1d4 arcane damage per 5 mana drained per rank.',
    icon: 'spell_arcane_starfire',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'reaver_t1_empowered_strike',
  },
  {
    id: 'reaver_t2_mana_burn',
    name: 'Mana Burn',
    description: 'When you drain mana, target takes 1 arcane damage per 2 mana drained per rank.',
    icon: 'spell_fire_soulburn',
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: 'reaver_t1_arcane_strike',
  },

  // Tier 3 - Advanced Vampirism (Spear Shaft)
  {
    id: 'reaver_t3_vampiric_empowerment',
    name: 'Vampiric Empowerment',
    description: 'For every 10 mana drained per rank, your next melee attack gains +1 to hit and damage.',
    icon: 'spell_shadow_improvedvampiricembrace',
    maxRanks: 3,
    position: { x: 0, y: 3 },
    requires: 'reaver_t2_drain_specialization',
  },
  {
    id: 'reaver_t3_energy_surge',
    name: 'Energy Surge',
    description: 'Spend 15 AEP to instantly restore mana equal to twice the AEP spent.',
    icon: 'spell_arcane_manatap',
    maxRanks: 1,
    position: { x: 1, y: 3 },
    requires: 'reaver_t2_drain_specialization',
  },
  {
    id: 'reaver_t3_overcharge',
    name: 'Overcharge',
    description: 'Your melee attacks can drain up to 2x normal mana per rank, but you take 1 damage per excess mana.',
    icon: 'spell_lightning_lightningbolt01',
    maxRanks: 3,
    position: { x: 2, y: 3 },
    requires: 'reaver_t2_burst_damage',
  },
  {
    id: 'reaver_t3_arcane_combustion',
    name: 'Arcane Combustion',
    description: 'When you kill a target with a melee attack, deal 3d6 arcane damage per rank to all enemies within 10ft.',
    icon: 'spell_fire_fire',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'reaver_t2_mana_burn',
  },
  {
    id: 'reaver_t3_spell_theft',
    name: 'Spell Theft',
    description: 'When you drain mana from a spellcaster, you can steal one of their prepared spells per rank (usable once before disappearing).',
    icon: 'spell_arcane_portalironforge',
    maxRanks: 2,
    position: { x: 4, y: 3 },
    requires: 'reaver_t2_mana_burn',
  },

  // Tier 4 - Ultimate Drain
  {
    id: 'reaver_t4_mana_rend',
    name: 'Mana Rend',
    description: 'Ultimate ability: Rend all mana from target creature within 30ft. Gain 5 AEP per 10 mana drained. Target cannot cast spells for 1 minute. Costs 25 AEP.',
    icon: 'spell_shadow_siphonmana',
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: 'reaver_t3_overcharge',
  }
];
