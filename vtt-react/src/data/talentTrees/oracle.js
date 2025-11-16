// ============================================
// ORACLE TALENT TREES
// ============================================

export const ORACLE_SEER = [
  // Tier 0 - Crystal core (scrying center)
  {
    id: 'seer_t0_clairvoyance',
    name: 'Clairvoyance',
    description: 'Gain clairvoyant senses. Once per day, see and hear a creature within 1 mile. Range increases by 1 mile per rank.',
    icon: 'spell_holy_farsight',
    maxRanks: 3,
    position: { x: 2, y: 1 },
    requires: null,
  },

  // Tier 1 - Crystal facets (scrying angles)
  {
    id: 'seer_t1_future_vision',
    name: 'Future Vision',
    description: 'Glimpse possible futures. Once per combat, gain advantage on an attack roll or save. Can use this ability +1 time per rank.',
    icon: 'spell_holy_mindvision',
    maxRanks: 4,
    position: { x: 1, y: 0 },
    requires: 'seer_t0_clairvoyance',
  },
  {
    id: 'seer_t1_prescience',
    name: 'Prescience',
    description: 'Sense immediate threats. You cannot be surprised and have +1 armor against opportunity attacks per rank.',
    icon: 'spell_holy_heroism',
    maxRanks: 3,
    position: { x: 3, y: 0 },
    requires: 'seer_t0_clairvoyance',
  },
  {
    id: 'seer_t1_fortune_telling',
    name: 'Fortune Telling',
    description: 'Read fortunes in various media. Once per long rest, ask the DM 1 yes/no question about the future per rank.',
    icon: 'inv_misc_rune_01',
    maxRanks: 2,
    position: { x: 0, y: 1 },
    requires: 'seer_t0_clairvoyance',
  },
  {
    id: 'seer_t1_prophecy',
    name: 'Prophecy',
    description: 'Deliver prophecies. Creatures within 30ft have disadvantage on deception checks against you. Range increases by 10ft per rank.',
    icon: 'spell_holy_divineprovidence',
    maxRanks: 3,
    position: { x: 4, y: 1 },
    requires: 'seer_t0_clairvoyance',
  },

  // Tier 2 - Crystal rings (expanding visions)
  {
    id: 'seer_t2_foresight',
    name: 'Foresight',
    description: 'See the immediate future. You cannot be surprised and attacks against you have disadvantage.',
    icon: 'spell_holy_mindsoothe',
    maxRanks: 2,
    position: { x: 2, y: 0 },
    requires: 'seer_t1_future_vision',
  },
  {
    id: 'seer_t2_true_seeing',
    name: 'True Seeing',
    description: 'See through illusions and invisibility. You automatically detect hidden creatures within 30ft.',
    icon: 'spell_shadow_detectinvisibility',
    maxRanks: 1,
    position: { x: 1, y: 2 },
    requires: 'seer_t1_fortune_telling',
  },
  {
    id: 'seer_t2_scrying',
    name: 'Scrying',
    description: 'Master scrying magic. Once per day, scry on a creature you have seen within the last 24 hours. Duration increases by 10 minutes per rank.',
    icon: 'spell_arcane_portalironforge',
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: 'seer_t1_prophecy',
  },

  // Tier 3 - Crystal clarity (perfect visions)
  {
    id: 'seer_t3_oracle_of_fate',
    name: 'Oracle of Fate',
    description: 'Become an oracle of fate. You can see the HP and armor of creatures within 60ft.',
    icon: 'spell_holy_mindvision',
    maxRanks: 1,
    position: { x: 0, y: 2 },
    requires: 'seer_t2_true_seeing',
  },
  {
    id: 'seer_t3_fate_reveal',
    name: 'Fate Reveal',
    description: 'Reveal hidden fates. Once per day, learn one secret about a creature you can see.',
    icon: 'spell_holy_searinglightpriest',
    maxRanks: 2,
    position: { x: 4, y: 2 },
    requires: 'seer_t2_scrying',
  },

  // Tier 4 - Crystal apex (ultimate foresight)
  {
    id: 'seer_t4_timeless_body',
    name: 'Timeless Body',
    description: 'Your body becomes timeless. You age at half the normal rate and are immune to magical aging.',
    icon: 'spell_holy_exorcism',
    maxRanks: 1,
    position: { x: 0, y: 3 },
    requires: 'seer_t3_oracle_of_fate',
  },
  {
    id: 'seer_t4_foresight_supreme',
    name: 'Foresight Supreme',
    description: 'Achieve supreme foresight. You can see 1 minute into the future and act accordingly.',
    icon: 'spell_holy_divineintervention',
    maxRanks: 1,
    position: { x: 2, y: 3 },
    requires: 'seer_t3_oracle_of_fate',
  },
  {
    id: 'seer_t4_prophetic_visions',
    name: 'Prophetic Visions',
    description: 'Receive prophetic visions. Once per month, receive a vision of a major future event.',
    icon: 'spell_holy_holyguidance',
    maxRanks: 1,
    position: { x: 4, y: 3 },
    requires: 'seer_t3_fate_reveal',
  },

  // Tier 5 - Crystal supremacy (divine omniscience)
  {
    id: 'seer_t5_divine_omniscience',
    name: 'Divine Omniscience',
    description: 'Achieve divine omniscience. You know everything that happens within 1 mile and can see all possible futures.',
    icon: 'spell_holy_mindsoothe',
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: ['seer_t4_timeless_body', 'seer_t4_foresight_supreme', 'seer_t4_prophetic_visions'],
    requiresAll: true,
  }
];

