export const GAMBIT_PROBABILITY_SAVANT = [
  {
    id: 'ps_t0_balanced_ledger',
    name: 'Balanced Ledger',
    description: 'Your Calculated Risk damage is reduced by 1 per rank (minimum 0). Gain +1 max Fortune per rank. Fortune economy.',
    icon: 'inv_misc_scalesofjustice',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    category: 'fortune_economy'
  },
  {
    id: 'ps_t1_aether_foresight',
    name: 'Aether Foresight',
    description: 'When an enemy within 60ft rolls a saving throw, peek at the top card of your deck per rank. Face card grants enemy disadvantage. Spell modifier.',
    icon: 'inv_misc_tarot_01',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'ps_t0_balanced_ledger',
    category: 'spell_modifier'
  },
  {
    id: 'ps_t1_penny_saved',
    name: 'Penny Saved',
    description: 'Debtor\'s Tax reduced by 1 HP per rank (minimum 0). When you hoard 5+ FP without spending, gain +1d4 psychic to next attack. Fortune economy + Damage.',
    icon: 'inv_misc_coin_01',
    maxRanks: 2,
    position: { x: 3, y: 1 },
    requires: 'ps_t0_balanced_ledger',
    category: 'fortune_economy'
  },
  {
    id: 'ps_t2_card_counter',
    name: 'Card Counter',
    description: 'Track up to +1 enemy per rank. Against tracked enemies, your FP nudges cost 1 less per rank (minimum 0). Spell modifier.',
    icon: 'ability_rogue_findweakness',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'ps_t1_aether_foresight',
    category: 'spell_modifier'
  },
  {
    id: 'ps_t2_soft_landing',
    name: 'Soft Landing',
    description: 'When Fortune hits 0, reduce Cosmic Bankruptcy damage by 1d10 per rank. Still grant vulnerabilities but halve duration per rank. Defensive.',
    icon: 'spell_holy_borrowedtime',
    maxRanks: 2,
    position: { x: 0, y: 2 },
    requires: 'ps_t1_aether_foresight',
    category: 'defensive'
  },
  {
    id: 'ps_t3_law_of_averages',
    name: 'Law of Averages',
    description: 'Once per combat, force any d20 roll to exactly 10. Cost: 3 FP. Usable once more per combat per rank. Spell modifier.',
    icon: 'spell_arcane_arcane04',
    maxRanks: 2,
    position: { x: 2, y: 3 },
    requires: 'ps_t2_card_counter',
    category: 'spell_modifier'
  },
  {
    id: 'ps_t4_probability_savant_capstone',
    name: 'Grand Equation',
    description: 'While you have Fortune equal to your maximum, all your nudges affect the roll by +/- 2 instead of 1 per FP. Win condition.',
    icon: 'inv_misc_platnumdisks',
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: 'ps_t3_law_of_averages',
    category: 'win_condition'
  }
];

