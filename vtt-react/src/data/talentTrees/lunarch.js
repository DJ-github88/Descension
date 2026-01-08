// ============================================
// LUNARCH TALENT TREES
// ============================================

export const LUNARCH_MOONLIGHT_SENTINEL = [
  // Foundation: The Archer's Moon (Central targeting reticle)
  {
    id: 'moonlight_sentinel_t0_lunar_precision',
    name: 'Lunar Precision',
    description: 'Your ranged attacks gain +1 to attack rolls. Lunar Arrow and Moonbeam have +10ft range. Full Moon phase grants +1d4 bonus radiant damage on ranged attacks.',
    icon: 'ability_hunter_snipershot',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Left Bow Limb: Precision Enhancement (Upper curve of bow)
  {
    id: 'moonlight_sentinel_t1_true_shot',
    name: 'True Shot',
    description: 'Once per turn when you hit with a ranged attack, you can spend 1 action point to make another ranged attack at advantage.',
    icon: 'ability_hunter_mastermarksman',
    maxRanks: 4,
    position: { x: 1, y: 1 },
    requires: 'moonlight_sentinel_t0_lunar_precision',
  },
  {
    id: 'moonlight_sentinel_t2_lunar_guidance',
    name: 'Lunar Guidance',
    description: 'Your ranged attacks ignore half cover and three-quarters cover. Full Moon phase allows you to attack twice using 1 action point when you crit.',
    icon: 'ability_hunter_focusedaim',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'moonlight_sentinel_t1_true_shot',
  },
  {
    id: 'moonlight_sentinel_t3_marksman_focus',
    name: 'Marksman Focus',
    description: 'You can mark a target using 1 action point. Your next attack against the marked target has advantage and deals +2d6 radiant damage.',
    icon: 'ability_hunter_assassinate',
    maxRanks: 2,
    position: { x: 1, y: 3 },
    requires: 'moonlight_sentinel_t2_lunar_guidance',
  },

  // Right Bow Limb: Damage Amplification (Lower curve of bow)
  {
    id: 'moonlight_sentinel_t1_moonlight_arrow',
    name: 'Moonlight Arrow',
    description: 'Lunar Arrow creates a beam of moonlight that damages all enemies in a line 30ft long and 5ft wide for 2d6 radiant damage.',
    icon: 'spell_nature_lightning',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'moonlight_sentinel_t0_lunar_precision',
  },
  {
    id: 'moonlight_sentinel_t2_radiant_burst',
    name: 'Radiant Burst',
    description: 'Rank 1: When you crit with a ranged attack during Full Moon, all enemies within 10ft of the target take 1d8 radiant damage. Rank 2: When you crit with a ranged attack during Full Moon, all enemies within 10ft of the target take 2d8 radiant damage. Rank 3: When you crit with a ranged attack during Full Moon, all enemies within 10ft of the target take 3d8 radiant damage. Rank 4: When you crit with a ranged attack during Full Moon, all enemies within 10ft of the target take 4d8 radiant damage.',
    icon: 'spell_holy_searinglight',
    maxRanks: 4,
    position: { x: 4, y: 2 },
    requires: 'moonlight_sentinel_t1_moonlight_arrow',
  },
  {
    id: 'moonlight_sentinel_t3_lunar_empowerment',
    name: 'Lunar Empowerment',
    description: 'During Full Moon, your ranged attacks reduce the target\'s radiant resistance by 5 per rank, to a minimum of 0.',
    icon: 'spell_holy_mindvision',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'moonlight_sentinel_t2_radiant_burst',
  },

  // Central Bow String: Critical Enhancement (Connecting string)
  {
    id: 'moonlight_sentinel_t4_deadly_precision',
    name: 'Deadly Precision',
    description: 'Your critical hit range with ranged attacks increases by 1 (crit on 19-20). During Full Moon, critical hits deal maximum damage.',
    icon: 'ability_hunter_rapidkilling',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: ['moonlight_sentinel_t1_true_shot', 'moonlight_sentinel_t1_moonlight_arrow'],
  },
  {
    id: 'moonlight_sentinel_t5_lunar_sentinel',
    name: 'Lunar Sentinel',
    description: 'You can use your reaction to make a ranged attack when an enemy within 30ft casts a spell. Full Moon phase gives +2d6 bonus radiant damage on reaction attacks.',
    icon: 'ability_hunter_piercingshots',
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: ['moonlight_sentinel_t3_marksman_focus', 'moonlight_sentinel_t3_lunar_empowerment'],
  },
  {
    id: 'moonlight_sentinel_t6_celestial_archer',
    name: 'Celestial Archer',
    description: 'Ultimate ability: Summon a celestial bow for 1 minute. All ranged attacks have 120ft range, ignore cover, and deal +4d6 radiant damage. Costs 10 mana.',
    icon: 'ability_hunter_combatexperience',
    maxRanks: 1,
    position: { x: 2, y: 5 },
    requires: 'moonlight_sentinel_t5_lunar_sentinel',
  }
];

export const LUNARCH_STARFALL_INVOKER = [
  // Foundation: The Celestial Nexus (Central star formation)
  {
    id: 'starfall_invoker_t0_cosmic_attunement',
    name: 'Cosmic Attunement',
    description: 'Your spells can be cast as ranged spell attacks. Starfall and Moonbeam affect +5ft radius per rank. Waning Moon phase allows you to affect one extra target with single-target spells.',
    icon: 'spell_arcane_starfire',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Upper Constellation: Area Damage (Northern stars)
  {
    id: 'starfall_invoker_t1_meteor_shower',
    name: 'Meteor Shower',
    description: 'Starfall creates 3 additional meteors that each deal 2d6 fire damage in 10ft radius. Meteors can be directed to different targets.',
    icon: 'spell_fire_meteorstorm',
    maxRanks: 4,
    position: { x: 1, y: 1 },
    requires: 'starfall_invoker_t0_cosmic_attunement',
  },
  {
    id: 'starfall_invoker_t2_celestial_storm',
    name: 'Celestial Storm',
    description: 'When you cast an AoE spell during Full Moon, you can spend 2 extra mana to double the radius and damage (spell level +1).',
    icon: 'spell_nature_starfall',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'starfall_invoker_t1_meteor_shower',
  },
  {
    id: 'starfall_invoker_t3_cosmic_eruption',
    name: 'Cosmic Eruption',
    description: 'Enemies that die from your AoE spells explode, dealing 3d6 force damage to all enemies within 10ft.',
    icon: 'spell_fire_flamebolt',
    maxRanks: 2,
    position: { x: 1, y: 3 },
    requires: 'starfall_invoker_t2_celestial_storm',
  },

  // Lower Constellation: Control Effects (Southern stars)
  {
    id: 'starfall_invoker_t1_astral_bind',
    name: 'Astral Bind',
    description: 'Enemies hit by Starfall are slowed for 1 round. During Waning Moon, slowed enemies are also restrained until the end of their next turn.',
    icon: 'spell_nature_astralrecal',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'starfall_invoker_t0_cosmic_attunement',
  },
  {
    id: 'starfall_invoker_t2_heavenly_retribution',
    name: 'Heavenly Retribution',
    description: 'When an enemy within 60ft casts a spell, you can use your reaction to deal 4d6 radiant damage to them and all enemies within 10ft.',
    icon: 'spell_holy_sealofwrath',
    maxRanks: 4,
    position: { x: 4, y: 2 },
    requires: 'starfall_invoker_t1_astral_bind',
  },
  {
    id: 'starfall_invoker_t3_starfall_supremacy',
    name: 'Starfall Supremacy',
    description: 'Starfall ignores spell resistance and immunity to radiant damage. During Full Moon, Starfall deals maximum damage to all targets.',
    icon: 'spell_nature_starfall',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'starfall_invoker_t2_heavenly_retribution',
  },

  // Connecting Constellations: Multi-Target Mastery
  {
    id: 'starfall_invoker_t4_celestial_convergence',
    name: 'Celestial Convergence',
    description: 'You can cast Starfall at 3rd level instead of 5th. Starfall can be concentrated on for 1 minute, creating a storm that damages enemies each round.',
    icon: 'spell_arcane_portalironforge',
    maxRanks: 2,
    position: { x: 2, y: 1 },
    requires: 'starfall_invoker_t1_meteor_shower',
  },
  {
    id: 'starfall_invoker_t5_cosmic_overload',
    name: 'Cosmic Overload',
    description: 'When you cast Starfall, you can overload it to affect all enemies within 60ft for 1 minute, but you cannot cast Starfall again for 1 minute.',
    icon: 'spell_fire_volcano',
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: ['starfall_invoker_t3_cosmic_eruption', 'starfall_invoker_t3_starfall_supremacy'],
  },
  {
    id: 'starfall_invoker_t6_starfall_invoker',
    name: 'Starfall Invoker',
    description: 'Ultimate ability: Call down a meteor storm for 1 minute. Every round, 10 meteors rain down, each dealing 3d6 fire damage in 5ft radius (choose locations). Costs 15 mana.',
    icon: 'spell_fire_meteorstorm',
    maxRanks: 1,
    position: { x: 2, y: 5 },
    requires: 'starfall_invoker_t5_cosmic_overload',
  }
];

export const LUNARCH_MOONWELL_GUARDIAN = [
  // Foundation: The Sacred Well (Central healing pool)
  {
    id: 'moonwell_guardian_t0_lunar_healing',
    name: 'Lunar Healing',
    description: 'Your healing spells gain +1d6 healing during Waxing Moon. Moonlight Heal can target one additional ally. New Moon regeneration heals 1 additional target within 30ft.',
    icon: 'spell_holy_renew',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Inner Well Rings: Core Healing (Concentric circles of healing)
  {
    id: 'moonwell_guardian_t1_moonwell_sanctuary',
    name: 'Moonwell Sanctuary',
    description: 'You can create a moonwell as an action. Allies within 20ft of the moonwell regain 1d8 HP at the start of their turns and have +1 to saves.',
    icon: 'spell_holy_circleofrenewal',
    maxRanks: 4,
    position: { x: 1, y: 1 },
    requires: 'moonwell_guardian_t0_lunar_healing',
  },
  {
    id: 'moonwell_guardian_t2_protective_aura',
    name: 'Protective Aura',
    description: 'Allies within 10ft of you gain +1 armor and resistance to necrotic damage. During Waxing Moon, this bonus increases to +2 armor.',
    icon: 'spell_holy_devotionaura',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'moonwell_guardian_t1_moonwell_sanctuary',
  },
  {
    id: 'moonwell_guardian_t3_lunar_shield',
    name: 'Lunar Shield',
    description: 'As a reaction when an ally within 30ft takes damage, you can reduce the damage by 2d6 per rank and heal them for the reduced amount.',
    icon: 'spell_holy_powerwordshield',
    maxRanks: 4,
    position: { x: 1, y: 3 },
    requires: 'moonwell_guardian_t2_protective_aura',
  },

  // Outer Well Rings: Group Support (Expanding ripples)
  {
    id: 'moonwell_guardian_t1_lunar_blessing',
    name: 'Lunar Blessing',
    description: 'You can bless an ally using 1 action point. Blessed allies gain +1d6 to their next attack roll, save, or healing received.',
    icon: 'spell_holy_blessingofstrength',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'moonwell_guardian_t0_lunar_healing',
  },
  {
    id: 'moonwell_guardian_t2_mass_restoration',
    name: 'Mass Restoration',
    description: 'Moonlight Heal can affect all allies within 30ft. During Waxing Moon, Moonlight Heal also removes one curse, disease, or poison from each target.',
    icon: 'spell_holy_prayerofhealing',
    maxRanks: 2,
    position: { x: 4, y: 2 },
    requires: 'moonwell_guardian_t1_lunar_blessing',
  },
  {
    id: 'moonwell_guardian_t3_celestial_guardian',
    name: 'Celestial Guardian',
    description: 'Once per turn when an ally within 60ft would be reduced to 0 HP, you can automatically stabilize them and heal them for 3d6 HP.',
    icon: 'spell_holy_holyprotection',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'moonwell_guardian_t2_mass_restoration',
  },

  // Well Convergence: Ultimate Healing Power
  {
    id: 'moonwell_guardian_t4_lunar_resurgence',
    name: 'Lunar Resurgence',
    description: 'When you cast a healing spell, you can spend 2 extra mana to cause excess healing to create a lunar barrier that absorbs the next 2d6 damage per rank.',
    icon: 'spell_holy_layonhands',
    maxRanks: 3,
    position: { x: 2, y: 1 },
    requires: 'moonwell_guardian_t1_moonwell_sanctuary',
  },
  {
    id: 'moonwell_guardian_t5_eternal_moonwell',
    name: 'Eternal Moonwell',
    description: 'Your moonwell becomes permanent and can be created using 1 action point. Allies within 30ft of your moonwell cannot be frightened or charmed.',
    icon: 'spell_holy_divineprovidence',
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: ['moonwell_guardian_t3_lunar_shield', 'moonwell_guardian_t3_celestial_guardian'],
  },
  {
    id: 'moonwell_guardian_t6_lunar_apotheosis',
    name: 'Lunar Apotheosis',
    description: 'Ultimate ability: Create a massive moonwell for 1 minute. All allies within 40ft regain 4d6 HP at the start of each turn and are immune to necrotic damage. Costs 12 mana.',
    icon: 'spell_holy_resurrection',
    maxRanks: 1,
    position: { x: 2, y: 5 },
    requires: 'moonwell_guardian_t5_eternal_moonwell',
  }
];