// Truthseeker Specialization - Spiral revelation pattern (historical scroll)
export const ORACLE_TRUTHSEEKER = [
  // Tier 0 - Scroll origin (truth foundation)
  {
    id: 'truth_t0_detect_lies',
    name: 'Detect Lies',
    description: 'Automatically detect lies. Creatures have disadvantage on deception checks against you. Can detect lies from +1 creature per rank.',
    icon: 'spell_holy_searinglightpriest',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - First scroll layer (initial revelations)
  {
    id: 'truth_t1_reveal_hidden',
    name: 'Reveal Hidden',
    description: 'Reveal hidden truths. Once per day, learn if a creature is lying about a specific topic. Can use this ability +1 time per rank.',
    icon: 'spell_shadow_detectinvisibility',
    maxRanks: 4,
    position: { x: 3, y: 0 },
    requires: 'truth_t0_detect_lies',
  },
  {
    id: 'truth_t1_past_vision',
    name: 'Past Vision',
    description: 'See into the past. Once per day, witness an event that occurred up to 24 hours ago.',
    icon: 'spell_holy_mindvision',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'truth_t0_detect_lies',
  },

  // Tier 2 - Second scroll layer (expanding knowledge)
  {
    id: 'truth_t2_zone_of_truth',
    name: 'Zone of Truth',
    description: 'Create zones of truth. Creatures in 15ft radius cannot lie and illusions are revealed.',
    icon: 'spell_holy_divineprovidence',
    maxRanks: 2,
    position: { x: 4, y: 1 },
    requires: 'truth_t1_reveal_hidden',
  },
  {
    id: 'truth_t2_mind_reading',
    name: 'Mind Reading',
    description: 'Read surface thoughts. Once per day, read a creature\'s thoughts for 1 minute.',
    icon: 'spell_shadow_telepathy',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'truth_t1_past_vision',
  },
  {
    id: 'truth_t2_historical_knowledge',
    name: 'Historical Knowledge',
    description: 'Access historical knowledge. You know the history of any location or object you examine.',
    icon: 'inv_misc_book_09',
    maxRanks: 2,
    position: { x: 2, y: 2 },
    requires: 'truth_t1_reveal_hidden',
  },

  // Tier 3 - Third scroll layer (deep revelations)
  {
    id: 'truth_t3_discern_lies',
    name: 'Discern Lies',
    description: 'Master lie detection. You automatically know when someone is lying to you.',
    icon: 'spell_holy_righteousnessaura',
    maxRanks: 1,
    position: { x: 3, y: 2 },
    requires: 'truth_t2_historical_knowledge',
  },
  {
    id: 'truth_t3_true_sight',
    name: 'True Sight',
    description: 'See all truths. You see through all illusions, invisibility, and detect all hidden creatures.',
    icon: 'spell_shadow_antimagicshell',
    maxRanks: 1,
    position: { x: 1, y: 3 },
    requires: 'truth_t2_mind_reading',
  },

  // Tier 4 - Scroll apex (ultimate revelations)
  {
    id: 'truth_t4_legend_lore',
    name: 'Legend Lore',
    description: 'Master legendary knowledge. Learn the complete history and purpose of any object or location.',
    icon: 'inv_misc_book_08',
    maxRanks: 1,
    position: { x: 4, y: 3 },
    requires: 'truth_t3_discern_lies',
  },
  {
    id: 'truth_t4_deep_memory',
    name: 'Deep Memory',
    description: 'Access deep memories. Extract forgotten memories from creatures and objects.',
    icon: 'spell_shadow_mindtwisting',
    maxRanks: 2,
    position: { x: 2, y: 4 },
    requires: 'truth_t3_discern_lies',
  },
  {
    id: 'truth_t4_reality_check',
    name: 'Reality Check',
    description: 'Check reality itself. Once per day, determine if something is an illusion or real.',
    icon: 'spell_holy_restoration',
    maxRanks: 1,
    position: { x: 0, y: 4 },
    requires: 'truth_t3_true_sight',
  },

  // Tier 5 - Scroll completion (ultimate truth)
  {
    id: 'truth_t5_omniscient_truth',
    name: 'Omniscient Truth',
    description: 'Achieve omniscient truth. You know all truths, see all illusions, and can reveal any hidden knowledge.',
    icon: 'spell_holy_searinglightpriest',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['truth_t4_legend_lore', 'truth_t4_deep_memory', 'truth_t4_reality_check'],
    requiresAll: true,
  }
];

// Destiny Weaver Specialization - Web network pattern (fate connections)
export const ORACLE_DESTINY_WEAVER = [
  // Tier 0 - Web center (fate nexus)
  {
    id: 'dest_t0_fate_binding',
    name: 'Fate Binding',
    description: 'Bind threads of fate. Once per day, force a creature to reroll a failed attack roll.',
    icon: 'spell_arcane_prismaticcloak',
    maxRanks: 3,
    position: { x: 2, y: 1 },
    requires: null,
  },

  // Tier 1 - First web strands (initial connections)
  {
    id: 'dest_t1_lucky_break',
    name: 'Lucky Break',
    description: 'Create lucky breaks. Once per combat, grant yourself or an ally advantage on any roll. Can use this ability +1 time per rank.',
    icon: 'spell_holy_layonhands',
    maxRanks: 4,
    position: { x: 1, y: 0 },
    requires: 'dest_t0_fate_binding',
  },
  {
    id: 'dest_t1_ill_omen',
    name: 'Ill Omen',
    description: 'Weave ill omens. Once per day, force a creature to reroll a successful attack roll.',
    icon: 'spell_shadow_curseofsargeras',
    maxRanks: 3,
    position: { x: 3, y: 0 },
    requires: 'dest_t0_fate_binding',
  },
  {
    id: 'dest_t1_fate_link',
    name: 'Fate Link',
    description: 'Link fates together. Damage you take can be redirected to another creature within 30ft.',
    icon: 'spell_shadow_unstableaffliction',
    maxRanks: 2,
    position: { x: 2, y: 0 },
    requires: 'dest_t0_fate_binding',
  },

  // Tier 2 - Web expansion (growing network)
  {
    id: 'dest_t2_twist_fate',
    name: 'Twist Fate',
    description: 'Twist threads of fate. Once per day, change any die roll result by ±1d6 per rank.',
    icon: 'spell_arcane_portaldarnassus',
    maxRanks: 3,
    position: { x: 0, y: 1 },
    requires: 'dest_t1_lucky_break',
  },
  {
    id: 'dest_t2_cursed_fate',
    name: 'Cursed Fate',
    description: 'Curse enemy fates. Once per day, give a creature disadvantage on all rolls for 1 minute.',
    icon: 'spell_shadow_antishadow',
    maxRanks: 2,
    position: { x: 4, y: 1 },
    requires: 'dest_t1_ill_omen',
  },

  // Tier 3 - Web intersections (fate crossroads)
  {
    id: 'dest_t3_fate_sever',
    name: 'Fate Sever',
    description: 'Sever fate threads. Once per day, end one magical effect or condition affecting a creature.',
    icon: 'spell_shadow_siphonmana',
    maxRanks: 2,
    position: { x: 1, y: 2 },
    requires: 'dest_t2_twist_fate',
  },
  {
    id: 'dest_t3_destiny_weave',
    name: 'Destiny Weave',
    description: 'Weave new destinies. Once per day, give yourself or an ally +2d6 to all rolls for 1 minute.',
    icon: 'spell_holy_prayerofmendingtga',
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: 'dest_t2_cursed_fate',
  },

  // Tier 4 - Web mastery (fate control nexus)
  {
    id: 'dest_t4_rewrite_fate',
    name: 'Rewrite Fate',
    description: 'Rewrite fate itself. Once per day, retroactively change one event from the last minute.',
    icon: 'spell_holy_borrowedtime',
    maxRanks: 1,
    position: { x: 0, y: 3 },
    requires: 'dest_t3_fate_sever',
  },
  {
    id: 'dest_t4_fate_shield',
    name: 'Fate Shield',
    description: 'Create fate shields. You and allies within 30ft automatically succeed on one save per day.',
    icon: 'spell_holy_divineintervention',
    maxRanks: 2,
    position: { x: 4, y: 3 },
    requires: 'dest_t3_destiny_weave',
  },

  // Tier 5 - Web supremacy (ultimate fate network)
  {
    id: 'dest_t5_destiny_weaver_supreme',
    name: 'Destiny Weaver Supreme',
    description: 'Become the supreme destiny weaver. You control all fates within 100ft and can manipulate destiny at will.',
    icon: 'spell_arcane_prismaticcloak',
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: ['dest_t4_rewrite_fate', 'dest_t4_fate_shield', 'dest_t3_fate_sever'],
    requiresAll: true,
  }
];
