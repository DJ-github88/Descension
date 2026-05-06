// ============================================
// PLAGUEBRINGER TALENT TREES — v2
// Each spec changes HOW you garden, not just which buttons you press.
// Virulent Spreader = Field Farmer (play WIDE)
// Torment Weaver = Spider (play CONNECTED)
// Decay Harbinger = Eternal Tree (play DEEP)
// ============================================

export const PLAGUEBRINGER_VIRULENT_SPREADER = [
  {
    id: 'virulent_t0_field_seeding',
    name: 'Field Seeding',
    description: 'Base affliction spells apply to 1 additional adjacent target per rank. Both targets receive the same Seed.',
    icon: 'ability_creature_disease_05',
    maxRanks: 3,
    position: { x: 0, y: 0 },
    requires: null,
  },
  {
    id: 'virulent_t0_rapid_contagion',
    name: 'Rapid Contagion',
    description: 'Fester category spells have +10ft spread range per rank. Contagion triggers deal +1d4 damage per rank.',
    icon: 'spell_shadow_contagion',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
  },
  {
    id: 'virulent_t0_virulence_surge',
    name: 'Virulence Surge',
    description: '+2 Virulence gained per rank when afflictions spread through contagion.',
    icon: 'ability_creature_poison_06',
    maxRanks: 3,
    position: { x: 4, y: 0 },
    requires: null,
  },

  {
    id: 'virulent_t1_auto_contagion',
    name: 'Auto-Contagion',
    description: 'When an affliction reaches Stage 2+, it auto-spreads to 1 adjacent enemy as a Stage 0 Seed. +1 target per rank.',
    icon: 'spell_shadow_plaguecloud',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'virulent_t0_field_seeding',
  },
  {
    id: 'virulent_t1_chain_infection',
    name: 'Chain Infection',
    description: 'Spread afflictions can trigger secondary spreads. +10% chance per rank.',
    icon: 'spell_nature_corrosivebreath',
    maxRanks: 4,
    position: { x: 3, y: 1 },
    requires: 'virulent_t0_rapid_contagion',
  },

  {
    id: 'virulent_t2_pandemic_wave',
    name: 'Pandemic Wave',
    description: 'Fester category spells affect all enemies within 10ft per rank of the primary target.',
    icon: 'spell_shadow_contagion',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'virulent_t0_field_seeding',
  },
  {
    id: 'virulent_t2_viral_burst',
    name: 'Viral Burst',
    description: 'When any affliction reaches its final form, it spreads to all enemies within 15ft as Stage 0 Seeds.',
    icon: 'spell_fire_selfdestruct',
    maxRanks: 1,
    position: { x: 2, y: 2 },
    requires: 'virulent_t1_auto_contagion',
  },
  {
    id: 'virulent_t2_infectious_aura',
    name: 'Infectious Aura',
    description: 'Enemies within 10ft of any target with a Stage 1+ affliction gain a Stage 0 Seed. +5ft radius per rank.',
    icon: 'spell_shadow_plaguecloud',
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: 'virulent_t0_virulence_surge',
  },

  {
    id: 'virulent_t3_wide_harvest',
    name: 'Wide Harvest',
    description: 'Harvest finales (Amplify ending) also deal 50% of their damage to all enemies within 15ft per rank of the target.',
    icon: 'ability_creature_disease_01',
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: 'virulent_t2_pandemic_wave',
  },
  {
    id: 'virulent_t3_plague_zone',
    name: 'Plague Zone',
    description: 'Create a 20ft zone lasting 2 rounds per rank. Enemies entering gain a random Stage 0 Seed affliction.',
    icon: 'spell_shadow_contagion',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'virulent_t2_infectious_aura',
  },

  {
    id: 'virulent_t4_global_pandemic',
    name: 'Global Pandemic',
    description: 'Once per combat: All active afflictions spread to 1 new target each per rank. Spread afflictions retain their current stage.',
    icon: 'spell_shadow_plaguecloud',
    maxRanks: 2,
    position: { x: 2, y: 4 },
    requires: 'virulent_t3_wide_harvest',
    requiresPoints: 20,
  }
];

export const PLAGUEBRINGER_TORMENT_WEAVER = [
  {
    id: 'torment_t0_psychic_link',
    name: 'Psychic Link',
    description: 'When multiple targets have the same base affliction, they become linked. Cultivating one advances all linked targets. Max 2 + 1 per rank linked targets.',
    icon: 'spell_shadow_mindtwisting',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
  },

  {
    id: 'torment_t1_resonance_damage',
    name: 'Resonance Damage',
    description: 'When any linked affliction is activated (advanced, ticks, spreads), all linked targets take +1d4 psychic damage per rank.',
    icon: 'spell_shadow_shadowwordpain',
    maxRanks: 4,
    position: { x: 1, y: 1 },
    requires: 'torment_t0_psychic_link',
  },
  {
    id: 'torment_t1_shared_torment',
    name: 'Shared Torment',
    description: 'Torment category effects on one linked target also apply to 1 additional linked target per rank at 50% potency.',
    icon: 'spell_nature_mirrorimage',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'torment_t0_psychic_link',
  },

  {
    id: 'torment_t2_web_cultivation',
    name: 'Web Cultivation',
    description: 'Casting any category spell on a linked target costs 1 less mana per rank (minimum 1).',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'torment_t1_resonance_damage',
  },
  {
    id: 'torment_t2_nightmare_fuel',
    name: 'Nightmare Fuel',
    description: 'Psychic afflictions reduce enemy spell attack rolls by 1 per rank. Linked targets have shared reduced Spirit saves.',
    icon: 'spell_shadow_mindsteal',
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: 'torment_t1_shared_torment',
  },

  {
    id: 'torment_t3_cascade_finale',
    name: 'Cascade Finale',
    description: 'When a final form triggers on a linked target, all linked targets suffer 50% of the finale effect per rank.',
    icon: 'spell_shadow_mindsteal',
    maxRanks: 2,
    position: { x: 1, y: 3 },
    requires: 'torment_t2_web_cultivation',
  },
  {
    id: 'torment_t3_psychic_storm',
    name: 'Psychic Storm',
    description: 'Create a 30ft storm for 3 rounds. Linked targets inside take 1d8 psychic/turn per rank. Non-linked enemies take half.',
    icon: 'spell_shadow_mindtwisting',
    maxRanks: 4,
    position: { x: 3, y: 3 },
    requires: 'torment_t2_nightmare_fuel',
  },

  {
    id: 'torment_t4_psychic_nexus',
    name: 'Psychic Nexus',
    description: 'Once per combat: All psychic links become permanent (persist even if base affliction type differs). Linked finales now trigger at 75% potency on all linked targets.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 2,
    position: { x: 2, y: 4 },
    requires: 'torment_t3_cascade_finale',
    requiresPoints: 20,
  }
];