export const GAMBIT_HIGH_ROLLER = [
  {
    id: 'hr_t0_double_down',
    name: 'Double Down',
    description: 'When you suffer self-damage from a spell or gamble, gain +1 FP per rank (base 2). Pain is fuel. Fortune economy.',
    icon: 'ability_warrior_endlessrage',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    category: 'fortune_economy'
  },
  {
    id: 'hr_t1_expanded_hand',
    name: 'Expanded Hand',
    description: 'Fate Reserve capacity increased by 10% per rank. Draw 1 additional card per rank when you draw from your magical deck. Fortune economy.',
    icon: 'inv_misc_tarot_01',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'hr_t0_double_down',
    category: 'fortune_economy'
  },
  {
    id: 'hr_t1_all_in',
    name: 'All In',
    description: 'When you spend 5+ FP on a single nudge, deal bonus force damage equal to FP spent per rank. High-stakes damage.',
    icon: 'inv_misc_scalesofjustice',
    maxRanks: 2,
    position: { x: 3, y: 1 },
    requires: 'hr_t0_double_down',
    category: 'damage'
  },
  {
    id: 'hr_t2_desperate_measures',
    name: 'Desperate Measures',
    description: 'Below 50% HP, gain +2 FP per spell cast per rank. Below 25% HP, your nudges ignore the maximum FP cap for that turn. Fortune economy.',
    icon: 'spell_fire_fire',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'hr_t1_expanded_hand',
    category: 'fortune_economy'
  },
  {
    id: 'hr_t2_shockwave_gambler',
    name: 'Shockwave Gambler',
    description: 'When Debtor\'s Tax deals damage to you, enemies within 15ft per rank take 1d4 force damage. Defensive + Damage.',
    icon: 'spell_fire_selfdestruct',
    maxRanks: 2,
    position: { x: 0, y: 2 },
    requires: 'hr_t1_expanded_hand',
    category: 'damage'
  },
  {
    id: 'hr_t3_catastrophic_wager',
    name: 'Catastrophic Wager',
    description: 'Spend half your current HP to gain FP equal to the damage taken. Once per combat, +1 use per rank. Win condition.',
    icon: 'ability_rogue_deadliness',
    maxRanks: 2,
    position: { x: 2, y: 3 },
    requires: 'hr_t2_desperate_measures',
    category: 'win_condition'
  },
  {
    id: 'hr_t4_high_roller_capstone',
    name: 'Jackpot Supreme',
    description: 'When you trigger Cosmic Bankruptcy, instead of the normal effect, deal 4d10 force to all enemies within 30ft and restore 10 FP. Once per long rest. Win condition.',
    icon: 'inv_misc_platnumdisks',
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: 'hr_t3_catastrophic_wager',
    category: 'win_condition'
  }
];

export const GAMBIT_KARMIC_WEAVER = [
  {
    id: 'kw_t0_loaded_deck',
    name: 'Loaded Deck',
    description: 'When drawing from your magical deck, draw +1 card per rank. Choose which to resolve. Deck control.',
    icon: 'inv_misc_tarot_01',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    category: 'deck_control'
  },
  {
    id: 'kw_t1_splintered_loom',
    name: 'Splintered Loom',
    description: 'At 5+ Karmic Debt stacks, spell attacks deal bonus necrotic damage equal to current debt per rank. Damage.',
    icon: 'spell_shadow_curseofsargeras',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'kw_t0_loaded_deck',
    category: 'damage'
  },
  {
    id: 'kw_1_fate_binding',
    name: 'Fate Binding',
    description: 'Link 2 creatures within 30ft per rank. Linked creatures share damage. Links last 2 rounds per rank. Spell modifier.',
    icon: 'spell_arcane_prismaticcloak',
    maxRanks: 2,
    position: { x: 3, y: 1 },
    requires: 'kw_t0_loaded_deck',
    category: 'spell_modifier'
  },
  {
    id: 'kw_t2_debt_harvester',
    name: 'Debt Harvester',
    description: 'When a linked creature takes damage, gain +1 Karmic Debt stack per rank. Convert debt into power. Deck control + Fortune economy.',
    icon: 'inv_misc_scalesofjustice',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'kw_t1_splintered_loom',
    category: 'fortune_economy'
  },
  {
    id: 'kw_t2_strain_redirection',
    name: 'Strain Redirection',
    description: 'When arcane strain from Karmic Debt deals damage to you, redirect 1d4 per rank to a linked creature within 30ft. Defensive.',
    icon: 'spell_holy_borrowedtime',
    maxRanks: 2,
    position: { x: 0, y: 2 },
    requires: 'kw_t1_splintered_loom',
    category: 'defensive'
  },
  {
    id: 'kw_t3_tapestry_anchor',
    name: 'Tapestry Anchor',
    description: 'When you trigger Tapestry Collapse, choose 1 linked creature per rank to be immune to the incapacitation effect. Spell modifier.',
    icon: 'spell_arcane_arcane04',
    maxRanks: 2,
    position: { x: 2, y: 3 },
    requires: 'kw_t2_debt_harvester',
    category: 'spell_modifier'
  },
  {
    id: 'kw_t4_karmic_weaver_capstone',
    name: 'Fate Rewoven',
    description: 'Once per long rest, reset Karmic Debt to 0 and restore all Fortune Points when a linked creature dies. Deal 3d10 psychic per rank to all remaining linked creatures. Win condition.',
    icon: 'inv_misc_platnumdisks',
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: 'kw_t3_tapestry_anchor',
    category: 'win_condition'
  }
];