export const PLAGUEBRINGER_DECAY_HARBINGER = [
  {
    id: 'decay_t0_infinite_growth',
    name: 'Infinite Growth',
    description: 'Afflictions have no final form. After Stage 3, each category spell adds permanent stacks instead. Max 15 stacks per target. +1 permanent stack type unlocked per rank.',
    icon: 'spell_shadow_deathanddecay',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
  },

  {
    id: 'decay_t1_accelerated_rot',
    name: 'Accelerated Rot',
    description: 'Permanent stacks from Decay category deal +1d4 necrotic/turn per rank. All permanent stacks last until Greater Restoration.',
    icon: 'spell_shadow_contagion',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'decay_t0_infinite_growth',
  },
  {
    id: 'decay_t1_dark_rejuvenation',
    name: 'Dark Rejuvenation',
    description: 'When any permanent stack is applied, you heal for 1d4 HP per rank. Afflicted enemies\' healing is reduced by 1d6 per rank.',
    icon: 'spell_shadow_darkritual',
    maxRanks: 4,
    position: { x: 3, y: 1 },
    requires: 'decay_t0_infinite_growth',
  },

  {
    id: 'decay_t2_withering_touch',
    name: 'Withering Touch',
    description: 'Decay category permanent stacks also reduce healing received by 10% per rank for 3 rounds. Stacks with itself.',
    icon: 'spell_shadow_soulleech',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'decay_t1_accelerated_rot',
  },
  {
    id: 'decay_t2_necrotic_burst',
    name: 'Necrotic Burst',
    description: 'When a target reaches 5+ permanent stacks, they burst for 2d8 necrotic in 15ft radius per rank. Can trigger once per target per combat.',
    icon: 'spell_shadow_deathanddecay',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'decay_t1_accelerated_rot',
  },
  {
    id: 'decay_t2_life_drain',
    name: 'Life Drain',
    description: 'When stacked enemies take damage from any source, you heal for 1d6 HP per rank per 5 permanent stacks on that target.',
    icon: 'spell_shadow_lifedrain02',
    maxRanks: 4,
    position: { x: 4, y: 2 },
    requires: 'decay_t1_dark_rejuvenation',
  },

  {
    id: 'decay_t3_withering_aura',
    name: 'Withering Aura',
    description: 'Targets with 5+ permanent stacks emit a 20ft aura: no healing, 1d6 necrotic/turn per rank to enemies within.',
    icon: 'spell_shadow_plaguecloud',
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: 'decay_t2_withering_touch',
  },
  {
    id: 'decay_t3_eternal_rot',
    name: 'Eternal Rot',
    description: 'Permanent stacks from any category persist even AFTER combat ends. +1 additional permanent stack per rank applied per category spell post-Stage 3.',
    icon: 'spell_shadow_contagion',
    maxRanks: 3,
    position: { x: 2, y: 3 },
    requires: 'decay_t2_necrotic_burst',
  },
  {
    id: 'decay_t3_vampiric_decay',
    name: 'Vampiric Decay',
    description: 'Life Drain heals for double when triggered by Decay category spells. Gain 5 temporary HP per rank per permanent stack on the target.',
    icon: 'spell_shadow_lifedrain02',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'decay_t2_life_drain',
  },

  {
    id: 'decay_t4_necrotic_dominion',
    name: 'Necrotic Dominion',
    description: 'All enemies within 40ft of targets with 10+ permanent stacks have healing reduced by 50%. You gain 25% lifesteal on all damage to stacked targets.',
    icon: 'spell_shadow_deathanddecay',
    maxRanks: 2,
    position: { x: 0, y: 4 },
    requires: 'decay_t3_withering_aura',
    requiresPoints: 15,
  },
  {
    id: 'decay_t4_total_collapse',
    name: 'Total Collapse',
    description: 'When a target with 10+ permanent stacks dies, all their stacks spread to enemies within 20ft as fresh Stage 0 Seeds with 3 permanent stacks each.',
    icon: 'spell_shadow_deathanddecay',
    maxRanks: 2,
    position: { x: 2, y: 4 },
    requires: 'decay_t3_eternal_rot',
    requiresPoints: 20,
  },
  {
    id: 'decay_t4_apocalyptic_decay',
    name: 'Apocalyptic Decay',
    description: 'All Decay category spells affect all enemies within 25ft of the target. Each enemy hit gains permanent stacks independently.',
    icon: 'spell_shadow_deathanddecay',
    maxRanks: 2,
    position: { x: 4, y: 4 },
    requires: 'decay_t3_vampiric_decay',
    requiresPoints: 15,
  }
];
